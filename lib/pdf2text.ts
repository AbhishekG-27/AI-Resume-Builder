type TextItemLike = {
  str: string;
  width: number;
  height?: number;
  dir?: "ltr" | "rtl";
  transform: [number, number, number, number, number, number]; // [a,b,c,d,e,f]
};

type PageTextContent = { items: TextItemLike[] };

type PositionedItem = {
  text: string;
  x: number;
  y: number; // baseline/top depending on PDF.js; used consistently
  width: number;
  height: number;
  dir: "ltr" | "rtl";
  fontSize: number;
};

type PageBlock = {
  page: number;
  columns: ColumnBlock[];
};

type ColumnBlock = {
  columnIndex: number;
  paragraphs: string[];
};

export async function extractStructuredPdfText(file: File, pdfjsLib: any) {
  if (!pdfjsLib) throw new Error("PDF.js not loaded");

  const arrayBuffer = await file.arrayBuffer();
  const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const results: PageBlock[] = [];

  for (let pageIndex = 1; pageIndex <= pdfDocument.numPages; pageIndex++) {
    const page = await pdfDocument.getPage(pageIndex);
    const content: PageTextContent = await page.getTextContent();

    // 1) Normalize items to positioned items
    const positioned = content.items
      .filter((i) => i.str && i.str.trim().length > 0)
      .map(parseItem);

    if (positioned.length === 0) {
      results.push({ page: pageIndex, columns: [] });
      continue;
    }

    // 2) Group into lines (top-to-bottom, then left-to-right)
    const lines = groupLines(positioned);

    // 3) Optional: detect columns and split lines into columns
    const columns = detectColumns(lines);
    const linesByColumn = assignLinesToColumns(lines, columns);

    // 4) Build paragraphs within each column
    const pageColumns: ColumnBlock[] = [];
    for (let c = 0; c < columns.length; c++) {
      const colLines = (linesByColumn.get(c) ?? []).sort(
        (a, b) => b.y - a.y || a.x - b.x
      );
      const paragraphs = groupParagraphs(colLines);
      pageColumns.push({ columnIndex: c, paragraphs });
    }

    // Fallback: if no columns detected, emit a single column
    if (columns.length === 0) {
      const paragraphs = groupParagraphs(lines);
      results.push({
        page: pageIndex,
        columns: [{ columnIndex: 0, paragraphs }],
      });
    } else {
      results.push({ page: pageIndex, columns: pageColumns });
    }
  }

  // 5) Render to a structured text suitable for LLMs
  // Includes page and column dividers; preserves paragraphs and line breaks
  const rendered = results
    .map((block) => {
      const header = `--- Page ${block.page} ---`;
      if (block.columns.length === 0) return `${header}\n`;
      const body = block.columns
        .sort((a, b) => a.columnIndex - b.columnIndex)
        .map((col) => {
          const colHeader =
            block.columns.length > 1
              ? `-- Column ${col.columnIndex + 1} --`
              : "";
          const paras = col.paragraphs.join("\n\n"); // blank line between paragraphs
          return [colHeader, paras].filter(Boolean).join("\n");
        })
        .join("\n\n");
      return `${header}\n${body}`;
    })
    .join("\n\n");

  return rendered;
}

// --- Helpers ---

function parseItem(item: TextItemLike): PositionedItem {
  const [a, b, c, d, e, f] = item.transform;
  const fontHeight = Math.hypot(b, d) || item.height || 10; // robust fallback
  return {
    text: item.str,
    x: e,
    y: f,
    width: item.width,
    height: item.height ?? fontHeight,
    dir: (item.dir as "ltr" | "rtl") || "ltr",
    fontSize: fontHeight,
  };
}

type Line = PositionedItem[];

// Sort items into lines by y proximity; inside a line, sort by x
function groupLines(items: PositionedItem[]): Line[] {
  const sorted = items.slice().sort((p, q) => q.y - p.y || p.x - q.x);

  // Estimate baseline tolerance from median font size
  const medianFont = median(sorted.map((i) => i.fontSize)) || 10;
  const yEps = Math.max(1, medianFont * 0.45);

  const lines: Line[] = [];
  for (const it of sorted) {
    // Find an existing line whose baseline is close
    let placed = false;
    for (const ln of lines) {
      if (Math.abs(ln[0].y - it.y) <= yEps) {
        ln.push(it);
        placed = true;
        break;
      }
    }
    if (!placed) lines.push([it]);
  }
  // Sort each line left-to-right; handle RTL by later joining if needed
  for (const ln of lines) ln.sort((a, b) => a.x - b.x);
  return lines;
}

// Join a line into text, inserting spaces based on inter-run gaps
function joinWithSpaces(line: PositionedItem[]): string {
  if (line.length === 0) return "";

  // Average char width across items to set a gap threshold
  const avgChar =
    line.reduce((s, i) => s + i.width / Math.max(1, i.text.length), 0) /
    Math.max(1, line.length);

  // Slightly conservative threshold so we don't over-space
  const gapThreshold = avgChar * 0.55;

  let out = "";
  for (let i = 0; i < line.length; i++) {
    const cur = line[i];
    out += cur.text;
    const next = line[i + 1];
    if (!next) break;
    const gap = next.x - (cur.x + cur.width);
    if (gap > gapThreshold) out += " ";
  }
  return out;
}

// Paragraph grouping based on vertical gaps between adjacent lines
function groupParagraphs(lines: Line[]): string[] {
  if (lines.length === 0) return [];

  // Compute representative line height per line
  const lineHeights = lines.map((ln) => Math.max(...ln.map((i) => i.height)));
  const medianH = median(lineHeights) || 12;
  const paraGap = Math.max(2, medianH * 0.85);

  const out: string[] = [];
  let current: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const joined = joinWithSpaces(lines[i]);
    current.push(joined);

    const next = lines[i + 1];
    if (!next) break;

    const yCur = lines[i][0].y;
    const yNext = next[0].y;
    const vgap = yCur - yNext;

    if (vgap > paraGap) {
      out.push(current.join("\n")); // preserve line breaks within paragraph
      current = [];
    }
  }
  if (current.length) out.push(current.join("\n"));
  return out;
}

// Simple column detection: cluster line mid-x into vertical bands
function detectColumns(lines: Line[]): Array<{ xMin: number; xMax: number }> {
  if (lines.length < 2) return [];

  // Compute each line's x span
  const spans = lines.map((ln) => {
    const xMin = Math.min(...ln.map((i) => i.x));
    const xMax = Math.max(...ln.map((i) => i.x + i.width));
    return { xMin, xMax, mid: (xMin + xMax) / 2 };
  });

  // Greedy clustering by mid x; tolerance is relative to page width proxy
  const widthProxy =
    Math.max(...spans.map((s) => s.xMax)) -
      Math.min(...spans.map((s) => s.xMin)) || 1;
  const tol = widthProxy * 0.06;

  const clusters: Array<{
    mid: number;
    xMin: number;
    xMax: number;
    count: number;
  }> = [];
  for (const s of spans) {
    let placed = false;
    for (const c of clusters) {
      if (Math.abs(c.mid - s.mid) <= tol) {
        c.mid = (c.mid * c.count + s.mid) / (c.count + 1);
        c.xMin = Math.min(c.xMin, s.xMin);
        c.xMax = Math.max(c.xMax, s.xMax);
        c.count += 1;
        placed = true;
        break;
      }
    }
    if (!placed)
      clusters.push({ mid: s.mid, xMin: s.xMin, xMax: s.xMax, count: 1 });
  }

  // Keep clusters with sufficient lines to qualify as a column
  const minLinesPerColumn = Math.max(3, Math.floor(lines.length * 0.08));
  const cols = clusters
    .filter((c) => c.count >= minLinesPerColumn)
    .sort((a, b) => a.xMin - b.xMin)
    .map((c) => ({ xMin: c.xMin, xMax: c.xMax }));

  return cols;
}

function assignLinesToColumns(
  lines: Line[],
  columns: Array<{ xMin: number; xMax: number }>
) {
  const map = new Map<number, Line[]>();
  if (columns.length === 0) return map;
  for (let i = 0; i < columns.length; i++) map.set(i, []);

  for (const ln of lines) {
    const xMin = Math.min(...ln.map((i) => i.x));
    const xMax = Math.max(...ln.map((i) => i.x + i.width));
    const mid = (xMin + xMax) / 2;

    let best = -1;
    let bestDist = Infinity;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const dist =
        mid < col.xMin ? col.xMin - mid : mid > col.xMax ? mid - col.xMax : 0;
      if (dist < bestDist) {
        best = i;
        bestDist = dist;
      }
    }
    if (best >= 0) map.get(best)!.push(ln);
  }
  return map;
}

function median(arr: number[]): number | undefined {
  if (arr.length === 0) return undefined;
  const s = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
