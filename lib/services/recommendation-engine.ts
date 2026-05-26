import type { QuestionnaireAnswers } from "@/lib/data/types"
import { getLabTestsByIds, type LabTest } from "@/lib/data/lab-tests"

export interface RecommendationResult {
  tests: LabTest[]
  totalInternalCost: number
  reasoning: string[]
}

export function generateRecommendations(answers: QuestionnaireAnswers): RecommendationResult {
  const recommendedIds = new Set<number>()
  const reasoning: string[] = []

  // ALWAYS add base tests: Morfologia (8), Lipidogram (11), Kreatynina (25)
  recommendedIds.add(8)
  recommendedIds.add(11)
  recommendedIds.add(25)
  reasoning.push("Podstawowe badania profilaktyczne: Morfologia, Lipidogram, Kreatynina")

  // Gender + Age specific
  if (answers.plec === "mezczyzna" && (answers.wiek === "40-50" || answers.wiek === ">50")) {
    recommendedIds.add(64) // PSA
    reasoning.push("Mężczyzna 40+: PSA (profilaktyka prostaty)")
  }

  if (answers.plec === "kobieta" && (answers.wiek === "40-50" || answers.wiek === ">50")) {
    recommendedIds.add(28) // Wapń
    reasoning.push("Kobieta 40+: Wapń całkowity (profilaktyka osteoporozy)")
  }

  // Work type
  if (answers.praca === "siedzaca") {
    recommendedIds.add(9) // D-dimer
    reasoning.push("Praca siedząca: D-dimer (ryzyko zakrzepów)")
  }

  // Diet
  if (answers.dieta === "wegetarianska") {
    recommendedIds.add(52) // B12
    recommendedIds.add(51) // Ferrytyna
    recommendedIds.add(29) // Żelazo
    reasoning.push("Dieta wegetariańska: Witamina B12, Ferrytyna, Żelazo")
  }

  if (answers.dieta === "przetworzona") {
    recommendedIds.add(12) // Próby wątrobowe
    recommendedIds.add(26) // Kwas moczowy
    reasoning.push("Dieta przetworzona: Próby wątrobowe, Kwas moczowy")
  }

  // Family history
  if (answers.rodzina.tarczyca) {
    recommendedIds.add(43) // TSH
    recommendedIds.add(44) // fT3
    recommendedIds.add(45) // fT4
    recommendedIds.add(46) // anty-TPO
    reasoning.push("Historia tarczycy w rodzinie: Pełny profil tarczycowy")
  }

  if (answers.rodzina.cukrzyca) {
    recommendedIds.add(39) // HbA1c
    reasoning.push("Historia cukrzycy w rodzinie: Hemoglobina glikowana")
  }

  // Symptoms
  if (answers.objawy.zmeczenie) {
    recommendedIds.add(54) // D3
    recommendedIds.add(43) // TSH
    recommendedIds.add(51) // Ferrytyna
    reasoning.push("Zmęczenie: Witamina D3, TSH, Ferrytyna")
  }

  if (answers.objawy.skurcze) {
    recommendedIds.add(30) // Magnez
    recommendedIds.add(10) // Sód
    reasoning.push("Skurcze mięśni: Magnez, Sód")
  }

  if (answers.objawy.boleBrzucha) {
    recommendedIds.add(21) // Lipaza
    recommendedIds.add(78) // CRP
    reasoning.push("Bóle brzucha: Lipaza, CRP")
  }

  if (answers.objawy.ukaszeniKleszcza) {
    recommendedIds.add(81) // Borelioza
    reasoning.push("Ukąszenie kleszcza: Borelioza IgG")
  }

  if (answers.objawy.alergie) {
    recommendedIds.add(84) // IgE
    reasoning.push("Alergie: IgE całkowite")
  }

  if (answers.plec === "mezczyzna" && answers.objawy.spadekLibido) {
    recommendedIds.add(59) // Testosteron
    reasoning.push("Spadek libido (mężczyzna): Testosteron całkowity")
  }

  // Get full test objects
  const tests = getLabTestsByIds(Array.from(recommendedIds))
  const totalInternalCost = tests.reduce((sum, test) => sum + test.cena_wew, 0)

  return {
    tests,
    totalInternalCost,
    reasoning
  }
}

export function calculateBudgetAllocation(
  tests: LabTest[],
  employerBudget: number,
  selectedIds: number[],
  removedIds: number[] = []
): {
  employerFunded: LabTest[]
  employerTotal: number
  additionalPaid: LabTest[]
  additionalTotal: number
  additionalSavings: number
  isWithinBudget: boolean
} {
  const activeTests = tests.filter(t => !removedIds.includes(t.id))
  const employerFunded = activeTests.filter(t => selectedIds.includes(t.id))
  const additionalPaid = activeTests.filter(t => !selectedIds.includes(t.id))

  const employerTotal = employerFunded.reduce((sum, t) => sum + t.cena_wew, 0)
  
  // Additional tests use market price with 30% discount
  const discountMultiplier = 0.70
  const additionalTotal = additionalPaid.reduce((sum, t) => sum + (t.cena_rynk * discountMultiplier), 0)
  const additionalFullPrice = additionalPaid.reduce((sum, t) => sum + t.cena_rynk, 0)
  const additionalSavings = additionalFullPrice - additionalTotal

  return {
    employerFunded,
    employerTotal,
    additionalPaid,
    additionalTotal,
    additionalSavings,
    isWithinBudget: employerTotal <= employerBudget
  }
}

/**
 * Gdy pakiet jest przekroczony, sugeruje badania do przeniesienia do koszyka płatnego
 * (zestaw minimalizujący liczbę sugestii przy pokryciu nadwyżki budżetu).
 */
export function suggestTestsToMoveForBudget(
  employerFunded: LabTest[],
  employerBudget: number,
  employerTotal: number
): LabTest[] {
  if (employerTotal <= employerBudget || employerFunded.length === 0) {
    return []
  }

  const overflow = employerTotal - employerBudget
  const sortedByCost = [...employerFunded].sort((a, b) => b.cena_wew - a.cena_wew)

  const suggestions: LabTest[] = []
  let freedCost = 0

  for (const test of sortedByCost) {
    if (freedCost >= overflow) break
    suggestions.push(test)
    freedCost += test.cena_wew
  }

  return suggestions
}

function ensureTestInList(tests: LabTest[], test: LabTest): LabTest[] {
  if (tests.some(t => t.id === test.id)) return tests
  return [...tests, test]
}

export function tryAddToEmployerPackage(
  tests: LabTest[],
  employerBudget: number,
  selectedIds: number[],
  removedIds: number[],
  test: LabTest
): {
  tests: LabTest[]
  selectedIds: number[]
  removedIds: number[]
  placedIn: "employer" | "additional"
} {
  const nextTests = ensureTestInList(tests, test)
  const nextRemoved = removedIds.filter(id => id !== test.id)
  const nextSelected = selectedIds.includes(test.id)
    ? selectedIds
    : [...selectedIds, test.id]

  const allocation = calculateBudgetAllocation(
    nextTests,
    employerBudget,
    nextSelected,
    nextRemoved
  )

  if (allocation.isWithinBudget) {
    return {
      tests: nextTests,
      selectedIds: nextSelected,
      removedIds: nextRemoved,
      placedIn: "employer",
    }
  }

  return {
    tests: nextTests,
    selectedIds: selectedIds.filter(id => id !== test.id),
    removedIds: nextRemoved,
    placedIn: "additional",
  }
}

export function addToAdditionalPaid(
  tests: LabTest[],
  selectedIds: number[],
  removedIds: number[],
  test: LabTest
): {
  tests: LabTest[]
  selectedIds: number[]
  removedIds: number[]
} {
  return {
    tests: ensureTestInList(tests, test),
    selectedIds: selectedIds.filter(id => id !== test.id),
    removedIds: removedIds.filter(id => id !== test.id),
  }
}
