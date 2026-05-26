import { DashboardStats } from "@/components/admin/dashboard-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Witaj w panelu administracyjnym MedScreen
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Szybki start</CardTitle>
            <CardDescription>
              Rozpocznij konfigurację systemu badań profilaktycznych
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Dodaj firmę</p>
                <p className="text-sm text-muted-foreground">
                  Przejdź do zakładki &quot;Firmy&quot; i dodaj dane klienta wraz z budżetem na badania.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Skopiuj link</p>
                <p className="text-sm text-muted-foreground">
                  System wygeneruje unikalny link do ankiety dla pracowników danej firmy.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Przekaż do działu HR</p>
                <p className="text-sm text-muted-foreground">
                  Dział HR rozsyła link do pracowników, którzy wypełniają ankietę zdrowotną.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jak działa system?</CardTitle>
            <CardDescription>
              Algorytm doboru badań laboratoryjnych
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Pracownik wypełnia ankietę zdrowotną zawierającą pytania o wiek, płeć, styl życia, historię rodzinną oraz aktualne objawy.
            </p>
            <p>
              Na podstawie odpowiedzi algorytm rekomenduje zestaw badań laboratoryjnych dopasowany do profilu zdrowotnego pracownika.
            </p>
            <p>
              Badania są automatycznie rozdzielane między te finansowane przez pracodawcę (w ramach budżetu) oraz dodatkowe ze zniżką 30%.
            </p>
            <p>
              Pracownik może samodzielnie dostosować zestaw badań i pobrać skierowanie w formacie PDF.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
