/**
 * Parser smoke test. Run: node --experimental-strip-types scripts/probe-content.mts
 * Reports the block census and anything the renderer would choke on.
 */
import { getAllPages, getAllUrls, type Block } from "../lib/content.ts";

const pages = getAllPages();
const census: Record<string, number> = {};
const urls = new Set(getAllUrls());
const broken: string[] = [];

function walkBlocks(blocks: Block[], page: string) {
  for (const block of blocks) {
    census[block.kind] = (census[block.kind] ?? 0) + 1;
    if (block.kind === "widget") walkBlocks(block.blocks, page);
    if (block.kind === "cta" && !urls.has(block.href.split("#")[0])) {
      broken.push(`${page} CTA -> ${block.href}`);
    }
  }
}

for (const page of pages) walkBlocks(page.blocks, page.frontMatter.url);

const quizPage = pages.find((page) => page.frontMatter.url === "/how-it-works")!;
const quiz = quizPage.blocks.find(
  (block): block is Extract<Block, { kind: "widget" }> =>
    block.kind === "widget" && block.name === "quiz",
);

const dateTypes = new Set(pages.map((page) => typeof page.frontMatter.last_reviewed));
const quotes = pages.flatMap((page) =>
  page.blocks.filter((block): block is Extract<Block, { kind: "quote" }> => block.kind === "quote"),
);

console.log("pages:", pages.length, "urls:", urls.size);
console.log("blocks:", census);
console.log("last_reviewed types:", [...dateTypes]);
console.log("quote paragraph counts:", quotes.map((quote) => quote.paragraphs.length));
console.log("quiz blocks:", quiz?.blocks.length, "instructions kept out of copy:", quiz?.instructions.length);
console.log("broken CTA targets:", broken);

const leaked = pages.filter((page) =>
  page.blocks.some(
    (block) =>
      (block.kind === "paragraph" || block.kind === "heading") &&
      /Routing rules for Cursor|^\[(QUIZ|\/QUIZ|PROVIDER DIRECTORY|RESOURCE LIBRARY|BLOG INDEX)\]/.test(
        block.kind === "heading" ? block.text : JSON.stringify(block.inline),
      ),
  ),
);
console.log("pages still leaking build instructions:", leaked.map((page) => page.frontMatter.url));
