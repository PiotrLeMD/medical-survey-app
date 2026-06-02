/**
 * Warstwa danych aplikacji.
 * Firmy: Supabase (tabela `companies`).
 * Zgłoszenia ankiet: nadal mock (do migracji w przyszłości).
 */

import type { Company, QuestionnaireSubmission } from "@/lib/data/types"
import { supabase } from "@/src/lib/supabaseClient"
import slugify from "slugify"

type CompanyRow = {
  id: string
  nazwa: string
  adres: string
  nip: string
  budzet: number | string
  slug: string
  created_at: string
}

let submissions: QuestionnaireSubmission[] = []

function mapCompanyRow(row: CompanyRow): Company {
  return {
    id: row.id,
    nazwa: row.nazwa,
    adres: row.adres,
    nip: row.nip,
    budzet:
      typeof row.budzet === "number" ? row.budzet : parseFloat(String(row.budzet)),
    slug: row.slug,
    createdAt: new Date(row.created_at),
  }
}

function assertSupabaseConfigured(): void {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error(
      "Brak konfiguracji Supabase. Uzupełnij NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY w .env.local."
    )
  }
}

async function fetchExistingSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("companies").select("slug")

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => row.slug)
}

async function generateUniqueSlug(name: string): Promise<string> {
  const existingSlugs = await fetchExistingSlugs()
  const baseSlug = slugify(name, { lower: true, strict: true })

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }

  let counter = 1
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++
  }
  return `${baseSlug}-${counter}`
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// ============================================
// COMPANY OPERATIONS (Supabase)
// ============================================

export async function getCompanies(): Promise<Company[]> {
  assertSupabaseConfigured()

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data as CompanyRow[]).map(mapCompanyRow)
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  assertSupabaseConfigured()

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? mapCompanyRow(data as CompanyRow) : null
}

export async function getCompanyById(id: string): Promise<Company | null> {
  assertSupabaseConfigured()

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? mapCompanyRow(data as CompanyRow) : null
}

export async function createCompany(
  data: Omit<Company, "id" | "slug" | "createdAt">
): Promise<Company> {
  assertSupabaseConfigured()

  const slug = await generateUniqueSlug(data.nazwa)

  const { data: row, error } = await supabase
    .from("companies")
    .insert({
      nazwa: data.nazwa,
      adres: data.adres,
      nip: data.nip,
      budzet: data.budzet,
      slug,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapCompanyRow(row as CompanyRow)
}

export async function updateCompany(
  id: string,
  data: Partial<Omit<Company, "id" | "slug" | "createdAt">>
): Promise<Company | null> {
  assertSupabaseConfigured()

  const { data: row, error } = await supabase
    .from("companies")
    .update(data)
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return row ? mapCompanyRow(row as CompanyRow) : null
}

export async function deleteCompany(id: string): Promise<boolean> {
  assertSupabaseConfigured()

  const { error } = await supabase.from("companies").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

// ============================================
// QUESTIONNAIRE SUBMISSION OPERATIONS (mock)
// ============================================

export async function createSubmission(
  data: Omit<QuestionnaireSubmission, "id" | "createdAt">
): Promise<QuestionnaireSubmission> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const newSubmission: QuestionnaireSubmission = {
    ...data,
    id: generateId(),
    createdAt: new Date(),
  }

  submissions.push(newSubmission)
  return newSubmission
}

export async function getSubmissionsByCompany(
  companyId: string
): Promise<QuestionnaireSubmission[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return submissions
    .filter((s) => s.companyId === companyId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getSubmissionStats(
  companyId: string
): Promise<{ total: number; thisMonth: number }> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const companySubmissions = submissions.filter((s) => s.companyId === companyId)
  const now = new Date()
  const thisMonth = companySubmissions.filter((s) => {
    const submissionDate = new Date(s.createdAt)
    return (
      submissionDate.getMonth() === now.getMonth() &&
      submissionDate.getFullYear() === now.getFullYear()
    )
  })

  return {
    total: companySubmissions.length,
    thisMonth: thisMonth.length,
  }
}
