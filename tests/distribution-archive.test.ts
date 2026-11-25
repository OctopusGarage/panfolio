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
