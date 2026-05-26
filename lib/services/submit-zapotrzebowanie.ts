import type { QuestionnaireAnswers } from "@/lib/data/types"
import type { LabTest } from "@/lib/data/lab-tests"
import { supabase } from "@/src/lib/supabaseClient"
import { calculateBudgetAllocation } from "./recommendation-engine"

export interface BadanieSnapshot {
  id: number
  nazwa: string
}

export interface ZapotrzebowanieInsert {
  anonimowe_id: string
  slug_firmy: string
  odpowiedzi_ankiety: QuestionnaireAnswers
  badania_pracodawcy: BadanieSnapshot[]
  badania_prywatne: BadanieSnapshot[]
  status: "oczekujące"
}

const ANON_ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generateAnonymousId(): string {
  let suffix = ""
  for (let i = 0; i < 6; i++) {
    suffix += ANON_ID_CHARS[Math.floor(Math.random() * ANON_ID_CHARS.length)]
  }
  return `EMP-${suffix}`
}

function toBadanieSnapshots(tests: LabTest[]): BadanieSnapshot[] {
  return tests.map((test) => ({ id: test.id, nazwa: test.nazwa }))
}

export function buildZapotrzebowaniePayload(
  anonimoweId: string,
  slugFirmy: string,
  answers: QuestionnaireAnswers,
  tests: LabTest[],
  selectedIds: number[],
  removedIds: number[]
): ZapotrzebowanieInsert {
  const allocation = calculateBudgetAllocation(
    tests,
    Infinity,
    selectedIds,
    removedIds
  )

  return {
    anonimowe_id: anonimoweId,
    slug_firmy: slugFirmy || "",
    odpowiedzi_ankiety: answers,
    badania_pracodawcy: toBadanieSnapshots(allocation.employerFunded),
    badania_prywatne: toBadanieSnapshots(allocation.additionalPaid),
    status: "oczekujące",
  }
}

export async function submitZapotrzebowanie(
  payload: ZapotrzebowanieInsert
): Promise<{ success: true } | { success: false; message: string }> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      success: false,
      message: "Brak konfiguracji Supabase. Uzupełnij plik .env.local.",
    }
  }

  const { error } = await supabase
    .from("zapotrzebowania_pracownikow")
    .insert([payload])

  if (error) {
    return {
      success: false,
      message: error.message || "Nie udało się zapisać zapotrzebowania.",
    }
  }

  return { success: true }
}
