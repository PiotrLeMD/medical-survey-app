import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { LabTest } from "@/lib/data/lab-tests"
import {
  PDF_FONT,
  pdfTableHeadStyles,
  pdfTableStyles,
  registerRobotoFonts,
} from "@/lib/fonts/register-roboto"
import { calculateBudgetAllocation } from "./recommendation-engine"
import { generatePrepInstructions } from "./prep-instructions"
import { getLogoDimensionsMm, loadLogoForPdf } from "./pdf-logo"

const MARGIN_LEFT = 20
const MARGIN_RIGHT = 20
const PAGE_BOTTOM_MARGIN = 20

function ensureVerticalSpace(doc: jsPDF, y: number, requiredHeight: number): number {
  const pageHeight = doc.internal.pageSize.height
  if (y + requiredHeight > pageHeight - PAGE_BOTTOM_MARGIN) {
    doc.addPage()
    registerRobotoFonts(doc)
    return 20
  }
  return y
}

function renderPrepInstructions(
  doc: jsPDF,
  startY: number,
  instructions: string[]
): number {
  let y = ensureVerticalSpace(doc, startY, 30)
  const contentWidth =
    doc.internal.pageSize.width - MARGIN_LEFT - MARGIN_RIGHT

  doc.setFont(PDF_FONT, "bold")
  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.text("Jak przygotować się do Twoich badań:", MARGIN_LEFT, y)
  y += 8

  doc.setFont(PDF_FONT, "normal")
  doc.setFontSize(10)

  instructions.forEach((instruction, index) => {
    const bulletText = `• ${instruction}`
    const lines = doc.splitTextToSize(bulletText, contentWidth)

    lines.forEach((line: string) => {
      y = ensureVerticalSpace(doc, y, 6)
      doc.text(line, MARGIN_LEFT, y)
      y += 5
    })

    if (index < instructions.length - 1) {
      y += 2
    }
  })

  return y + 6
}

async function renderPdfHeader(
  doc: jsPDF,
  companyName: string,
  anonimoweId?: string
): Promise<number> {
  const logoTop = 14
  let textX = MARGIN_LEFT
  let contentStartY = 58

  const logo = await loadLogoForPdf()

  if (logo) {
    const { widthMm, heightMm } = getLogoDimensionsMm(logo)
    doc.addImage(logo.dataUrl, logo.format, MARGIN_LEFT, logoTop, widthMm, heightMm)
    textX = MARGIN_LEFT + widthMm + 5
    contentStartY = logoTop + heightMm + 10

    doc.setFontSize(12)
    doc.setFont(PDF_FONT, "bold")
    doc.setTextColor(0)
    doc.text(
      "Skierowanie na badania laboratoryjne",
      textX,
      logoTop + heightMm / 2 + 2
    )
  } else {
    doc.setFontSize(20)
    doc.setFont(PDF_FONT, "bold")
    doc.setTextColor(0)
    doc.text("LongLife", MARGIN_LEFT, 20)

    doc.setFontSize(12)
    doc.setFont(PDF_FONT, "normal")
    doc.text("Skierowanie na badania laboratoryjne", MARGIN_LEFT, 30)
    contentStartY = 52
  }

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Firma: ${companyName}`, MARGIN_LEFT, contentStartY - 7)
  doc.text(
    `Data wygenerowania: ${new Date().toLocaleDateString("pl-PL")}`,
    MARGIN_LEFT,
    contentStartY
  )

  let metaBottomY = contentStartY

  if (anonimoweId) {
    metaBottomY += 8
    doc.setTextColor(0)
    doc.setFont(PDF_FONT, "bold")
    doc.setFontSize(11)
    doc.text(`Numer zapotrzebowania: ${anonimoweId}`, MARGIN_LEFT, metaBottomY)
  }

  doc.setTextColor(0)

  return metaBottomY + 10
}

export async function generatePdf(
  allTests: LabTest[],
  selectedIds: number[],
  companyName: string,
  removedIds: number[] = [],
  anonimoweId?: string
): Promise<void> {
  const doc = new jsPDF()
  registerRobotoFonts(doc)

  const allocation = calculateBudgetAllocation(
    allTests,
    Infinity,
    selectedIds,
    removedIds
  )

  const selectedTests = [
    ...allocation.employerFunded,
    ...allocation.additionalPaid,
  ]
  const prepInstructions = generatePrepInstructions(selectedTests)

  const tableDefaults = {
    styles: pdfTableStyles,
    headStyles: {
      ...pdfTableHeadStyles,
      fillColor: [59, 130, 246] as [number, number, number],
      textColor: 255,
    },
    bodyStyles: pdfTableStyles,
    margin: { left: MARGIN_LEFT, right: MARGIN_RIGHT },
  }

  let yPosition = await renderPdfHeader(doc, companyName, anonimoweId)

  if (allocation.employerFunded.length > 0) {
    doc.setFontSize(12)
    doc.setFont(PDF_FONT, "bold")
    doc.text("Badania finansowane przez pracodawcę", MARGIN_LEFT, yPosition)
    yPosition += 8

    autoTable(doc, {
      startY: yPosition,
      head: [["Lp.", "Nazwa badania"]],
      body: allocation.employerFunded.map((test, index) => [
        (index + 1).toString(),
        test.nazwa,
      ]),
      theme: "grid",
      ...tableDefaults,
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: "auto" },
      },
    })

    yPosition =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 15
  }

  if (allocation.additionalPaid.length > 0) {
    yPosition = ensureVerticalSpace(doc, yPosition, 40)

    doc.setFontSize(12)
    doc.setFont(PDF_FONT, "bold")
    doc.text("Badania dodatkowe (płatne w placówce)", MARGIN_LEFT, yPosition)
    yPosition += 8

    const additionalData = allocation.additionalPaid.map((test, index) => {
      const discountedPrice = test.cena_rynk * 0.7
      return [
        (index + 1).toString(),
        test.nazwa,
        `${discountedPrice.toFixed(2)} PLN`,
      ]
    })

    const totalAdditional = allocation.additionalPaid.reduce(
      (sum, test) => sum + test.cena_rynk * 0.7,
      0
    )

    autoTable(doc, {
      startY: yPosition,
      head: [["Lp.", "Nazwa badania", "Cena po zniżce"]],
      body: [
        ...additionalData,
        ["", "RAZEM DO ZAPŁATY:", `${totalAdditional.toFixed(2)} PLN`],
      ],
      theme: "grid",
      styles: pdfTableStyles,
      headStyles: {
        ...pdfTableHeadStyles,
        fillColor: [107, 114, 128],
        textColor: 255,
      },
      bodyStyles: pdfTableStyles,
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 40, halign: "right" },
      },
      margin: { left: MARGIN_LEFT, right: MARGIN_RIGHT },
      didParseCell: (data) => {
        if (data.row.index === additionalData.length) {
          data.cell.styles.fontStyle = "bold"
        }
      },
    })

    yPosition =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 15
  }

  yPosition = renderPrepInstructions(doc, yPosition, prepInstructions)

  doc.setFont(PDF_FONT, "normal")
  doc.setFontSize(9)
  doc.setTextColor(100)
  yPosition = ensureVerticalSpace(doc, yPosition, 12)
  doc.text(
    "Niniejsze skierowanie zostało wygenerowane automatycznie przez system MedScreen.",
    MARGIN_LEFT,
    yPosition
  )
  doc.text(
    "Skierowanie ważne 30 dni od daty wygenerowania.",
    MARGIN_LEFT,
    yPosition + 5
  )

  const idPart = anonimoweId
    ? anonimoweId.toLowerCase()
    : Date.now().toString()
  const fileName = `skierowanie-${companyName.toLowerCase().replace(/\s+/g, "-")}-${idPart}.pdf`
  doc.save(fileName)
}
