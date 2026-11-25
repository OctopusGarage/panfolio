import copy
import hashlib
import importlib.util
import json
import pathlib
import subprocess
import sys
import tempfile
import threading
import unittest
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from types import SimpleNamespace

PATH = pathlib.Path(__file__).resolve().parents[1] / 'skills/panfolio/scripts/panfolio.py'
spec = importlib.util.spec_from_file_location('panfolio_helper', PATH)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
VERSION = 'a' * 64

def encoded(value):
    return json.dumps(value, ensure_ascii=False).encode()

def fixture():
    files = {}
    def store(path, value):
        data = encoded(value)
        files[path] = data
        return {'path': path, 'sha256': hashlib.sha256(data).hexdigest()}
    def record(kind, ident, **fields):
        return {'schemaVersion': 1, 'contentVersion': VERSION, 'kind': kind, 'id': ident, 'title': {'zh':'土豆','en':'Potato'}, 'content': {'zh':'土豆步骤','en':'Potato steps'}, 'sources':['https://www.youtube.com/watch?v=12345678901'], **fields}
    original = store('recipes/original.json', record('recipe', '01.-sample'))
    prep = store('preparations/rolls.json', record('preparation', 'asparagus--rolls', parentId='asparagus', preparationId='rolls', preparationKind='dish', content={'zh':'肉卷：先包再切','en':'Rolls: wrap before cutting'}))
    parent = store('recipes/asparagus.json', record('recipe','asparagus'))
    reference = store('essentials/potato.json', record('reference','potato',content={'zh':{'steps':['切薄片'],'boundary':'按用途选择'},'en':{'steps':['Slice thinly'],'boundary':'Choose for the dish'}}))
    catalog = {'schemaVersion':1,'contentVersion':VERSION,'entries':[
        {'kind':'recipe','id':'01.-sample','title':{'zh':'土豆','en':'Potato'},'summary':{'zh':'土豆做法','en':'Potato method'},'category':'chinese','searchTerms':['马铃薯'],'resource':original},
        {'kind':'recipe','id':'asparagus','title':{'zh':'芦笋两吃','en':'Two asparagus dishes'},'summary':{'zh':'两种做法','en':'Two preparations'},'category':'japanese','searchTerms':[], 'resource':parent,'preparations':[
            {'id':'rolls','kind':'dish','title':{'zh':'肉卷','en':'Rolls'},'searchTerms':['pork','egg'],'resource':prep},
            {'id':'basic','kind':'dish','title':{'zh':'香煎','en':'Seared'},'searchTerms':['potato'],'resource':prep}]},
        {'kind':'reference','id':'potato','title':{'zh':'土豆切丝','en':'Potato julienne'},'summary':{'zh':'切土豆丝','en':'Cut potato strips'},'searchTerms':['马铃薯'],'resource':reference}
    ]}
    pointer = store('catalog.json',catalog)
    files['manifest.json'] = encoded({'schemaVersion':1,'contentVersion':VERSION,'catalog':pointer})
    return files

class HelperTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                cls.requests.append(self.path)
                data = cls.files.get(self.path.removeprefix('/ai/'))
                if data is None:
                    self.send_error(404); return
                self.send_response(200); self.send_header('Content-Length',str(len(data))); self.end_headers(); self.wfile.write(data)
            def log_message(self,*args):
                pass
        cls.server=ThreadingHTTPServer(('127.0.0.1',0), Handler)
        cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start()
        cls.base=f'http://127.0.0.1:{cls.server.server_port}/ai/'
    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown();cls.server.server_close();cls.thread.join()
    def setUp(self):
        type(self).files=fixture();type(self).requests=[]
    def cli(self,*args):
        with tempfile.TemporaryDirectory() as directory:
            return subprocess.run([sys.executable,str(PATH),*args,'--base-url',self.base],cwd=directory,capture_output=True,text=True,timeout=15)
    def test_reject_base(self):
        for url in ['http://example.com/','file:///tmp/','https://user:pass@example.com/']:
            with self.assertRaises(helper.FeedError): helper.Feed(url)
    def test_paths(self):
        feed=object.__new__(helper.Feed)
        for path in ['../secret','/absolute','https://evil/a','a/../b','a%2fb']:
            with self.assertRaises(helper.FeedError): feed.read(path)
    def test_versions(self):
        feed=object.__new__(helper.Feed);feed.version=VERSION
        with self.assertRaises(helper.FeedError): feed.checked({'schemaVersion':1,'contentVersion':'b'*64})
    def test_offline_help(self):
        result=subprocess.run([sys.executable,str(PATH),'--help'],capture_output=True,text=True)
        self.assertEqual(result.returncode,0);self.assertIn('search',result.stdout);self.assertEqual(self.requests,[])
    def test_original_ids_with_dots_and_localized_content(self):
        result=self.cli('recipe','01.-sample','--lang','zh','--version',VERSION)
        self.assertEqual(result.returncode,0,result.stderr);self.assertEqual(json.loads(result.stdout)['content'],'土豆步骤')
    def test_selected_preparation_identity(self):
        result=self.cli('recipe','asparagus','--preparation','rolls','--lang','en')
        self.assertEqual(result.returncode,0,result.stderr);data=json.loads(result.stdout)
        self.assertEqual(data['content'],'Rolls: wrap before cutting');self.assertEqual(data['preparationId'],'rolls')
    def test_search_does_not_combine_sibling_ingredients(self):
        result=self.cli('search','egg potato')
        self.assertEqual(result.returncode,0,result.stderr);self.assertEqual(json.loads(result.stdout)['matches'],[])
        result=self.cli('search','马铃薯','--lang','zh')
        self.assertEqual(len(json.loads(result.stdout)['matches']),2)
    def test_reference_structure(self):
        result=self.cli('reference','potato','--lang','en')
        self.assertEqual(json.loads(result.stdout)['content']['steps'],['Slice thinly'])
    def test_hash_mismatch_fails_without_retry(self):
        self.files['recipes/original.json'] += b' '
        result=self.cli('recipe','01.-sample')
        self.assertNotEqual(result.returncode,0);self.assertIn('SHA256',json.loads(result.stderr)['error'])
        self.assertEqual(self.requests.count('/ai/manifest.json'),1)
    def test_missing_checksum_cannot_disable_verification(self):
        manifest=json.loads(self.files['manifest.json']);manifest['catalog']['sha256']=None;self.files['manifest.json']=encoded(manifest)
        result=self.cli('search','potato')
        self.assertNotEqual(result.returncode,0);self.assertIn('checksum',json.loads(result.stderr)['error'])
    def test_pinned_version_never_silently_updates(self):
        result=self.cli('recipe','01.-sample','--version','b'*64)
        self.assertNotEqual(result.returncode,0);self.assertIn('Pinned version',json.loads(result.stderr)['error'])
        self.assertEqual(self.requests.count('/ai/manifest.json'),1)
    def test_missing_resource_retries_only_once(self):
        del self.files['recipes/original.json']
        result=self.cli('recipe','01.-sample')
        self.assertNotEqual(result.returncode,0);self.assertEqual(self.requests.count('/ai/manifest.json'),2)
    def test_invalid_id_and_unknown_id_do_not_escape(self):
        for ident in ['../../secret','missing']:
            result=self.cli('recipe',ident)
            self.assertNotEqual(result.returncode,0);self.assertIn('error',json.loads(result.stderr))
        self.assertTrue(all(path in ['/ai/manifest.json','/ai/catalog.json'] for path in self.requests))
    def test_oversize_and_duplicate_json_fail_closed(self):
        self.files['manifest.json']=b' '*(2*1024*1024+1)
        with self.assertRaisesRegex(helper.FeedError,'too large'): helper.Feed(self.base)
        self.files['manifest.json']=b'{"schemaVersion":1,"schemaVersion":1}'
        with self.assertRaisesRegex(helper.FeedError,'Duplicate'): helper.Feed(self.base)
    def test_cross_origin_redirects_rejected(self):
        for target in ['http://example.com/file','https://other.example/file']:
            with self.assertRaises(helper.FeedError): helper.Redirect().redirect_request(urllib.request.Request('https://example.com/file'),None,302,'',{},target)
    def test_argument_error_is_json(self):
        result=self.cli('search','potato','--limit','50')
        self.assertEqual(result.returncode,2);self.assertIn('error',json.loads(result.stderr))

if __name__=='__main__': unittest.main()
