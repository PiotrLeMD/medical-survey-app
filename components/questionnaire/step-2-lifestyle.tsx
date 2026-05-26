"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { QuestionnaireAnswers } from "@/lib/data/types"

interface Step2Props {
  answers: QuestionnaireAnswers
  onChange: (updates: Partial<QuestionnaireAnswers>) => void
}

export function Step2Lifestyle({ answers, onChange }: Step2Props) {
  const handleFamilyChange = (key: keyof QuestionnaireAnswers["rodzina"], checked: boolean) => {
    onChange({
      rodzina: {
        ...answers.rodzina,
        [key]: checked
      }
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Dieta</h3>
        <RadioGroup
          value={answers.dieta || ""}
          onValueChange={(value) => onChange({ dieta: value as QuestionnaireAnswers["dieta"] })}
          className="grid gap-4"
        >
          {[
            { 
              value: "standardowa", 
              label: "Standardowa", 
              description: "Zróżnicowana dieta zawierająca mięso, ryby, nabiał"
            },
            { 
              value: "wegetarianska", 
              label: "Wegetariańska / Wegańska", 
              description: "Dieta wykluczająca mięso lub wszystkie produkty odzwierzęce"
            },
            { 
              value: "przetworzona", 
              label: "Przetworzona", 
              description: "Dieta bogata w fast food, słodycze, napoje gazowane"
            },
          ].map((option) => (
            <Label
              key={option.value}
              htmlFor={`dieta-${option.value}`}
              className="flex flex-col gap-1 rounded-lg border border-input p-4 cursor-pointer hover:bg-accent transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={option.value} id={`dieta-${option.value}`} />
                <span className="font-medium">{option.label}</span>
              </div>
              <span className="text-sm text-muted-foreground ml-7">
                {option.description}
              </span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Historia chorób w rodzinie</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Zaznacz, jeśli ktoś z bliskiej rodziny (rodzice, rodzeństwo) choruje lub chorował na:
        </p>
        <div className="grid gap-3">
          {[
            { key: "cukrzyca" as const, label: "Cukrzyca" },
            { key: "tarczyca" as const, label: "Choroby tarczycy (Hashimoto, niedoczynność, nadczynność)" },
            { key: "zawal" as const, label: "Zawał serca lub udar mózgu przed 60. rokiem życia" },
          ].map((option) => (
            <Label
              key={option.key}
              htmlFor={`rodzina-${option.key}`}
              className="flex items-center gap-3 rounded-lg border border-input p-4 cursor-pointer hover:bg-accent transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <Checkbox
                id={`rodzina-${option.key}`}
                checked={answers.rodzina[option.key]}
                onCheckedChange={(checked) => handleFamilyChange(option.key, checked as boolean)}
              />
              <span>{option.label}</span>
            </Label>
          ))}
        </div>
      </div>
    </div>
  )
}
