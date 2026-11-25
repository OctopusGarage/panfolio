#!/usr/bin/env python3
"""Read Panfolio's public, integrity-checked content feed. Never writes data."""
import argparse
import hashlib
import json
import re
import sys
import urllib.parse
import urllib.request
import urllib.error

BASE = 'https://octopusgarage.github.io/panfolio/ai/'
HEX = re.compile(r'^[0-9a-f]{64}$')
ID = re.compile(r'^[a-zA-Z0-9][a-zA-Z0-9._-]*$')

class FeedError(Exception):
    pass

class Redirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        before, after = urllib.parse.urlsplit(req.full_url), urllib.parse.urlsplit(newurl)
        if before.netloc != after.netloc or before.scheme != after.scheme:
            raise FeedError('Cross-origin redirect rejected')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

class Feed:
    def __init__(self, base, version=None):
        p = urllib.parse.urlsplit(base)
        if p.username or p.password or p.query or p.fragment or not p.hostname or not (p.scheme == 'https' or p.scheme == 'http' and p.hostname in ('localhost', '127.0.0.1', '::1')):
            raise FeedError('Invalid base URL')
        if version is not None and not HEX.fullmatch(version):
            raise FeedError('Invalid pinned version')
        self.base, self.pin = base.rstrip('/') + '/', version
        self.opener = urllib.request.build_opener(Redirect())
        self.load()

    def read(self, path, digest=None):
        if not isinstance(path, str) or not re.fullmatch(r'[A-Za-z0-9_./-]+', path) or path.startswith('/') or any(x in ('', '.', '..') for x in path.split('/')):
            raise FeedError('Unsafe resource path')
        with self.opener.open(self.base + path, timeout=10) as response:
            data = response.read(2 * 1024 * 1024 + 1)
        if len(data) > 2 * 1024 * 1024:
            raise FeedError('Resource too large')
        if digest is not None and (not isinstance(digest, str) or not HEX.fullmatch(digest) or hashlib.sha256(data).hexdigest() != digest):
            raise FeedError('SHA256 mismatch')
        def pairs(items):
            result = {}
            for k, v in items:
                if k in result:
                    raise FeedError('Duplicate JSON key')
                result[k] = v
            return result
        return json.loads(data, object_pairs_hook=pairs, parse_constant=lambda _: (_ for _ in ()).throw(FeedError('Invalid JSON constant')))

    def checked(self, record):
        if not isinstance(record, dict):
            raise FeedError('Invalid content record')
        if record.get('schemaVersion') != 1 or record.get('contentVersion') != self.version:
            raise FeedError('Content version mismatch')
        return record

    def load(self):
        manifest = self.read('manifest.json')
        if not isinstance(manifest, dict):
            raise FeedError('Invalid manifest')
        self.version = manifest.get('contentVersion')
        if manifest.get('schemaVersion') != 1 or not isinstance(self.version, str) or not HEX.fullmatch(self.version):
            raise FeedError('Invalid manifest')
        if self.pin and self.pin != self.version:
            raise FeedError('Pinned version unavailable')
        self.catalog = self.checked(self.resource(manifest['catalog']))

    def resource(self, pointer):
        if not isinstance(pointer, dict) or not isinstance(pointer.get('sha256'), str) or not HEX.fullmatch(pointer['sha256']):
            raise FeedError('Invalid resource checksum')
        return self.read(pointer['path'], pointer['sha256'])

    def run(self, args):
        entries = self.catalog['entries']
        if args.command == 'search':
            query = args.query.strip().casefold()
            if not query:
                raise FeedError('Query cannot be empty')
            def matches(text):
                text = text.casefold()
                return all(t in text for t in query.split())
            found = []
            for e in entries:
                if args.kind != 'all' and e['kind'] != args.kind or args.category and e.get('category') != args.category:
                    continue
                preps = [p['id'] for p in e.get('preparations', []) if matches(' '.join(p['title'].values()) + ' ' + ' '.join(p.get('searchTerms', []))) ]
                if preps or matches(' '.join(e['title'].values()) + ' ' + ' '.join(e.get('searchTerms', []))):
                    found.append({'kind': e['kind'], 'id': e['id'], 'title': e['title'][args.lang], 'summary': e['summary'][args.lang], 'preparationIds': preps, '_rank': query in [t.casefold() for t in e['title'].values()]})
            found.sort(key=lambda e: (not e['_rank'], e['id']))
            for item in found:
                del item['_rank']
            return {'contentVersion': self.version, 'matches': found[:args.limit]}
        for value in (args.id, getattr(args, 'preparation', None)):
            if value is not None and (not ID.fullmatch(value) or '..' in value):
                raise FeedError('Invalid ID')
        entry = next((e for e in entries if e['kind'] == args.command and e['id'] == args.id), None)
        if entry is None:
            raise FeedError('Unknown ID')
        if getattr(args, 'preparation', None):
            entry = next((p for p in entry.get('preparations', []) if p['id'] == args.preparation), None)
            if entry is None:
                raise FeedError('Unknown preparation')
        record = self.checked(self.resource(entry['resource']))
        if getattr(args, 'preparation', None):
            if record.get('kind') != 'preparation' or record.get('parentId') != args.id or record.get('preparationId') != args.preparation:
                raise FeedError('Preparation identity mismatch')
        elif record.get('kind') != args.command or record.get('id') != args.id:
            raise FeedError('Content identity mismatch')
        return {**record, 'title': record['title'][args.lang], 'content': record['content'][args.lang]}

class JSONParser(argparse.ArgumentParser):
    def error(self, message):
        print(json.dumps({'error': message}), file=sys.stderr)
        raise SystemExit(2)

def main():
    parser = JSONParser(description=__doc__)
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument('--base-url', default=BASE)
    common.add_argument('--version')
    common.add_argument('--lang', choices=['zh', 'en'], default='en')
    sub = parser.add_subparsers(dest='command', required=True)
    search = sub.add_parser('search', parents=[common])
    search.add_argument('query')
    search.add_argument('--kind', choices=['recipe', 'reference', 'all'], default='all')
    search.add_argument('--category', choices=['chinese', 'japanese', 'dessert'])
    search.add_argument('--limit', type=int, choices=range(1, 21), default=10)
    for name in ('recipe', 'reference'):
        p = sub.add_parser(name, parents=[common])
        p.add_argument('id')
        if name == 'recipe':
            p.add_argument('--preparation')
    args = parser.parse_args()
    try:
        for attempt in range(2):
            try:
                feed = Feed(args.base_url, args.version)
                result = feed.run(args)
                break
            except (FeedError, urllib.error.HTTPError) as exc:
                if args.version or attempt or not ('version mismatch' in str(exc) or isinstance(exc, urllib.error.HTTPError) and exc.code == 404):
                    raise
        print(json.dumps(result, ensure_ascii=False, allow_nan=False))
        return 0
    except Exception as exc:
        print(json.dumps({'error': str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1

if __name__ == '__main__':
    sys.exit(main())
