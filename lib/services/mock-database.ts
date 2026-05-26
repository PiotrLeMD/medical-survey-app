/**
 * Mock Database Service
 * 
 * This service simulates Supabase database operations.
 * Replace the implementations with real Supabase calls when ready.
 * 
 * Example Supabase replacement:
 * import { createClient } from '@supabase/supabase-js'
 * const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
 */

import type { Company, QuestionnaireSubmission } from "@/lib/data/types"
import slugify from "slugify"

// In-memory storage (simulates database tables)
let companies: Company[] = [
  {
    id: "1",
    nazwa: "TechCorp Polska",
    adres: "ul. Innowacyjna 15, 00-001 Warszawa",
    nip: "1234567890",
    budzet: 75.00,
    slug: "techcorp-polska",
    createdAt: new Date("2024-01-15")
  },
  {
    id: "2",
    nazwa: "Zdrowa Firma Sp. z o.o.",
    adres: "ul. Biznesowa 42, 31-000 Kraków",
    nip: "9876543210",
    budzet: 50.00,
    slug: "zdrowa-firma",
    createdAt: new Date("2024-02-20")
  }
]

let submissions: QuestionnaireSubmission[] = []

// Helper to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Helper to generate unique slug
function generateSlug(name: string): string {
  const baseSlug = slugify(name, { lower: true, strict: true })
  const existingSlugs = companies.map(c => c.slug)
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }
  
  let counter = 1
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++
  }
  return `${baseSlug}-${counter}`
}

// ============================================
// COMPANY OPERATIONS
// ============================================

export async function getCompanies(): Promise<Company[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Supabase equivalent:
  // const { data, error } = await supabase.from('companies').select('*').order('createdAt', { ascending: false })
  // if (error) throw error
  // return data
  
  return [...companies].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Supabase equivalent:
  // const { data, error } = await supabase.from('companies').select('*').eq('slug', slug).single()
  // if (error) return null
  // return data
  
  return companies.find(c => c.slug === slug) || null
}

export async function getCompanyById(id: string): Promise<Company | null> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Supabase equivalent:
  // const { data, error } = await supabase.from('companies').select('*').eq('id', id).single()
  // if (error) return null
  // return data
  
  return companies.find(c => c.id === id) || null
}

export async function createCompany(data: Omit<Company, "id" | "slug" | "createdAt">): Promise<Company> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const newCompany: Company = {
    ...data,
    id: generateId(),
    slug: generateSlug(data.nazwa),
    createdAt: new Date()
  }
  
  companies.push(newCompany)
  
  // Supabase equivalent:
  // const { data: company, error } = await supabase.from('companies').insert(newCompany).select().single()
  // if (error) throw error
  // return company
  
  return newCompany
}

export async function updateCompany(id: string, data: Partial<Omit<Company, "id" | "slug" | "createdAt">>): Promise<Company | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = companies.findIndex(c => c.id === id)
  if (index === -1) return null
  
  companies[index] = { ...companies[index], ...data }
  
  // Supabase equivalent:
  // const { data: company, error } = await supabase.from('companies').update(data).eq('id', id).select().single()
  // if (error) throw error
  // return company
  
  return companies[index]
}

export async function deleteCompany(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = companies.findIndex(c => c.id === id)
  if (index === -1) return false
  
  companies.splice(index, 1)
  
  // Supabase equivalent:
  // const { error } = await supabase.from('companies').delete().eq('id', id)
  // if (error) throw error
  // return true
  
  return true
}

// ============================================
// QUESTIONNAIRE SUBMISSION OPERATIONS
// ============================================

export async function createSubmission(data: Omit<QuestionnaireSubmission, "id" | "createdAt">): Promise<QuestionnaireSubmission> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const newSubmission: QuestionnaireSubmission = {
    ...data,
    id: generateId(),
    createdAt: new Date()
  }
  
  submissions.push(newSubmission)
  
  // Supabase equivalent:
  // const { data: submission, error } = await supabase.from('submissions').insert(newSubmission).select().single()
  // if (error) throw error
  // return submission
  
  return newSubmission
}

export async function getSubmissionsByCompany(companyId: string): Promise<QuestionnaireSubmission[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Supabase equivalent:
  // const { data, error } = await supabase.from('submissions').select('*').eq('companyId', companyId).order('createdAt', { ascending: false })
  // if (error) throw error
  // return data
  
  return submissions
    .filter(s => s.companyId === companyId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getSubmissionStats(companyId: string): Promise<{ total: number; thisMonth: number }> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const companySubmissions = submissions.filter(s => s.companyId === companyId)
  const now = new Date()
  const thisMonth = companySubmissions.filter(s => {
    const submissionDate = new Date(s.createdAt)
    return submissionDate.getMonth() === now.getMonth() && 
           submissionDate.getFullYear() === now.getFullYear()
  })
  
  return {
    total: companySubmissions.length,
    thisMonth: thisMonth.length
  }
}
