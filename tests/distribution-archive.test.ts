import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { config, distributionIdentity } from "../scripts/distribution";
test("all three archives share release identity and icon, and preserve live guide links in CI", async () => {
  const folder = await mkdtemp(join(tmpdir(), "panfolio-live-guide-"));
  const revision = "a".repeat(40),
    identity = await distributionIdentity();
  try {
    for (const format of ["skill", "plugin", "claude"]) {
      const output = join(folder, format + ".zip");
      execFileSync(
        "python3",
        ["scripts/package-skill.py", "--format", format, "--output", output],
        { env: { ...process.env, GITHUB_SHA: revision } },
      );
      const inspected = JSON.parse(
        execFileSync(
          "python3",
          [
            "-c",
            `import json,sys,zipfile,hashlib
z=zipfile.ZipFile(sys.argv[1]);manifest=next((n for n in ['plugin.json','.claude-plugin/plugin.json'] if n in z.namelist()),None);p='skills/panfolio/' if manifest else 'panfolio/'
print(json.dumps({'skill':z.read(p+'SKILL.md').decode(),'release':z.read(p+'references/release.md').decode(),'icon':hashlib.sha256(z.read(p+'assets/icon.png')).hexdigest(),'pluginIcon':hashlib.sha256(z.read('assets/icon.png')).hexdigest() if manifest else None,'version':json.loads(z.read(manifest))['version'] if manifest else None}))`,
            output,
          ],
          { encoding: "utf8" },
        ),
      );
      assert.equal(
        inspected.skill,
        await readFile("skills/panfolio/SKILL.md", "utf8"),
      );
      assert.ok(inspected.skill.includes(config.contentBase + "en/guide.md"));
      assert.ok(inspected.skill.includes(config.contentBase + "zh/guide.md"));
      for (const value of [
        config.version,
        identity.contentVersion,
        identity.guidanceVersion,
        revision,
      ])
        assert.ok(inspected.release.includes(value));
      assert.equal(inspected.icon, identity.iconSha256);
      if (format !== "skill") {
        assert.equal(inspected.pluginIcon, identity.iconSha256);
        assert.equal(inspected.version, config.version);
      }
    }
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("native Claude archive contains one Claude manifest and the same Skill without OpenAI metadata", async () => {
  const folder = await mkdtemp(join(tmpdir(), "panfolio-claude-"));
  try {
    const output = join(folder, "plugin.zip");
    execFileSync("python3", [
      "scripts/package-skill.py",
      "--format",
      "claude",
      "--output",
      output,
    ]);
    const result = JSON.parse(
      execFileSync(
        "python3",
        [
          "-c",
          `import json,zipfile,sys
z=zipfile.ZipFile(sys.argv[1]);print(json.dumps({'files':z.namelist(),'manifest':json.loads(z.read('.claude-plugin/plugin.json')),'skill':z.read('skills/panfolio/SKILL.md').decode()}))`,
          output,
        ],
        { encoding: "utf8" },
      ),
    );
    assert.equal(result.manifest.name, config.name);
    assert.equal(result.manifest.version, config.version);
    assert.ok(result.files.includes("skills/panfolio/assets/icon.png"));
    assert.ok(!result.files.includes("plugin.json"));
    assert.ok(!JSON.stringify(result.manifest).includes("com.openai"));
    assert.match(result.skill, /read_document/);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
