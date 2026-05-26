"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { QuestionnaireAnswers } from "@/lib/data/types"

interface Step1Props {
  answers: QuestionnaireAnswers
  onChange: (updates: Partial<QuestionnaireAnswers>) => void
}

export function Step1Demographics({ answers, onChange }: Step1Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Płeć</h3>
        <RadioGroup
          value={answers.plec || ""}
          onValueChange={(value) => onChange({ plec: value as "mezczyzna" | "kobieta" })}
          className="grid grid-cols-2 gap-4"
        >
          <Label
            htmlFor="mezczyzna"
            className="flex items-center gap-3 rounded-lg border border-input p-4 cursor-pointer hover:bg-accent transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <RadioGroupItem value="mezczyzna" id="mezczyzna" />
            <span>Mężczyzna</span>
          </Label>
          <Label
            htmlFor="kobieta"
            className="flex items-center gap-3 rounded-lg border border-input p-4 cursor-pointer hover:bg-accent transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <RadioGroupItem value="kobieta" id="kobieta" />
            <span>Kobieta</span>
          </Label>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Wiek</h3>
        <RadioGroup
          value={answers.wiek || ""}
          onValueChange={(value) => onChange({ wiek: value as QuestionnaireAnswers["wiek"] })}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { value: "<30", label: "Poniżej 30 lat" },
            { value: "30-39", label: "30-39 lat" },
            { value: "40-50", label: "40-50 lat" },
            { value: ">50", label: "Powyżej 50 lat" },
          ].map((option) => (
            <Label
              key={option.value}
              htmlFor={`wiek-${option.value}`}
              className="flex items-center gap-3 rounded-lg border border-input p-4 cursor-pointer hover:bg-accent transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <RadioGroupItem value={option.value} id={`wiek-${option.value}`} />
              <span className="text-sm">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Charakter pracy</h3>
        <RadioGroup
          value={answers.praca || ""}
          onValueChange={(value) => onChange({ praca: value as "siedzaca" | "fizyczna" })}
          className="grid grid-cols-2 gap-4"
        >
          <Label
            htmlFor="siedzaca"
            className="flex flex-col gap-1 rounded-lg border border-input p-4 cursor-pointer hover:bg-accent transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="siedzaca" id="siedzaca" />
              <span className="font-medium">Siedząca</span>
            </div>
            <span className="text-sm text-muted-foreground ml-7">
              Praca biurowa, zdalna, przy komputerze
            </span>
          </Label>
          <Label
            htmlFor="fizyczna"
            className="flex flex-col gap-1 rounded-lg border border-input p-4 cursor-pointer hover:bg-accent transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="fizyczna" id="fizyczna" />
              <span className="font-medium">Fizyczna</span>
            </div>
            <span className="text-sm text-muted-foreground ml-7">
              Praca w ruchu, wymagająca wysiłku
            </span>
          </Label>
        </RadioGroup>
      </div>
    </div>
  )
}
