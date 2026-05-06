#!/usr/bin/env node

import { readdir, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { initialState } from "../src/engine/state.js";

const CHAPTERS_DIR = resolve("src/data/chapters");
const REPORTS_DIR = resolve("reports");
const RANDOM_RUNS = 20;

// ── Entry ──────────────────────────────────────────────────

async function main() {
  const files = (await readdir(CHAPTERS_DIR))
    .filter((f) => /^chapter\d+\.js$/.test(f))
    .sort();

  if (files.length === 0) {
    console.error("No chapter files found in src/data/chapters/");
    process.exit(1);
  }

  console.log(`Found ${files.length} chapter file(s): ${files.join(", ")}\n`);

  const reports = [];

  for (const file of files) {
    const url = pathToFileURL(resolve(CHAPTERS_DIR, file)).href;
    const mod = await import(url);
    const chapter = extractChapter(mod, file);
    if (!chapter) {
      console.error(`  ✗ ${file}: no valid chapter export found`);
      continue;
    }
    console.log(`Validating: ${chapter.title ?? file}`);
    const report = validateChapter(chapter, file);
    reports.push(report);
    printSummary(report);
  }

  const md = renderMarkdown(reports);
  await mkdir(REPORTS_DIR, { recursive: true });
  const outPath = resolve(REPORTS_DIR, "validation-report.md");
  await writeFile(outPath, md, "utf-8");
  console.log(`\nReport written to ${outPath}`);

  const hasErrors = reports.some((r) => r.errors.length > 0);
  process.exit(hasErrors ? 1 : 0);
}

// ── Chapter extraction ─────────────────────────────────────

function extractChapter(mod, filename) {
  for (const val of Object.values(mod)) {
    if (val && typeof val === "object" && val.scenes && val.startScene) {
      return val;
    }
  }
  return null;
}

// ── Full validation pipeline ───────────────────────────────

function validateChapter(chapter, filename) {
  const { scenes, startScene, title, titleCn, sceneCount } = chapter;
  const sceneKeys = Object.keys(scenes);
  const errors = [];
  const warnings = [];

  // ── 1. Static checks ──

  const missingIds = [];
  const mismatchedIds = [];
  const missingText = [];
  const badChoices = [];
  const brokenNext = [];
  const idSet = new Set();
  const duplicateIds = [];

  for (const [key, scene] of Object.entries(scenes)) {
    if (!scene.id) {
      missingIds.push(key);
    } else {
      if (scene.id !== key) mismatchedIds.push({ key, id: scene.id });
      if (idSet.has(scene.id)) duplicateIds.push(scene.id);
      idSet.add(scene.id);
    }

    if (!scene.text && typeof scene.text !== "function") {
      missingText.push(key);
    }

    if (scene.choices !== null && scene.choices !== undefined && !Array.isArray(scene.choices)) {
      badChoices.push(key);
    }

    if (scene.next && !scenes[scene.next]) {
      brokenNext.push({ from: key, target: scene.next, type: "scene" });
    }

    if (Array.isArray(scene.choices)) {
      for (const c of scene.choices) {
        if (c.next && !scenes[c.next]) {
          brokenNext.push({ from: key, target: c.next, type: "choice" });
        }
      }
    }
  }

  if (!scenes[startScene]) {
    errors.push(`startScene "${startScene}" does not exist`);
  }

  if (sceneCount !== undefined && sceneCount !== sceneKeys.length) {
    errors.push(`sceneCount mismatch: declared ${sceneCount}, actual ${sceneKeys.length}`);
  }

  missingIds.forEach((k) => errors.push(`Scene "${k}" is missing id`));
  duplicateIds.forEach((id) => errors.push(`Duplicate id: "${id}"`));
  mismatchedIds.forEach(({ key, id }) => errors.push(`Scene "${key}" has mismatched id "${id}"`));
  missingText.forEach((k) => errors.push(`Scene "${k}" is missing text`));
  badChoices.forEach((k) => errors.push(`Scene "${k}": choices is not an array or null`));
  brokenNext.forEach(({ from, target, type }) =>
    errors.push(`Scene "${from}" (${type}): next "${target}" does not exist`)
  );

  // ── 2. Reachability ──

  const reachable = new Set();
  const queue = [startScene];
  while (queue.length > 0) {
    const id = queue.shift();
    if (reachable.has(id) || !scenes[id]) continue;
    reachable.add(id);
    const scene = scenes[id];
    if (scene.next) queue.push(scene.next);
    if (Array.isArray(scene.choices)) {
      for (const c of scene.choices) {
        if (c.next) queue.push(c.next);
      }
    }
  }

  const unreachable = sceneKeys.filter((id) => !reachable.has(id));
  unreachable.forEach((id) => warnings.push(`Unreachable scene: "${id}"`));

  // ── 3. Endings & deadlocks ──

  const endings = [];
  const deadlocks = [];

  for (const id of reachable) {
    const scene = scenes[id];
    const hasNext = !!scene.next;
    const hasChoices = Array.isArray(scene.choices) && scene.choices.length > 0;
    const isTerminal = !hasNext && !hasChoices;
    const isEnding = scene.links?.showEnd === true;

    if (isEnding) endings.push(id);
    else if (isTerminal) deadlocks.push(id);
  }

  deadlocks.forEach((id) => errors.push(`Deadlock: scene "${id}" has no next, no choices, and is not an ending`));

  // ── 4. Choice points & flags ──

  let choicePoints = 0;
  const flagDefs = {};

  for (const [key, scene] of Object.entries(scenes)) {
    if (Array.isArray(scene.choices) && scene.choices.length > 0) {
      choicePoints++;
      for (const c of scene.choices) {
        if (c.flag) {
          if (!flagDefs[c.flag]) flagDefs[c.flag] = [];
          flagDefs[c.flag].push(key);
        }
      }
    }
  }

  // ── 5. Playthrough simulations ──

  const playthroughs = [];

  playthroughs.push({
    name: "always_first_choice",
    ...simulate(chapter, "first"),
  });

  playthroughs.push({
    name: "always_second_choice",
    ...simulate(chapter, "second"),
  });

  const rng = seedRng(42);
  for (let i = 0; i < RANDOM_RUNS; i++) {
    playthroughs.push({
      name: `random_run_${String(i + 1).padStart(2, "0")}`,
      ...simulate(chapter, "random", rng),
    });
  }

  const reachableEndings = new Set(
    playthroughs.filter((p) => p.reachedEnding).map((p) => p.endScene)
  );

  return {
    filename,
    title: title ?? "?",
    titleCn: titleCn ?? "",
    sceneCount: sceneKeys.length,
    choicePoints,
    endings,
    reachableEndingCount: reachableEndings.size,
    missingIds,
    unreachable,
    deadlocks,
    flagDefs,
    errors,
    warnings,
    playthroughs,
  };
}

// ── Playthrough simulation ─────────────────────────────────

function simulate(chapter, strategy, rng) {
  const { scenes, startScene } = chapter;
  const state = {
    nerve: initialState.nerve,
    insight: initialState.insight,
    writing: initialState.writing,
    notebook: [],
    choicesMade: {},
  };

  let current = startScene;
  const visited = [];
  const choices = [];
  const MAX = 200;

  for (let step = 0; step < MAX; step++) {
    const scene = scenes[current];
    if (!scene) {
      return { success: false, error: `missing scene "${current}"`, visited, state, choices };
    }

    visited.push(current);
    applyEffects(state, scene.effects);
    if (typeof scene.effectFn === "function") {
      applyEffects(state, scene.effectFn(state));
    }
    if (scene.notebook) state.notebook.push(scene.notebook);

    const isEnding = scene.links?.showEnd === true;
    const hasChoices = Array.isArray(scene.choices) && scene.choices.length > 0;

    if (hasChoices) {
      const idx = pickChoice(scene.choices, strategy, rng);
      const choice = scene.choices[idx];
      choices.push({ scene: current, picked: idx, text: choice.text });

      if (choice.flag) state.choicesMade[choice.flag] = true;
      applyEffects(state, choice.effects);
      if (choice.notebook) state.notebook.push(choice.notebook);
      current = choice.next;
    } else if (scene.next) {
      current = scene.next;
    } else {
      return {
        success: isEnding,
        reachedEnding: isEnding,
        endScene: current,
        visited,
        state: { ...state, notebook: state.notebook.length },
        steps: step + 1,
        choices,
      };
    }
  }

  return { success: false, error: "max steps exceeded", visited, state, choices };
}

function pickChoice(choices, strategy, rng) {
  if (strategy === "first") return 0;
  if (strategy === "second") return Math.min(1, choices.length - 1);
  return Math.floor(rng() * choices.length);
}

function applyEffects(state, effects) {
  if (!effects) return;
  if (effects.nerve) state.nerve += effects.nerve.amount;
  if (effects.insight) state.insight += effects.insight.amount;
  if (effects.writing) state.writing += effects.writing.amount;
}

function seedRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// ── Console output ─────────────────────────────────────────

function printSummary(report) {
  const ok = report.errors.length === 0;
  const icon = ok ? "✓" : "✗";
  console.log(`  ${icon} ${report.title}（${report.titleCn}）— ${report.filename}`);
  console.log(`    場景: ${report.sceneCount}  選擇點: ${report.choicePoints}  ending: ${report.endings.length}`);

  if (report.errors.length > 0) {
    console.log(`    Errors (${report.errors.length}):`);
    report.errors.forEach((e) => console.log(`      - ${e}`));
  }
  if (report.warnings.length > 0) {
    console.log(`    Warnings (${report.warnings.length}):`);
    report.warnings.forEach((w) => console.log(`      - ${w}`));
  }

  const passed = report.playthroughs.filter((p) => p.success).length;
  const total = report.playthroughs.length;
  console.log(`    Playthroughs: ${passed}/${total} reached ending`);
  console.log();
}

// ── Markdown report ────────────────────────────────────────

function renderMarkdown(reports) {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  let md = `# Chapter Validation Report\n\n`;
  md += `> Generated: ${now}\n\n`;

  for (const r of reports) {
    md += `---\n\n`;
    md += `## ${r.title}（${r.titleCn}）\n\n`;
    md += `File: \`${r.filename}\`\n\n`;

    // Summary table
    md += `| 項目 | 值 |\n|------|----|\n`;
    md += `| 場景總數 | ${r.sceneCount} |\n`;
    md += `| 選擇點數量 | ${r.choicePoints} |\n`;
    md += `| Ending 數量 | ${r.endings.length} |\n`;
    md += `| 可抵達 ending | ${r.reachableEndingCount} |\n`;
    md += `| 缺失 scene id | ${r.missingIds.length > 0 ? r.missingIds.join(", ") : "無"} |\n`;
    md += `| 無法抵達場景 | ${r.unreachable.length > 0 ? r.unreachable.join(", ") : "無"} |\n`;
    md += `| 死結 | ${r.deadlocks.length > 0 ? r.deadlocks.join(", ") : "無"} |\n`;
    md += `\n`;

    // Errors
    if (r.errors.length > 0) {
      md += `### Errors\n\n`;
      r.errors.forEach((e) => (md += `- ❌ ${e}\n`));
      md += `\n`;
    }

    // Warnings
    if (r.warnings.length > 0) {
      md += `### Warnings\n\n`;
      r.warnings.forEach((w) => (md += `- ⚠️ ${w}\n`));
      md += `\n`;
    }

    // Flags
    const flagKeys = Object.keys(r.flagDefs);
    if (flagKeys.length > 0) {
      md += `### Flags 使用統計\n\n`;
      md += `| Flag | 定義於場景 |\n|------|------------|\n`;
      for (const flag of flagKeys.sort()) {
        md += `| \`${flag}\` | ${r.flagDefs[flag].join(", ")} |\n`;
      }
      md += `\n`;
    }

    // Playthroughs
    md += `### Playthrough 測試\n\n`;
    md += `| 測試 | 結果 | 步數 | 終點場景 | nerve | insight | writing | 筆記數 |\n`;
    md += `|------|------|------|----------|-------|---------|---------|--------|\n`;
    for (const p of r.playthroughs) {
      const result = p.success ? "✅ PASS" : `❌ FAIL`;
      const steps = p.steps ?? "—";
      const end = p.endScene ?? p.error ?? "—";
      const n = p.state?.nerve ?? "—";
      const i = p.state?.insight ?? "—";
      const w = p.state?.writing ?? "—";
      const nb = p.state?.notebook ?? "—";
      md += `| ${p.name} | ${result} | ${steps} | ${end} | ${n} | ${i} | ${w} | ${nb} |\n`;
    }
    md += `\n`;
  }

  const allPass = reports.every((r) => r.errors.length === 0);
  md += `---\n\n`;
  md += allPass
    ? `**All chapters passed validation.**\n`
    : `**Some chapters have errors — see details above.**\n`;

  return md;
}

// ── Run ────────────────────────────────────────────────────

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
