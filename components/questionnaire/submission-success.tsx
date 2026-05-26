"use client"

import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SubmissionSuccessProps {
  anonimoweId: string
  onDownloadPdf: () => void
  isPdfLoading?: boolean
}

export function SubmissionSuccess({
  anonimoweId,
  onDownloadPdf,
  isPdfLoading = false,
}: SubmissionSuccessProps) {
  return (
    <Card className="border-green-500/40 bg-green-50/30">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Dziękujemy!</CardTitle>
        <CardDescription className="text-base">
          Twoje zapotrzebowanie zostało zapisane. Poniżej znajdziesz numer potrzebny w punkcie pobrań.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="rounded-xl border-2 border-primary/30 bg-background px-6 py-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Twój numer anonimowy
          </p>
          <p className="mt-3 text-4xl sm:text-5xl font-bold tracking-wider text-primary tabular-nums">
            {anonimoweId}
          </p>
          <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Zapisz ten numer. Będzie Ci potrzebny w punkcie pobrań.
          </p>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onDownloadPdf}
          disabled={isPdfLoading}
        >
          {isPdfLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generowanie PDF...
            </>
          ) : (
            "Pobierz skierowanie PDF"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
