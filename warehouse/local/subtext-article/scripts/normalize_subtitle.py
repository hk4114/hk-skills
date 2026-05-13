#!/usr/bin/env python3
"""Normalize common subtitle/transcript files into continuous spoken text."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Iterable


TIMESTAMP_LINE = re.compile(
    r"^\s*(?:\(?\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?\)?"
    r"(?:\s*-->\s*(?:\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?)?\s*$"
)
INLINE_TIMESTAMP = re.compile(r"\(?\b(?:\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?\)?")
WEBVTT_METADATA = re.compile(r"^\s*(WEBVTT|Kind:|Language:|NOTE\b|STYLE\b|REGION\b)")
TRANSCRIPT_LABEL = re.compile(r"^\s*(Transcripts?|Transcript|字幕|转写)\s*[:：]\s*", re.IGNORECASE)
JSON_CONTENT_KEYS = ("content", "text", "sentence", "subtitle")


def clean_line(line: str) -> str:
    line = line.strip()
    line = TRANSCRIPT_LABEL.sub("", line)
    line = INLINE_TIMESTAMP.sub("", line).strip()
    line = re.sub(r"\s+", " ", line)
    return line


def extract_from_json(value) -> list[str]:
    if isinstance(value, dict):
        if isinstance(value.get("body"), list):
            rows = value["body"]
            rows = sorted(rows, key=lambda item: item.get("sid", item.get("from", 0)) if isinstance(item, dict) else 0)
            return extract_from_json(rows)
        collected: list[str] = []
        for key in JSON_CONTENT_KEYS:
            text = value.get(key)
            if isinstance(text, str) and text.strip():
                collected.append(text.strip())
                break
        if collected:
            return collected
        for child in value.values():
            collected.extend(extract_from_json(child))
        return collected
    if isinstance(value, list):
        collected: list[str] = []
        for item in value:
            collected.extend(extract_from_json(item))
        return collected
    return []


def extract_from_text(text: str) -> list[str]:
    lines: list[str] = []
    for raw in text.splitlines():
        stripped = raw.strip()
        if not stripped:
            continue
        if stripped.isdigit():
            continue
        if TIMESTAMP_LINE.match(stripped):
            continue
        if WEBVTT_METADATA.match(stripped):
            continue
        cleaned = clean_line(stripped)
        if cleaned:
            lines.append(cleaned)
    return lines


def merge_lines(lines: Iterable[str]) -> str:
    paragraphs: list[str] = []
    current: list[str] = []
    strong_end = re.compile(r"[。！？!?]$")

    for line in lines:
        if not line:
            continue
        current.append(line)
        if strong_end.search(line) or len("".join(current)) >= 220:
            paragraphs.append("".join(current))
            current = []
    if current:
        paragraphs.append("".join(current))

    return "\n\n".join(paragraphs).strip() + "\n"


def normalize(path: Path) -> str:
    raw = path.read_text(encoding="utf-8-sig")
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        lines = extract_from_text(raw)
    else:
        lines = [clean_line(line) for line in extract_from_json(parsed)]
        lines = [line for line in lines if line]
        if not lines:
            lines = extract_from_text(raw)
    return merge_lines(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalize subtitle/transcript text.")
    parser.add_argument("input", type=Path, help="Input subtitle, transcript, or JSON file")
    parser.add_argument("-o", "--output", type=Path, help="Output text path; defaults to stdout")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"Input not found: {args.input}", file=sys.stderr)
        return 1

    result = normalize(args.input)
    if args.output:
        args.output.write_text(result, encoding="utf-8")
    else:
        sys.stdout.write(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
