#!/usr/bin/env python3
"""Audit tokens.json against tokensKeys.js in the handsontable-figma project.

Outputs a JSON report with:
  - themes: list of theme names found
  - total_leaves_per_theme: leaf-key counts (excluding boolean-typed switches)
  - new: leaf keys present in tokens.json but missing from tokensKeys.js
  - stale: keys present in tokensKeys.js but not a leaf in any theme
  - collisions: leaves that share the same terminal key name within a single
                theme (findValueRecursively returns the first match; if their
                values differ this is a silent override)
  - suggested_groups: the `new` list grouped by the hyphen-case prefix
                      convention used in tokensKeys.js (base -> hover ->
                      disabled -> focus -> active -> close -> open).

Usage:
    python3 audit_tokens.py [<repo-root>]

Defaults to the current working directory. Exits non-zero on structural errors
so the caller can stop before proposing edits.
"""
from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

# Top-level keys tokens.json must provide for the pipeline in utils/constants.js.
REQUIRED_TOP_LEVEL = ("themes", "sizing", "density", "colors")

# Keys that live in tokensKeys.js but are *not* Figma leaves — see
# OTHER_VARIABLES in utils/constants.js. Don't report these as stale.
NOT_A_FIGMA_LEAF = {"density"}

# Ordering suffix -> sub-section label, following the pattern already in
# tokensKeys.js (Primary Button, Secondary Button, Icon Button, Checkbox, ...).
STATE_ORDER = [
    ("", "base"),
    ("hover", "hover"),
    ("active", "active"),
    ("focus", "focus"),
    ("disabled", "disabled"),
    ("checked", "checked"),
    ("indeterminate", "indeterminate"),
    ("open", "open"),
    ("close", "close"),
]


def iter_leaves(obj, path=()):
    """Yield (terminal_key, dotted_path, type, value) for every design-token leaf.

    A design-token leaf is a dict that has both `value` and `type` fields —
    that matches what the Figma Design Tokens plugin emits for real tokens and
    naturally excludes grouping containers.
    """
    if not isinstance(obj, dict):
        return
    for k, v in obj.items():
        if not isinstance(v, dict):
            continue
        if "value" in v and "type" in v:
            yield (k, ".".join(path + (k,)), v["type"], v["value"])
        else:
            yield from iter_leaves(v, path + (k,))


def extract_current_keys(source: str) -> set[str]:
    """Pull double-quoted hyphen-case string literals out of tokensKeys.js.

    tokensKeys.js is a plain JS array of string literals, so a regex is
    sufficient and avoids needing a JS parser. Hyphen-case only: this won't
    match path-style strings or comments.
    """
    return set(re.findall(r'"([a-z][a-z0-9]*(?:-[a-z0-9]+)*)"', source))


def component_prefix(key: str) -> str:
    """Strip a trailing state segment (hover/focus/...) so related keys group."""
    parts = key.split("-")
    for suffix, _ in STATE_ORDER[1:]:
        if suffix in parts:
            return "-".join(parts[: parts.index(suffix)])
    # Fall back to everything up to the last one or two segments, so
    # "pagination-button-border-color" groups under "pagination-button".
    # Heuristic: drop trailing color/size/width/radius/padding-style tail.
    tail_tokens = {"color", "size", "width", "radius", "padding",
                   "opacity", "weight", "family", "height", "spacing",
                   "transition", "blur", "x", "y"}
    trimmed = list(parts)
    while trimmed and trimmed[-1] in tail_tokens:
        trimmed.pop()
    # "border-color" / "background-color" etc — drop one more if needed.
    while trimmed and trimmed[-1] in {"border", "background", "foreground",
                                      "icon", "accent", "shadow"}:
        trimmed.pop()
    return "-".join(trimmed) or "-".join(parts[:-1]) or key


def state_for(key: str, prefix: str) -> str:
    """Return the state label (base/hover/focus/...) for a key under `prefix`."""
    remainder = key[len(prefix):].lstrip("-").split("-")
    for suffix, label in STATE_ORDER:
        if suffix and suffix in remainder:
            return label
    return "base"


def group_new_keys(new_keys: list[str]) -> list[dict]:
    """Group new keys by component prefix and state, preserving input order."""
    groups: dict[str, dict[str, list[str]]] = defaultdict(lambda: defaultdict(list))
    order: list[str] = []
    for key in new_keys:
        prefix = component_prefix(key)
        if prefix not in order:
            order.append(prefix)
        groups[prefix][state_for(key, prefix)].append(key)

    state_rank = {label: i for i, (_, label) in enumerate(STATE_ORDER)}
    result = []
    for prefix in order:
        sections = []
        for label in sorted(groups[prefix], key=lambda s: state_rank.get(s, 99)):
            sections.append({"state": label, "keys": groups[prefix][label]})
        result.append({"component": prefix, "sections": sections})
    return result


def find_collisions(per_theme_leaves: dict) -> list[dict]:
    """Leaves that share a terminal key name within one theme.

    findValueRecursively in utils/helpers/tokenReference.js returns the first
    match, so two sibling leaves with the same terminal name cause a silent
    override. Flag them with whether their values match (benign but worth
    documenting) or differ (will lose data).
    """
    collisions = []
    for theme, leaves in per_theme_leaves.items():
        by_key: dict[str, list[tuple[str, object]]] = defaultdict(list)
        for key, path, _type, value in leaves:
            by_key[key].append((path, value))
        for key, instances in by_key.items():
            if len(instances) < 2:
                continue
            distinct = {json.dumps(v, sort_keys=True) for _, v in instances}
            collisions.append({
                "theme": theme,
                "key": key,
                "paths": [p for p, _ in instances],
                "values_match": len(distinct) == 1,
            })
    return collisions


def main(root: str) -> int:
    repo = Path(root)
    tokens_path = repo / "tokens.json"
    keys_path = repo / "tokensKeys.js"

    errors = []
    if not tokens_path.exists():
        errors.append(
            f"tokens.json not found at {tokens_path}. Export it from the Figma "
            "Design Tokens plugin per README.md and place it in the repo root."
        )
    if not keys_path.exists():
        errors.append(f"tokensKeys.js not found at {keys_path}.")
    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        return 1

    try:
        data = json.loads(tokens_path.read_text())
    except json.JSONDecodeError as e:
        print(f"ERROR: tokens.json is not valid JSON: {e}", file=sys.stderr)
        return 1

    missing_top = [k for k in REQUIRED_TOP_LEVEL if k not in data]
    if missing_top:
        print(
            f"ERROR: tokens.json missing required top-level key(s): "
            f"{', '.join(missing_top)}. Expected: {', '.join(REQUIRED_TOP_LEVEL)}.",
            file=sys.stderr,
        )
        return 1

    per_theme_leaves: dict[str, list] = {}
    all_keys: set[str] = set()
    for theme_name, theme_obj in data["themes"].items():
        leaves = [
            (k, p, t, v)
            for (k, p, t, v) in iter_leaves(theme_obj)
            # Boolean leaves are Figma mode switches (e.g., common.icons.main),
            # not design tokens. Don't treat them as candidates for tokensKeys.js.
            if t != "boolean"
        ]
        per_theme_leaves[theme_name] = leaves
        all_keys.update(k for (k, _, _, _) in leaves)

    current = extract_current_keys(keys_path.read_text())
    new_keys = sorted(all_keys - current)
    stale = sorted((current - all_keys) - NOT_A_FIGMA_LEAF)
    collisions = find_collisions(per_theme_leaves)

    report = {
        "themes": list(data["themes"].keys()),
        "total_leaves_per_theme": {t: len(ls) for t, ls in per_theme_leaves.items()},
        "current_keys_count": len(current),
        "new": new_keys,
        "stale": stale,
        "collisions": collisions,
        "suggested_groups": group_new_keys(new_keys),
    }
    print(json.dumps(report, indent=2))
    # Non-zero exit only for hard structural errors (handled above). A report
    # with `new` or `collisions` still returns 0 so the caller can proceed.
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "."))
