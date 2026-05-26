import { QuestionnaireWizard } from "@/components/questionnaire/questionnaire-wizard"
import { Toaster } from "@/components/ui/sonner"

export default function QuestionnairePage() {
  return (
    <>
      <QuestionnaireWizard />
      <Toaster position="top-right" />
    </>
  )
}
