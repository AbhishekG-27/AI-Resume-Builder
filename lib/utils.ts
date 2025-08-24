import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as pdfjsLib from "pdfjs-dist";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};

export const extractTextFromPDF = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const content = await page.getTextContent();

    // Extract the text items from the page content
    const strings = content.items
      .map((item: TextItem | TextMarkedContent) => {
        if ("str" in item) {
          return item.str;
        }
        return "";
      })
      .filter((text) => text !== "");
    fullText += strings.join(" ") + "\n\n";
  }
  return fullText;
};
