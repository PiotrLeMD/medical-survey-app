"use client"

import * as React from "react"
import { Info, Check, X, AlertTriangle, CheckCircle, ArrowRight, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { LabTest } from "@/lib/data/lab-tests"
import {
  addToAdditionalPaid,
  calculateBudgetAllocation,
  tryAddToEmployerPackage,
} from "@/lib/services/recommendation-engine"
import { TestSearchPicker } from "@/components/questionnaire/test-search-picker"
import { toast } from "sonner"

interface BudgetCalculatorProps {
  tests: LabTest[]
  employerBudget: number
  selectedIds: number[]
  removedIds: number[]
  onTestsChange: (tests: LabTest[]) => void
  onSelectionChange: (ids: number[]) => void
  onRemovedChange: (ids: number[]) => void
  onSubmit: () => void | Promise<void>
  isSubmitting?: boolean
}

export function BudgetCalculator({
  tests,
  employerBudget,
  selectedIds,
  removedIds,
  onTestsChange,
  onSelectionChange,
  onRemovedChange,
  onSubmit,
  isSubmitting = false,
}: BudgetCalculatorProps) {
  const allocation = calculateBudgetAllocation(
    tests,
    employerBudget,
    selectedIds,
    removedIds
  )

  const activeTestIds = React.useMemo(
    () => new Set(tests.filter(t => !removedIds.includes(t.id)).map(t => t.id)),
    [tests, removedIds]
  )

  const isInEmployerPackage = (testId: number) =>
    activeTestIds.has(testId) && selectedIds.includes(testId)

  const isInAdditionalCart = (testId: number) =>
    activeTestIds.has(testId) && !selectedIds.includes(testId)

  const handleAddToEmployer = (test: LabTest) => {
    if (isInEmployerPackage(test.id)) {
      toast.info("To badanie jest już w pakiecie pracodawcy.")
      return
    }

    const result = tryAddToEmployerPackage(
      tests,
      employerBudget,
      selectedIds,
      removedIds,
      test
    )

    onTestsChange(result.tests)
    onSelectionChange(result.selectedIds)
    onRemovedChange(result.removedIds)

    if (result.placedIn === "employer") {
      toast.success("Badanie dodano do pakietu pracodawcy.")
    } else {
      toast.info(
        "Pakiet pracodawcy został przekroczony — badanie trafiło do badań dodatkowo płatnych."
      )
    }
  }

  const handleAddToAdditional = (test: LabTest) => {
    if (isInAdditionalCart(test.id)) {
      toast.info("To badanie jest już w koszyku dodatkowo płatnych.")
      return
    }

    const result = addToAdditionalPaid(tests, selectedIds, removedIds, test)
    onTestsChange(result.tests)
    onSelectionChange(result.selectedIds)
    onRemovedChange(result.removedIds)
    toast.success("Badanie dodano do koszyka dodatkowo płatnych.")
  }
  const budgetPercentage = Math.min((allocation.employerTotal / employerBudget) * 100, 100)

  const handleMoveToAdditional = (testId: number) => {
    onSelectionChange(selectedIds.filter(id => id !== testId))
  }

  const handleRemoveTest = (testId: number) => {
    onRemovedChange([...removedIds, testId])
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Budget Status Card */}
        <Card className={cn(
          "border-2 transition-colors",
          allocation.isWithinBudget ? "border-green-500/50 bg-green-50/50" : "border-destructive/50 bg-destructive/5"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pakiet pracodawcy</CardTitle>
              {allocation.isWithinBudget ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">W budżecie</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">Przekroczono</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {allocation.isWithinBudget
                  ? "Wybrane badania mieszczą się w pakiecie finansowanym przez pracodawcę."
                  : "Wybrane badania przekraczają pakiet pracodawcy."}
              </p>
              <Progress
                value={budgetPercentage}
                className={cn(
                  "h-3",
                  allocation.isWithinBudget ? "[&>div]:bg-green-500" : "[&>div]:bg-destructive"
                )}
              />
              {!allocation.isWithinBudget && (
                <p className="text-sm text-destructive">
                  Przenieś część badań do koszyka dodatkowo płatnych, aby zmieścić się w pakiecie pracodawcy.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Employer Funded Tests */}
        {allocation.employerFunded.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Badania finansowane przez pracodawcę
              </CardTitle>
              <CardDescription>
                Badania pokryte z pakietu benefitów Twojej firmy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allocation.employerFunded.map((test) => (
                  <div
                    key={test.id}
                    className="flex flex-col gap-3 rounded-lg border border-primary bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-medium">{test.nazwa}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>{test.opis}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => handleMoveToAdditional(test.id)}
                    >
                      Przenieś do badań dodatkowo płatnych
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Paid Tests */}
        {allocation.additionalPaid.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-muted-foreground" />
                Badania dodatkowe (płatne w placówce)
              </CardTitle>
              <CardDescription>
                Te badania wykonasz prywatnie ze zniżką 30%. Usuń badanie z listy, jeśli nie chcesz go wykonywać.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allocation.additionalPaid.map((test) => {
                  const discountedPrice = test.cena_rynk * 0.70
                  return (
                    <div
                      key={test.id}
                      className="flex flex-col gap-3 rounded-lg border border-input p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-medium">{test.nazwa}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p>{test.opis}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground line-through">
                            {test.cena_rynk.toFixed(2)} PLN
                          </span>
                          <span className="ml-2 text-sm font-medium text-primary">
                            {discountedPrice.toFixed(2)} PLN
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveTest(test.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Usuń z listy
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm">
                  <span>Do zapłaty w placówce:</span>
                  <span className="font-semibold">{allocation.additionalTotal.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Twoja oszczędność:</span>
                  <span className="font-semibold">{allocation.additionalSavings.toFixed(2)} PLN</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <TestSearchPicker
          activeTestIds={activeTestIds}
          onAddToEmployer={handleAddToEmployer}
          onAddToAdditional={handleAddToAdditional}
        />

        {/* Summary & PDF Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Podsumowanie</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Badania pracodawcy ({allocation.employerFunded.length}):</span>
                  <span className="font-medium text-green-600">Opłacone przez pracodawcę</span>
                </div>
                {allocation.additionalPaid.length > 0 && (
                  <div className="flex justify-between">
                    <span>Badania dodatkowe ({allocation.additionalPaid.length}):</span>
                    <span className="font-medium">{allocation.additionalTotal.toFixed(2)} PLN</span>
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => void onSubmit()}
                disabled={!allocation.isWithinBudget || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wysyłanie zapotrzebowania...
                  </>
                ) : allocation.isWithinBudget ? (
                  "Wyślij zapotrzebowanie"
                ) : (
                  "Dostosuj pakiet, aby zatwierdzić"
                )}
              </Button>

              {!allocation.isWithinBudget && !isSubmitting && (
                <p className="text-xs text-center text-muted-foreground">
                  Przenieś część badań do koszyka dodatkowo płatnych, aby zmieścić się w pakiecie
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
