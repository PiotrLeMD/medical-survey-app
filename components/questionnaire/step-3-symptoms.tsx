"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { QuestionnaireAnswers } from "@/lib/data/types"

interface Step3Props {
  answers: QuestionnaireAnswers
  onChange: (updates: Partial<QuestionnaireAnswers>) => void
}

export function Step3Symptoms({ answers, onChange }: Step3Props) {
  const handleSymptomChange = (key: keyof QuestionnaireAnswers["objawy"], checked: boolean) => {
    onChange({
      objawy: {
        ...answers.objawy,
        [key]: checked
      }
    })
  }

  const commonSymptoms = [
    { key: "zmeczenie" as const, label: "Przewlekłe zmęczenie", description: "Uczucie ciągłego braku energii mimo odpoczynku" },
    { key: "wypadanieWlosow" as const, label: "Wypadanie włosów", description: "Nadmierna utrata włosów podczas mycia lub czesania" },
    { key: "skurcze" as const, label: "Skurcze mięśni", description: "Bolesne skurcze nóg, szczególnie w nocy" },
    { key: "boleBrzucha" as const, label: "Bóle brzucha", description: "Nawracające dolegliwości trawienne" },
    { key: "ukaszeniKleszcza" as const, label: "Ukąszenie kleszcza", description: "W ciągu ostatnich 12 miesięcy" },
    { key: "alergie" as const, label: "Alergie", description: "Objawy alergiczne: katar, wysypka, świąd" },
  ]

  const genderSpecificSymptoms = answers.plec === "mezczyzna" 
    ? [{ key: "spadekLibido" as const, label: "Spadek libido", description: "Obniżony popęd płciowy" }]
    : answers.plec === "kobieta"
    ? [{ key: "zaburzeniaCyklu" as const, label: "Zaburzenia cyklu menstruacyjnego", description: "Nieregularne miesiączki, bolesne miesiączkowanie" }]
    : []

  const allSymptoms = [...commonSymptoms, ...genderSpecificSymptoms]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Objawy</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Zaznacz objawy, które występują u Ciebie regularnie w ostatnich miesiącach:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {allSymptoms.map((symptom) => (
            <Label
              key={symptom.key}
              htmlFor={`objawy-${symptom.key}`}
              className="flex flex-col gap-1 rounded-lg border border-input p-4 cursor-pointer hover:bg-accent transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`objawy-${symptom.key}`}
                  checked={answers.objawy[symptom.key]}
                  onCheckedChange={(checked) => handleSymptomChange(symptom.key, checked as boolean)}
                />
                <span className="font-medium">{symptom.label}</span>
              </div>
              <span className="text-sm text-muted-foreground ml-7">
                {symptom.description}
              </span>
            </Label>
          ))}
        </div>
      </div>

      {!answers.plec && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
          Wróć do kroku 1, aby wybrać płeć i zobaczyć dodatkowe opcje objawów.
        </p>
      )}
    </div>
  )
}
