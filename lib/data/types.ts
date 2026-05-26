export interface Company {
  id: string
  nazwa: string
  adres: string
  nip: string
  budzet: number
  slug: string
  createdAt: Date
}

export interface QuestionnaireAnswers {
  // Step 1: Demographics & Work
  plec: "mezczyzna" | "kobieta" | null
  wiek: "<30" | "30-39" | "40-50" | ">50" | null
  praca: "siedzaca" | "fizyczna" | null
  
  // Step 2: Lifestyle & Family
  dieta: "standardowa" | "wegetarianska" | "przetworzona" | null
  rodzina: {
    cukrzyca: boolean
    tarczyca: boolean
    zawal: boolean
  }
  
  // Step 3: Symptoms
  objawy: {
    zmeczenie: boolean
    wypadanieWlosow: boolean
    skurcze: boolean
    boleBrzucha: boolean
    ukaszeniKleszcza: boolean
    alergie: boolean
    spadekLibido: boolean
    zaburzeniaCyklu: boolean
  }
}

export interface QuestionnaireSubmission {
  id: string
  companyId: string
  answers: QuestionnaireAnswers
  recommendedTestIds: number[]
  employerFundedTestIds: number[]
  additionalTestIds: number[]
  createdAt: Date
}

export const initialAnswers: QuestionnaireAnswers = {
  plec: null,
  wiek: null,
  praca: null,
  dieta: null,
  rodzina: {
    cukrzyca: false,
    tarczyca: false,
    zawal: false
  },
  objawy: {
    zmeczenie: false,
    wypadanieWlosow: false,
    skurcze: false,
    boleBrzucha: false,
    ukaszeniKleszcza: false,
    alergie: false,
    spadekLibido: false,
    zaburzeniaCyklu: false
  }
}
