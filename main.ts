// Laugh Track entry: one joke about crypto trading life, one line.
// The program assembles the joke from a setup and a turn, checks the
// contest gate (UTF-8 text, 1-200 characters, not only whitespace),
// then writes it to $MAKEFUN_OUTPUT_DIR/entry.txt, mode 0644.

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SETUP = "I bought the dip.";
const TURN = "The dip bought a shovel.";

function buildJoke(): string {
  return `${SETUP} ${TURN}`;
}

function gate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`joke is ${chars} characters, gate is 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("joke is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("joke must be a single line");
  }
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  const joke = buildJoke();
  gate(joke);
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, joke, { encoding: "utf8", mode: 0o644 });
  // umask can strip the mode at creation, so set 0644 explicitly:
  // the grader must be able to read the output.
  chmodSync(target, 0o644);
  console.log(`wrote ${joke.length} characters to ${target}`);
}

main();
