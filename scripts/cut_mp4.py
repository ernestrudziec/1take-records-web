#!/usr/bin/env python3
"""Cut an MP4 into per-clip folders using a sibling JSON config.

Usage:
  python3 scripts/cut_mp4.py path/to/source.mp4
  python3 scripts/cut_mp4.py path/to/source.mp4 path/to/cuts.json
  python3 scripts/cut_mp4.py path/to/source.mp4 --output /tmp/cuts

Looks for a JSON next to the MP4 (same stem, then cut.json / cuts.json).

Output:
  output/
    vocal_effect_delay/
      vocal_effect_delay.mp3   # when audio is true
      vocal_effect_delay.mp4   # when video is true
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any


CUT_KEYS = ("cut", "cuts", "clips")
FILENAME_KEYS = ("filename", "fileName", "slug", "id")
NAME_KEYS = ("name", "title", "label")
START_KEYS = ("start", "timeStart", "in", "from")
END_KEYS = ("end", "timeEnd", "out", "to")
VIDEO_KEYS = ("video", "generateVideo")
AUDIO_KEYS = ("audio", "generateAudio")
SIBLING_JSON_NAMES = ("cut.json", "cuts.json", "config.json")


class CutError(Exception):
    pass


def first_key(item: dict[str, Any], keys: tuple[str, ...], default: Any = None) -> Any:
    for key in keys:
        if key in item and item[key] is not None:
            return item[key]
    return default


def as_bool(value: Any, default: bool = False) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    text = str(value).strip().lower()
    if text in {"1", "true", "yes", "y", "on"}:
        return True
    if text in {"0", "false", "no", "n", "off"}:
        return False
    return default


def slugify(value: str) -> str:
    text = value.strip().lower()
    text = text.replace("&", " and ").replace("+", " plus ")
    text = re.sub(r"['’]", "", text)
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_") or "clip"


def parse_timestamp(value: Any) -> str:
    if value is None:
        raise CutError("brak timestampu start/end")
    if isinstance(value, (int, float)):
        if value < 0:
            raise CutError(f"ujemny timestamp: {value}")
        return format_ffmpeg_time(float(value))
    text = str(value).strip()
    if not text:
        raise CutError("pusty timestamp")
    if re.fullmatch(r"\d+(\.\d+)?", text):
        return format_ffmpeg_time(float(text))
    parts = text.split(":")
    if len(parts) not in {2, 3}:
        raise CutError(f"zły timestamp: {value!r} (użyj HH:MM:SS, MM:SS albo sekund)")
    try:
        numbers = [float(part) for part in parts]
    except ValueError as error:
        raise CutError(f"zły timestamp: {value!r}") from error
    if len(numbers) == 2:
        minutes, seconds = numbers
        hours = 0.0
    else:
        hours, minutes, seconds = numbers
    total = hours * 3600 + minutes * 60 + seconds
    if total < 0:
        raise CutError(f"ujemny timestamp: {value}")
    return format_ffmpeg_time(total)


def format_ffmpeg_time(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    rest = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{rest:06.3f}"


def timestamp_to_seconds(stamp: str) -> float:
    hours, minutes, seconds = stamp.split(":")
    return int(hours) * 3600 + int(minutes) * 60 + float(seconds)


def load_cuts(config: dict[str, Any] | list[Any]) -> list[dict[str, Any]]:
    if isinstance(config, list):
        items = config
    elif isinstance(config, dict):
        items = first_key(config, CUT_KEYS)
        if items is None:
            raise CutError("JSON musi mieć tablicę cut / cuts")
    else:
        raise CutError("JSON musi być obiektem albo tablicą")
    if not isinstance(items, list) or not items:
        raise CutError("cut musi być niepustą tablicą")
    return items


def normalize_cut(raw: Any, index: int) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise CutError(f"cut[{index}] nie jest obiektem")
    name = str(first_key(raw, NAME_KEYS, "") or "").strip()
    filename = first_key(raw, FILENAME_KEYS)
    filename = slugify(str(filename)) if filename else slugify(name or f"clip_{index + 1}")
    start = parse_timestamp(first_key(raw, START_KEYS))
    end = parse_timestamp(first_key(raw, END_KEYS))
    if timestamp_to_seconds(end) <= timestamp_to_seconds(start):
        raise CutError(f"{filename}: end musi być później niż start ({start} → {end})")
    video = as_bool(first_key(raw, VIDEO_KEYS), False)
    audio = as_bool(first_key(raw, AUDIO_KEYS), False)
    if not video and not audio:
        raise CutError(f"{filename}: ustaw video i/lub audio na true")
    return {
        "filename": filename,
        "name": name or filename,
        "start": start,
        "end": end,
        "video": video,
        "audio": audio,
    }


def find_config(source: Path, explicit: Path | None) -> Path:
    if explicit:
        if not explicit.is_file():
            raise CutError(f"nie ma JSON: {explicit}")
        return explicit
    candidates = [source.with_suffix(".json")]
    candidates.extend(source.parent / name for name in SIBLING_JSON_NAMES)
    for path in candidates:
        if path.is_file():
            return path
    tried = ", ".join(str(path.name) for path in candidates)
    raise CutError(f"brak JSON obok {source.name} (szukałem: {tried})")


def require_ffmpeg() -> str:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise CutError(
            "brak ffmpeg w PATH. Zainstaluj: brew install ffmpeg"
        )
    return ffmpeg


def run_ffmpeg(ffmpeg: str, args: list[str], dry_run: bool) -> None:
    command = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", *args]
    if dry_run:
        print("  $", " ".join(command))
        return
    result = subprocess.run(command, check=False, capture_output=True, text=True)
    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "ffmpeg error").strip()
        raise CutError(detail)


def cut_video(ffmpeg: str, source: Path, dest: Path, start: str, end: str, dry_run: bool) -> None:
    run_ffmpeg(
        ffmpeg,
        [
            "-ss",
            start,
            "-to",
            end,
            "-i",
            str(source),
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            "-crf",
            "18",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-movflags",
            "+faststart",
            str(dest),
        ],
        dry_run,
    )


def cut_audio(ffmpeg: str, source: Path, dest: Path, start: str, end: str, dry_run: bool) -> None:
    run_ffmpeg(
        ffmpeg,
        [
            "-ss",
            start,
            "-to",
            end,
            "-i",
            str(source),
            "-vn",
            "-c:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(dest),
        ],
        dry_run,
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Tnie MP4 według JSON-a z timestampami (video/audio).",
    )
    parser.add_argument("source", type=Path, help="plik .mp4")
    parser.add_argument("config", nargs="?", type=Path, help="JSON obok pliku (opcjonalnie)")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="folder docelowy (domyślnie: output/ obok MP4)",
    )
    parser.add_argument("--dry-run", action="store_true", help="tylko wypisz, nic nie tnij")
    parser.add_argument("--force", action="store_true", help="nadpisz istniejące pliki")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    source = args.source.expanduser().resolve()
    if not source.is_file():
        print(f"brak pliku: {source}", file=sys.stderr)
        return 1

    try:
        config_path = find_config(source, args.config.expanduser().resolve() if args.config else None)
        payload = json.loads(config_path.read_text(encoding="utf-8"))
        cuts = [normalize_cut(item, index) for index, item in enumerate(load_cuts(payload))]
        ffmpeg = "ffmpeg" if args.dry_run else require_ffmpeg()
    except (OSError, json.JSONDecodeError, CutError) as error:
        print(error, file=sys.stderr)
        return 1

    output_root = (args.output or source.parent / "output").expanduser().resolve()
    print(f"source: {source}")
    print(f"config: {config_path}")
    print(f"output: {output_root}")
    print(f"cuts:   {len(cuts)}")

    made = 0
    skipped = 0
    for item in cuts:
        folder = output_root / item["filename"]
        video_path = folder / f"{item['filename']}.mp4"
        audio_path = folder / f"{item['filename']}.mp3"
        print(
            f"\n[{item['filename']}] {item['name']}  {item['start']} → {item['end']}"
            f"  video={item['video']} audio={item['audio']}"
        )
        if not args.dry_run:
            folder.mkdir(parents=True, exist_ok=True)
        try:
            if item["video"]:
                if video_path.exists() and not args.force:
                    print(f"  skip {video_path.name} (już jest, --force żeby nadpisać)")
                    skipped += 1
                else:
                    cut_video(ffmpeg, source, video_path, item["start"], item["end"], args.dry_run)
                    print(f"  + {video_path.relative_to(output_root)}")
                    made += 1
            if item["audio"]:
                if audio_path.exists() and not args.force:
                    print(f"  skip {audio_path.name} (już jest, --force żeby nadpisać)")
                    skipped += 1
                else:
                    cut_audio(ffmpeg, source, audio_path, item["start"], item["end"], args.dry_run)
                    print(f"  + {audio_path.relative_to(output_root)}")
                    made += 1
        except CutError as error:
            print(f"  błąd: {error}", file=sys.stderr)
            return 1

    print(f"\ngotowe: {made} plików, skip {skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
