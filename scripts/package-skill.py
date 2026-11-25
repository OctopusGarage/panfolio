#!/usr/bin/env python3
"""Create deterministic, content-free skill and ChatGPT plugin archives."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import argparse

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skills" / "panfolio"
TARGET = ROOT / "public" / "downloads" / "panfolio-skill.zip"

PLUGIN_TARGET = ROOT / "public" / "downloads" / "panfolio-chatgpt-plugin.zip"

def package(target=TARGET, plugin=False):
    target = Path(target)
    target.parent.mkdir(parents=True, exist_ok=True)
    files = []
    if plugin:
        files.extend([
            ("plugin.json", ROOT / "plugins" / "panfolio" / "plugin.json"),
            ("LICENSE", SOURCE / "LICENSE"),
            ("assets/icon.png", ROOT / "public" / "icon-192.png"),
        ])
    for path in sorted(SOURCE.rglob("*")):
        if "__pycache__" in path.parts or path.suffix == ".pyc":
            continue
        if path.is_symlink():
            raise ValueError("Skill package must not contain symlinks")
        if path.is_file():
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
            archive.writestr(entry, path.read_bytes())
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
