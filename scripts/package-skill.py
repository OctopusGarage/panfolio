#!/usr/bin/env python3
"""Create deterministic, content-free skill and ChatGPT plugin archives."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import argparse
import json
import os
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skills" / "panfolio"
TARGET = ROOT / "public" / "downloads" / "panfolio-skill.zip"

PLUGIN_TARGET = ROOT / "public" / "downloads" / "panfolio-chatgpt-plugin.zip"

def package(target=TARGET, plugin=False):
    target = Path(target)
    target.parent.mkdir(parents=True, exist_ok=True)
    config = json.loads((ROOT / "distribution" / "config.json").read_text())
    identity = json.loads((ROOT / "distribution" / "identity.json").read_text())
    revision = os.environ.get("GITHUB_SHA", "local")
    if revision != "local" and not re.fullmatch(r"[a-f0-9]{40}", revision):
        raise ValueError("Invalid source revision")
    files = []
    if plugin:
        files.extend([
            ("plugin.json", ROOT / "plugins" / "panfolio" / "plugin.json"),
            ("LICENSE", SOURCE / "LICENSE"),
            ("assets/icon.png", ROOT / config["icon"]),
        ])
    for path in sorted(SOURCE.rglob("*")):
        if "__pycache__" in path.parts or path.suffix == ".pyc":
            continue
        if path.is_symlink():
            raise ValueError("Skill package must not contain symlinks")
        if path.is_file():
            relative = path.relative_to(SOURCE).as_posix()
            if relative not in {"SKILL.md", "LICENSE", "agents/openai.yaml", "assets/icon.png"}:
                raise ValueError(f"Unexpected consumer package file: {relative}")
            prefix = "skills/panfolio/" if plugin else "panfolio/"
            files.append((prefix + path.relative_to(SOURCE).as_posix(), path))
    with ZipFile(target, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for name, path in sorted(files):
            if path.is_symlink():
                raise ValueError("Skill package must not contain symlinks")
            if not path.is_file():
                raise ValueError(f"Missing package asset: {path}")
            entry = ZipInfo(name, (1980, 1, 1, 0, 0, 0))
            entry.compress_type = ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            data = path.read_bytes()
            if path.name == "SKILL.md" and revision != "local":
                data = data.replace(b"/panfolio/main/content/", f"/panfolio/{revision}/content/".encode())
                data = data.replace(b"/panfolio/main/", f"/panfolio/{revision}/".encode())
                data = data.replace(b"/panfolio/blob/main/", f"/panfolio/blob/{revision}/".encode())
            archive.writestr(entry, data)
        release_path = ("skills/panfolio/" if plugin else "panfolio/") + "references/release.md"
        entry = ZipInfo(release_path, (1980, 1, 1, 0, 0, 0))
        entry.compress_type = ZIP_DEFLATED
        entry.external_attr = 0o100644 << 16
        release = f"# Panfolio release\n\nVersion: {config['version']}\n\nContent version: {identity['contentVersion']}\n\nGuidance version: {identity['guidanceVersion']}\n\nSource revision: {revision}\n\nCI release archives pin cookbook links to this source revision. Repository installations follow the current main branch. Keep retrieved text during an active cooking conversation.\n"
        archive.writestr(entry, release.encode())
    print(f"Packaged {target.name} ({target.stat().st_size} bytes); recipes remain on the public feed.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--format", choices=["skill", "plugin", "all"])
    args = parser.parse_args()
    kind = args.format or ("skill" if args.output else "all")
    if kind == "all" and args.output:
        parser.error("--output requires --format skill or plugin")
    if kind in ("skill", "all"):
        package(args.output or TARGET)
    if kind in ("plugin", "all"):
        package(args.output or PLUGIN_TARGET, plugin=True)
