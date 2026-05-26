"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { AppLogo } from "@/components/app-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StepIndicator } from "@/components/questionnaire/step-indicator"
import { Step1Demographics } from "@/components/questionnaire/step-1-demographics"
import { Step2Lifestyle } from "@/components/questionnaire/step-2-lifestyle"
import { Step3Symptoms } from "@/components/questionnaire/step-3-symptoms"
import { BudgetCalculator } from "@/components/questionnaire/budget-calculator"
import { SubmissionSuccess } from "@/components/questionnaire/submission-success"
import { toast } from "sonner"
import { calculateBudgetAllocation } from "@/lib/services/recommendation-engine"
import {
  buildZapotrzebowaniePayload,
  generateAnonymousId,
  submitZapotrzebowanie,
} from "@/lib/services/submit-zapotrzebowanie"
import type { Company, QuestionnaireAnswers } from "@/lib/data/types"
import { initialAnswers } from "@/lib/data/types"
import type { LabTest } from "@/lib/data/lab-tests"
import { getCompanyBySlug } from "@/lib/services/mock-database"
import { generateRecommendations } from "@/lib/services/recommendation-engine"
import { generatePdf } from "@/lib/services/pdf-generator"

const STEP_LABELS = ["Dane", "Styl życia", "Objawy", "Wyniki"]

export function QuestionnaireWizard() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [company, setCompany] = React.useState<Company | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [currentStep, setCurrentStep] = React.useState(1)
  const [answers, setAnswers] = React.useState<QuestionnaireAnswers>(initialAnswers)
  const [basketTests, setBasketTests] = React.useState<LabTest[]>([])
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const [removedIds, setRemovedIds] = React.useState<number[]>([])
  const [anonimoweId, setAnonimoweId] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isPdfLoading, setIsPdfLoading] = React.useState(false)

  React.useEffect(() => {
    async function loadCompany() {
      try {
        const data = await getCompanyBySlug(slug)
        if (data) {
          setCompany(data)
        } else {
          toast.error("Nie znaleziono firmy")
          router.push("/")
        }
      } catch {
        toast.error("Błąd ładowania danych firmy")
      } finally {
        setLoading(false)
      }
    }
    loadCompany()
  }, [slug, router])

  const handleChange = (updates: Partial<QuestionnaireAnswers>) => {
    setAnswers(prev => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return answers.plec && answers.wiek && answers.praca
      case 2:
        return answers.dieta
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep === 3) {
      const result = generateRecommendations(answers)
      setBasketTests(result.tests)
      setSelectedIds(result.tests.map(t => t.id))
      setRemovedIds([])
      setAnonimoweId(null)
      setCurrentStep(4)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmitBasket = async () => {
    if (!company) return

    const allocation = calculateBudgetAllocation(
      basketTests,
      company.budzet,
      selectedIds,
      removedIds
    )

    if (!allocation.isWithinBudget) {
      toast.error("Dostosuj pakiet, aby zmieścić się w budżecie pracodawcy.")
      return
    }

    const generatedId = generateAnonymousId()
    const payload = buildZapotrzebowaniePayload(
      generatedId,
      slug,
      answers,
      basketTests,
      selectedIds,
      removedIds
    )

    setIsSubmitting(true)
    try {
      const result = await submitZapotrzebowanie(payload)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      setAnonimoweId(generatedId)
      toast.success("Zapotrzebowanie zostało zapisane")
    } catch {
      toast.error("Nie udało się zapisać zapotrzebowania")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGeneratePdf = async () => {
    if (!company || !anonimoweId) return

    setIsPdfLoading(true)
    try {
      await generatePdf(
        basketTests,
        selectedIds,
        company.nazwa,
        removedIds,
        anonimoweId
      )
      toast.success("Skierowanie PDF zostało pobrane")
    } catch {
      toast.error("Nie udało się wygenerować PDF")
    } finally {
      setIsPdfLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!company) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <AppLogo subtitle="Ankieta zdrowotna" priority />
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        {currentStep === 1 && (
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <AppLogo showSubtitle={false} className="mb-4" priority />
              <h2 className="text-xl font-semibold text-balance">
                Witaj w strefie zdrowia {company.nazwa}
              </h2>
              <p className="mt-2 text-muted-foreground">
                Wypełnij krótką ankietę, aby otrzymać spersonalizowany zestaw badań laboratoryjnych. 
                Wybrane badania mogą być pokryte z pakietu benefitów Twojego pracodawcy.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator 
            currentStep={currentStep} 
            totalSteps={4} 
            labels={STEP_LABELS} 
          />
        </div>

        {/* Step Content */}
        {currentStep < 4 ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Podstawowe informacje"}
                {currentStep === 2 && "Styl życia i historia rodzinna"}
                {currentStep === 3 && "Aktualne objawy"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Podaj informacje o sobie, które pomogą nam dobrać odpowiednie badania"}
                {currentStep === 2 && "Informacje o diecie i chorobach w rodzinie pozwalają wykryć zagrożenia"}
                {currentStep === 3 && "Zaznacz objawy, które występują u Ciebie regularnie"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <Step1Demographics answers={answers} onChange={handleChange} />
              )}
              {currentStep === 2 && (
                <Step2Lifestyle answers={answers} onChange={handleChange} />
              )}
              {currentStep === 3 && (
                <Step3Symptoms answers={answers} onChange={handleChange} />
              )}
            </CardContent>
          </Card>
        ) : anonimoweId ? (
          <SubmissionSuccess
            anonimoweId={anonimoweId}
            onDownloadPdf={handleGeneratePdf}
            isPdfLoading={isPdfLoading}
          />
        ) : (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Twój spersonalizowany zestaw badań</CardTitle>
                <CardDescription>
                  Na podstawie Twoich odpowiedzi algorytm dobrał {basketTests.length} badań laboratoryjnych. 
                  Dostosuj zestaw do budżetu pracodawcy, a następnie wyślij zapotrzebowanie.
                </CardDescription>
              </CardHeader>
            </Card>
            <BudgetCalculator
              tests={basketTests}
              employerBudget={company.budzet}
              selectedIds={selectedIds}
              removedIds={removedIds}
              onTestsChange={setBasketTests}
              onSelectionChange={setSelectedIds}
              onRemovedChange={setRemovedIds}
              onSubmit={handleSubmitBasket}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wstecz
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === 3 ? "Zobacz wyniki" : "Dalej"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setAnonimoweId(null)
                setCurrentStep(1)
              }}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wypełnij ankietę ponownie
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-8">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            MedScreen - System badań profilaktycznych dla firm
          </p>
        </div>
      </footer>
    </div>
  )
}
