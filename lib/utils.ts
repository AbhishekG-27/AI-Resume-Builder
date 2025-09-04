import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};

export async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 30;
  page.drawText("Creating PDFs in JavaScript is awesome!", {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes.buffer as ArrayBuffer;
}

export async function createResumePDF(
  sections: { key: string; value: string }[],
  sectionOrder: string[]
) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]); // A4 size

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 750; // Start near top of page

  for (const sectionKey of sectionOrder) {
    const section = sections.find((s) => s.key === sectionKey);
    if (!section) continue;
    const title = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
    const content = section.value || "";

    // Draw section title
    page.drawText(title, { x: 50, y, size: 20, font, color: rgb(0, 0, 1) });
    y -= 30;

    // Draw section content
    page.drawText(content, { x: 60, y, size: 12, font, color: rgb(0, 0, 0) });
    y -= content.split("\n").length * 14 + 40; // Move down for next section
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes.buffer as ArrayBuffer;
}

export async function createSingleColumnResumePDF(
  sections: { key: string; value: string }[],
  sectionOrder: string[]
) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 800]); // A4 portrait in points
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 750; // Top margin

  for (const section of sectionOrder) {
    const sectionData = sections.find(
      (s) => s.key.toLowerCase() === section.toLowerCase()
    );
    if (!sectionData) continue;

    const title = section
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()); // "workExperience" => "Work Experience"
    const content = sectionData.value || "";

    // Draw section title
    page.drawText(title, {
      x: 50,
      y: y,
      size: 18,
      font: font,
      color: rgb(0.1, 0.2, 0.4),
    });
    y -= 28;

    // Draw content, splitting into lines if needed
    const lines = content.split("\n");
    for (const line of lines) {
      page.drawText(line, {
        x: 60,
        y: y,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      });
      y -= 16;
      if (y < 50) {
        // Add a new page if running out of space
        y = 750;
        page = pdfDoc.addPage([600, 800]);
      }
    }
    y -= 22; // Space after section
  }

  return (await pdfDoc.save()).buffer as ArrayBuffer;
}
