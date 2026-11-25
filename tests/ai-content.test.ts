import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createAiFeed } from "../scripts/ai-content";
import recipes from "../src/recipes.json";
import { essentials } from "../src/kitchen-essentials";
import { recipeDiscovery } from "../src/discovery";
import { bodyForPreparation } from "../src/preparation-content";
const sha = (body: string) => createHash("sha256").update(body).digest("hex");

test("AI feed is deterministic, complete and hash-addressed", () => {
  const feed = createAiFeed();
  assert.deepEqual(feed, createAiFeed());
  const manifest = JSON.parse(feed["manifest.json"]);
  const catalog = JSON.parse(feed[manifest.catalog.path]);
  assert.equal(sha(feed[manifest.catalog.path]), manifest.catalog.sha256);
  assert.deepEqual(manifest.counts, {
    recipes: recipes.length,
    references: essentials.length,
    preparations: recipeDiscovery.reduce(
      (n, r) => n + r.preparations.length,
      0,
    ),
  });
  assert.deepEqual(
    catalog.categories.map((c: { id: string }) => c.id),
    ["chinese", "japanese", "dessert"],
  );
  assert.equal(catalog.entries.length, recipes.length + essentials.length);
  for (const entry of catalog.entries) {
    for (const pointer of [
      entry.resource,
      ...(entry.preparations || []).map(
        (p: { resource: unknown }) => p.resource,
      ),
    ]) {
      assert.equal(sha(feed[pointer.path]), pointer.sha256);
      const record = JSON.parse(feed[pointer.path]);
      assert.equal(record.contentVersion, manifest.contentVersion);
      assert.equal(record.schemaVersion, 1);
    }
  }
});
test("AI preparation export exactly reuses the reviewed bilingual selector", () => {
  const feed = createAiFeed();
  const manifest = JSON.parse(feed["manifest.json"]);
  const catalog = JSON.parse(feed[manifest.catalog.path]);
  for (const record of recipeDiscovery) {
    const recipe = recipes.find((r) => r.id === record.id)!;
    const entry = catalog.entries.find(
      (e: { kind: string; id: string }) =>
        e.kind === "recipe" && e.id === record.id,
    );
    for (const prep of record.preparations) {
      const pointer = entry.preparations.find(
        (p: { id: string }) => p.id === prep.id,
      ).resource;
      const exported = JSON.parse(feed[pointer.path]);
      assert.equal(exported.parentId, recipe.id);
      assert.equal(exported.preparationId, prep.id);
      assert.equal(exported.preparationKind, prep.kind);
      assert.deepEqual(exported.content, {
        zh: bodyForPreparation(recipe, prep, "zh"),
        en: bodyForPreparation(recipe, prep, "en"),
      });
    }
  }
});
test("AI references preserve conditions, neutral associations and original sources", () => {
  const feed = createAiFeed();
  const manifest = JSON.parse(feed["manifest.json"]);
  const catalog = JSON.parse(feed[manifest.catalog.path]);
  for (const entry of essentials) {
    const item = catalog.entries.find(
      (e: { kind: string; id: string }) =>
        e.kind === "reference" && e.id === entry.id,
    );
    const exported = JSON.parse(feed[item.resource.path]);
    assert.deepEqual(exported.sources, entry.sources);
    for (const [lang, suffix] of [
      ["zh", ""],
      ["en", "En"],
    ] as const) {
      for (const field of [
        "scope",
        "steps",
        "reasons",
        "mistakes",
        "boundary",
      ] as const)
        assert.deepEqual(
          exported.content[lang][field],
          entry[`${field}${suffix}` as keyof typeof entry],
        );
    }
    if (entry.relatedNote)
      assert.equal(exported.content.zh.relatedNote, entry.relatedNote);
  }
});
test("public feed excludes personal metadata, local files and executable content", () => {
  const feed = createAiFeed();
  for (const [path, body] of Object.entries(feed)) {
    assert.ok(!path.includes("..") && !path.startsWith("/"));
    assert.ok(
      !/favorites|localStorage|IndexedDB|panfolio-data|PRIVATE_BACKUP/.test(
        body,
      ),
    );
    assert.ok(!path.endsWith(".js") && !path.endsWith(".py"));
  }
});

test("skill distribution is deterministic and independent of source recipe files", async () => {
  const { mkdtemp, rm, readFile } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { execFileSync } = await import("node:child_process");
  const folder = await mkdtemp(join(tmpdir(), "panfolio-archive-"));
  try {
    const first = join(folder, "first.zip"),
      second = join(folder, "second.zip");
    for (const output of [first, second])
      execFileSync("python3", ["scripts/package-skill.py", "--output", output]);
    assert.deepEqual(await readFile(first), await readFile(second));
    const files = JSON.parse(
      execFileSync(
        "python3",
        [
          "-c",
          "import zipfile,json,sys; z=zipfile.ZipFile(sys.argv[1]);print(json.dumps(z.namelist()))",
          first,
        ],
        { encoding: "utf8" },
      ),
    ) as string[];
    assert.ok(files.includes("panfolio/SKILL.md"));
    assert.ok(files.includes("panfolio/scripts/panfolio.py"));
    assert.ok(files.includes("panfolio/references/content-contract.md"));
    assert.ok(
      files.every(
        (path) =>
          path.startsWith("panfolio/") &&
          !/\.json$|\.jpg$|\.pyc$|__pycache__|node_modules/.test(path),
      ),
    );
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("ChatGPT plugin archive has a root manifest and the unchanged shared skill", async () => {
  const { mkdtemp, rm, readFile } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { execFileSync } = await import("node:child_process");
  const folder = await mkdtemp(join(tmpdir(), "panfolio-plugin-"));
  try {
    const first = join(folder, "first.zip"),
      second = join(folder, "second.zip");
    for (const output of [first, second])
      execFileSync("python3", [
        "scripts/package-skill.py",
        "--format",
        "plugin",
        "--output",
        output,
      ]);
    assert.deepEqual(await readFile(first), await readFile(second));
    const inspected = JSON.parse(
      execFileSync(
        "python3",
        [
          "-c",
          `
import zipfile,json,sys,pathlib
z=zipfile.ZipFile(sys.argv[1])
for path in pathlib.Path('skills/panfolio').rglob('*'):
    if path.is_file() and '__pycache__' not in path.parts and path.suffix != '.pyc':
        assert z.read('skills/panfolio/'+path.relative_to('skills/panfolio').as_posix()) == path.read_bytes()
print(json.dumps({'files':z.namelist(),'manifest':json.loads(z.read('plugin.json'))}))
`,
          first,
        ],
        { encoding: "utf8" },
      ),
    );
    const manifest = inspected.manifest;
    assert.equal(
      manifest.$schema,
      "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    );
    assert.match(manifest.name, /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/);
    assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
    const ui = manifest.extensions["com.openai"].interface;
    assert.ok(ui.displayName.length <= 30 && ui.shortDescription.length <= 30);
    assert.ok(
      ui.longDescription.length <= 4000 && ui.developerName.length <= 80,
    );
    assert.ok(
      ui.defaultPrompt.length <= 3 &&
        new Set(ui.defaultPrompt).size === ui.defaultPrompt.length,
    );
    assert.ok(
      ui.defaultPrompt.every(
        (prompt: string) => prompt.length <= 128 && !prompt.includes("@"),
      ),
    );
    for (const field of ["composerIcon", "logo"])
      assert.ok(inspected.files.includes(ui[field].replace(/^\.\//, "")));
    assert.ok(inspected.files.includes("skills/panfolio/SKILL.md"));
    assert.ok(!manifest.extensions["com.openai"].requires_local_executor);
    assert.ok(
      inspected.files.every(
        (path: string) =>
          !path.includes("..") &&
          !path.startsWith("/") &&
          !/recipes|\.app\.json|mcp\.json|__pycache__|node_modules/.test(path),
      ),
    );
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
