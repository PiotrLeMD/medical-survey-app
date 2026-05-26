export type PdfLogoImage = {
  dataUrl: string
  format: "PNG" | "JPEG" | "WEBP"
  width: number
  height: number
}

const LOGO_PATH = "/logo.png"

export async function loadLogoForPdf(): Promise<PdfLogoImage | null> {
  if (typeof window === "undefined") return null

  try {
    const response = await fetch(LOGO_PATH)
    if (!response.ok) return null

    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)

    return await new Promise((resolve) => {
      const image = new Image()

      image.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight

        const context = canvas.getContext("2d")
        if (!context) {
          URL.revokeObjectURL(objectUrl)
          resolve(null)
          return
        }

        context.drawImage(image, 0, 0)
        URL.revokeObjectURL(objectUrl)

        const dataUrl = canvas.toDataURL("image/png")
        resolve({
          dataUrl,
          format: "PNG",
          width: image.naturalWidth,
          height: image.naturalHeight,
        })
      }

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        resolve(null)
      }

      image.src = objectUrl
    })
  } catch {
    return null
  }
}

export const PDF_LOGO_MAX_HEIGHT_MM = 12

export function getLogoDimensionsMm(logo: PdfLogoImage): {
  widthMm: number
  heightMm: number
} {
  const heightMm = PDF_LOGO_MAX_HEIGHT_MM
  const widthMm = (logo.width / logo.height) * heightMm
  return { widthMm, heightMm }
}
