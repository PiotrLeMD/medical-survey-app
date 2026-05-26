import type { jsPDF } from "jspdf"
import { ROBOTO_BOLD_BASE64, ROBOTO_REGULAR_BASE64 } from "./roboto-base64"

export const PDF_FONT = "Roboto"

const ROBOTO_REGULAR_FILE = "Roboto-Regular.ttf"
const ROBOTO_BOLD_FILE = "Roboto-Bold.ttf"

export function registerRobotoFonts(doc: jsPDF): void {
  const fontList = doc.getFontList()

  if (!fontList[PDF_FONT]) {
    doc.addFileToVFS(ROBOTO_REGULAR_FILE, ROBOTO_REGULAR_BASE64)
    doc.addFont(ROBOTO_REGULAR_FILE, PDF_FONT, "normal")
    doc.addFileToVFS(ROBOTO_BOLD_FILE, ROBOTO_BOLD_BASE64)
    doc.addFont(ROBOTO_BOLD_FILE, PDF_FONT, "bold")
  }

  doc.setFont(PDF_FONT, "normal")
}

export const pdfTableStyles = {
  font: PDF_FONT,
  fontStyle: "normal" as const,
}

export const pdfTableHeadStyles = {
  font: PDF_FONT,
  fontStyle: "bold" as const,
}
