import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { config, distributionIdentity } from "../scripts/distribution";
test("both archives share release identity and icon, and pin native links to the CI revision", async () => {
  const folder = await mkdtemp(join(tmpdir(), "panfolio-pinned-"));
  const revision = "a".repeat(40),
    identity = await distributionIdentity();
  try {
    for (const format of ["skill", "plugin"]) {
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
z=zipfile.ZipFile(sys.argv[1]);p='skills/panfolio/' if 'plugin.json' in z.namelist() else 'panfolio/'
print(json.dumps({'skill':z.read(p+'SKILL.md').decode(),'release':z.read(p+'references/release.md').decode(),'icon':hashlib.sha256(z.read(p+'assets/icon.png')).hexdigest(),'pluginIcon':hashlib.sha256(z.read('assets/icon.png')).hexdigest() if 'plugin.json' in z.namelist() else None,'version':json.loads(z.read('plugin.json'))['version'] if 'plugin.json' in z.namelist() else None}))`,
            output,
          ],
          { encoding: "utf8" },
        ),
      );
      assert.ok(!inspected.skill.includes("/main/content/"));
      assert.ok(inspected.skill.includes(`/panfolio/${revision}/content/`));
      assert.ok(inspected.skill.includes(`/panfolio/blob/${revision}/`));
      for (const value of [
        config.version,
        identity.contentVersion,
        identity.guidanceVersion,
        revision,
      ])
        assert.ok(inspected.release.includes(value));
      assert.equal(inspected.icon, identity.iconSha256);
      if (format === "plugin") {
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
