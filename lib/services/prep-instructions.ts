import type { LabTest } from "@/lib/data/lab-tests"

const INSTRUCTION_ALWAYS =
  "Pół godziny przed pobraniem wypij szklankę niegazowanej wody. Przed samym wejściem do gabinetu usiądź i odpocznij w poczekalni przez 10–15 minut."

const INSTRUCTION_FASTING =
  "Bądź na czczo. Ostatni posiłek zjedz od 8 do 12 godzin przed pobraniem krwi."

const INSTRUCTION_THYROID =
  "Jeśli na stałe przyjmujesz leki na tarczycę (np. Euthyrox, Letrox), pobierz krew PRZED poranną dawką. Lek weź ze sobą i zażyj dopiero po badaniu."

const INSTRUCTION_HORMONES_MORNING =
  "Badanie wykonaj koniecznie w godzinach porannych (najlepiej między 7:00 a 9:00), po dobrze przespanej nocy i unikając stresu."

const INSTRUCTION_PSA =
  "Na 48 godzin przed badaniem bezwzględnie unikaj intensywnego wysiłku fizycznego, jazdy na rowerze oraz stosunków seksualnych."

const INSTRUCTION_LIVER_ALCOHOL =
  "Na 24 godziny przed pobraniem krwi całkowicie zrezygnuj ze spożywania alkoholu oraz tłustych, ciężkostrawnych posiłków."

function normalizeName(nazwa: string): string {
  return nazwa
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
}

function matchesAny(nazwa: string, terms: string[]): boolean {
  const normalized = normalizeName(nazwa)
  return terms.some((term) => normalized.includes(normalizeName(term)))
}

function hasAnyTest(tests: LabTest[], terms: string[]): boolean {
  return tests.some((test) => matchesAny(test.nazwa, terms))
}

export function generatePrepInstructions(selectedTests: LabTest[]): string[] {
  const seen = new Set<string>()
  const instructions: string[] = []

  const add = (text: string) => {
    if (!seen.has(text)) {
      seen.add(text)
      instructions.push(text)
    }
  }

  add(INSTRUCTION_ALWAYS)

  if (
    hasAnyTest(selectedTests, [
      "Morfologia",
      "Lipidogram",
      "Żelazo",
      "Kwas moczowy",
      "Glukoza",
    ])
  ) {
    add(INSTRUCTION_FASTING)
  }

  if (hasAnyTest(selectedTests, ["TSH", "fT3", "fT4"])) {
    add(INSTRUCTION_THYROID)
  }

  if (hasAnyTest(selectedTests, ["Testosteron", "Kortyzol"])) {
    add(INSTRUCTION_HORMONES_MORNING)
  }

  if (hasAnyTest(selectedTests, ["PSA"])) {
    add(INSTRUCTION_PSA)
  }

  if (
    hasAnyTest(selectedTests, [
      "Próby wątrobowe",
      "AST",
      "ALT",
      "Lipidogram",
    ])
  ) {
    add(INSTRUCTION_LIVER_ALCOHOL)
  }

  return instructions
}
