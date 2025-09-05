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

export async function createResumeWithLayoutPDF(
  sections: { key: string; value: string }[],
  sectionOrder: string[]
) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 750;
  const leftMargin = 50;
  const pageWidth = 550;

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    size: number,
    fontType = font,
    color = rgb(0, 0, 0)
  ) => {
    page.drawText(text, { x, y: yPos, size, font: fontType, color });
    return yPos;
  };

  const splitTextToLines = (
    text: string,
    maxWidth: number,
    fontSize: number
  ) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = testLine.length * fontSize * 0.6;

      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const nameSection = sections.find((s) => s.key.toLowerCase() === "name");
  const contactSection = sections.find(
    (s) => s.key.toLowerCase() === "contact"
  );
  const otherSections = sectionOrder.filter(
    (key) => key.toLowerCase() !== "name" && key.toLowerCase() !== "contact"
  );

  if (nameSection || contactSection) {
    const halfWidth = pageWidth / 2;

    if (nameSection) {
      drawText("Name", leftMargin, y, 16, boldFont);
      y -= 22;

      const nameLines = nameSection.value.split("\n");
      for (const line of nameLines) {
        const wrappedLines = splitTextToLines(line, halfWidth - 20, 12);
        for (const wrappedLine of wrappedLines) {
          drawText(wrappedLine, leftMargin, y, 12);
          y -= 16;
        }
      }
    }

    let contactY = 750;
    if (contactSection) {
      drawText(
        "Contact",
        leftMargin + halfWidth,
        contactY,
        16,
        boldFont
      );
      contactY -= 22;

      const contactLines = contactSection.value.split("\n");
      for (const line of contactLines) {
        const wrappedLines = splitTextToLines(line, halfWidth - 20, 12);
        for (const wrappedLine of wrappedLines) {
          drawText(wrappedLine, leftMargin + halfWidth, contactY, 12);
          contactY -= 16;
        }
      }
    }

    y = Math.min(y, contactY) - 30;
  }

  for (const sectionKey of otherSections) {
    const section = sections.find(
      (s) => s.key.toLowerCase() === sectionKey.toLowerCase()
    );
    if (!section) continue;

    if (y < 100) {
      page = pdfDoc.addPage([600, 800]);
      y = 750;
    }

    const title = sectionKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    drawText(title, leftMargin, y, 16, boldFont);
    y -= 25;

    const contentLines = section.value.split("\n");
    for (const line of contentLines) {
      if (line.trim()) {
        const wrappedLines = splitTextToLines(line, pageWidth - 20, 11);
        for (const wrappedLine of wrappedLines) {
          if (y < 50) {
            page = pdfDoc.addPage([600, 800]);
            y = 750;
          }
          drawText(wrappedLine, leftMargin + 5, y, 11);
          y -= 16;
        }
      } else {
        y -= 8;
      }
    }
    y -= 20;
  }

  return (await pdfDoc.save()).buffer as ArrayBuffer;
}
