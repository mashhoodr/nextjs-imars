#!/usr/bin/env python3
"""Add or replace event photos on talks.

    1.  Drop photos into  talks-inbox/
        Name each file after the talk's date:   2025-05-24.jpg
        Or after its id if two talks share a date:   39.jpg

    2.  npm run talks:images

    3.  Check the page, then commit. talks-inbox/ is gitignored.

Anything the browser can be handed is accepted — jpg, png, webp, and HEIC
straight off an iPhone, which is converted first with macOS `sips`.

Every photo goes through the same crop and re-encode as the ones imported from
the Google Developer Expert export, so a picture added by hand cannot end up a
different size, shape or weight from the rest.

    --list            show which talks still have no photo, and change nothing
    --find <words>    search every talk and print the filename to use for each

Search matches the title, date or venue, and covers talks that already have a
photo — which --list deliberately does not, since it is a to-do list. Use it when
you want to replace one:

    npm run talks:find -- gemini cli
"""
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
INBOX = ROOT / "talks-inbox"
PUBLIC = ROOT / "public" / "talks"
TALKS = ROOT / "lib" / "talks.json"

SIZE = 256
QUALITY = 82
# Horizontally centred, biased up the frame: in a room shot the faces sit above
# the middle, so a straight centre crop takes chairs and floor.
CENTERING = (0.5, 0.35)
ACCEPTED = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"}

BOLD, DIM, RED, GREEN, YELLOW, OFF = "\033[1m", "\033[2m", "\033[31m", "\033[32m", "\033[33m", "\033[0m"


def die(msg):
    print(f"{RED}{msg}{OFF}")
    sys.exit(1)


try:
    from PIL import Image, ImageOps
except ImportError:
    die("Pillow is not installed.  Fix with:  python3 -m pip install --user Pillow")


def slug(date, title):
    s = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return f"{date}-{s[:52].rstrip('-')}"


def load():
    return json.loads(TALKS.read_text())


def save(talks):
    TALKS.write_text(json.dumps(talks, indent=2, ensure_ascii=False) + "\n")


def report_missing(talks):
    missing = [t for t in talks if not t.get("image")]
    if not missing:
        print(f"\n{GREEN}Every talk has a photo.{OFF}")
        return
    print(f"\n{BOLD}Still without a photo ({len(missing)} of {len(talks)}){OFF}")
    print(f"{DIM}name the file after the date, or the id where two share one{OFF}\n")
    for t in sorted(missing, key=lambda t: t["created"], reverse=True):
        same_date = [x for x in talks if x["created"] == t["created"]]
        hint = f"{t['created']}" if len(same_date) == 1 else f"{t['id']}  {DIM}(shares {t['created']}){OFF}"
        print(f"  {hint:<34} {t['title'][:58]}")


def search(terms, talks):
    """Print id, date, photo status and the filename to use, for talks matching
    every search term. Includes talks that already have a photo, so an existing
    one can be found and replaced."""
    q = [t.lower() for t in terms]
    hits = [t for t in talks
            if all(w in f"{t['title']} {t['created']} {t.get('location','')}".lower() for w in q)]
    if not hits:
        print(f"{YELLOW}Nothing matches {' '.join(terms)!r}{OFF}")
        return
    print(f"\n{BOLD}{len(hits)} match{'es' if len(hits) > 1 else ''}{OFF}")
    print(f"{DIM}{'name the file':<16}{'photo':<8}{'when':<14}title{OFF}\n")
    for t in sorted(hits, key=lambda t: t['created'], reverse=True):
        same_date = [x for x in talks if x['created'] == t['created']]
        # The date is the friendlier filename, so prefer it and fall back to the
        # id only where the date would be ambiguous.
        name = t['created'] if len(same_date) == 1 else t['id']
        photo = f"{GREEN}yes{OFF}" if t.get('image') else f"{DIM}--{OFF} "
        print(f"  {name:<14}{photo:<17}{t['created']:<14}{t['title'][:52]}")
    print(f"\n{DIM}drop the photo in talks-inbox/ under that name, then: npm run talks:images{OFF}")


def find_target(stem, talks):
    """A filename stem is either a date or a talk id. Returns (talk, error)."""
    stem = stem.strip()
    by_id = [t for t in talks if t["id"] == stem]
    if by_id:
        return by_id[0], None
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", stem):
        hits = [t for t in talks if t["created"] == stem]
        if len(hits) == 1:
            return hits[0], None
        if not hits:
            return None, f"no talk on {stem}"
        listing = "\n".join(
            f"        id {t['id']}  {t['title'][:56]}" for t in hits)
        return None, (f"{len(hits)} talks on {stem} — rename the file to one of these ids:\n{listing}")
    return None, (f"cannot tell which talk this is. Name it after the date "
                  f"(2025-05-24.jpg) or the id (39.jpg)")


def to_jpeg_if_heic(src):
    """PIL cannot open HEIC without a plugin; macOS ships sips, which can."""
    if src.suffix.lower() not in {".heic", ".heif"}:
        return src, None
    if not shutil.which("sips"):
        return None, "HEIC needs macOS `sips`, which is not on this machine"
    tmp = pathlib.Path(tempfile.mkdtemp()) / (src.stem + ".jpg")
    r = subprocess.run(["sips", "-s", "format", "jpeg", str(src), "--out", str(tmp)],
                       capture_output=True, text=True)
    if r.returncode != 0 or not tmp.exists():
        return None, f"sips could not convert {src.name}"
    return tmp, None


def process(src, talk):
    im = Image.open(src)
    before = f"{im.width}x{im.height}"
    # Before cropping, not after: a phone stores rotation as metadata rather
    # than rotating the pixels, so cropping first crops along the wrong axis.
    im = ImageOps.exif_transpose(im)
    if im.mode != "RGB":
        im = im.convert("RGB")
    im = ImageOps.fit(im, (SIZE, SIZE), method=Image.LANCZOS, centering=CENTERING)
    dest = PUBLIC / f"{slug(talk['created'], talk['title'])}.jpg"
    PUBLIC.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return dest, before, dest.stat().st_size


def main():
    talks = load()

    if "--list" in sys.argv:
        report_missing(talks)
        return

    if "--find" in sys.argv:
        terms = sys.argv[sys.argv.index("--find") + 1:]
        if not terms:
            die("give me something to search for, e.g.  npm run talks:find -- gemini")
        search(terms, talks)
        return

    INBOX.mkdir(exist_ok=True)
    files = sorted(p for p in INBOX.iterdir()
                   if p.is_file() and p.suffix.lower() in ACCEPTED)

    if not files:
        print(f"{YELLOW}Nothing in talks-inbox/{OFF}")
        print(f"\nDrop photos in {DIM}{INBOX.relative_to(ROOT)}/{OFF} named after the talk date, "
              f"then run this again:\n\n    {BOLD}2025-05-24.jpg{OFF}\n")
        report_missing(talks)
        return

    by_key = {t["id"]: t for t in talks}
    changed = failed = 0

    for src in files:
        talk, err = find_target(src.stem, talks)
        if err:
            print(f"  {RED}skip{OFF}  {src.name}  {DIM}{err}{OFF}")
            failed += 1
            continue

        real, err = to_jpeg_if_heic(src)
        if err:
            print(f"  {RED}skip{OFF}  {src.name}  {DIM}{err}{OFF}")
            failed += 1
            continue

        try:
            dest, before, size = process(real, talk)
        except Exception as e:
            print(f"  {RED}skip{OFF}  {src.name}  {DIM}{e}{OFF}")
            failed += 1
            continue

        replaced = by_key[talk["id"]].get("image") == f"/talks/{dest.name}"
        by_key[talk["id"]]["image"] = f"/talks/{dest.name}"
        verb = "replaced" if replaced else "added   "
        print(f"  {GREEN}{verb}{OFF}  {src.name:<26} {DIM}{before:>10} -> {SIZE}x{SIZE}, "
              f"{size/1024:.0f}KB{OFF}  {talk['title'][:40]}")
        changed += 1

    if changed:
        save(talks)
        print(f"\n{GREEN}{changed} updated{OFF} in lib/talks.json and public/talks/")
        print(f"{DIM}check it with:  npm run dev  →  http://localhost:3011/talks{OFF}")
        print(f"{DIM}then empty talks-inbox/ and commit{OFF}")
    if failed:
        print(f"{RED}{failed} skipped{OFF}")

    report_missing(load())


if __name__ == "__main__":
    main()
