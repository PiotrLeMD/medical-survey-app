import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ustawienia</h1>
        <p className="text-muted-foreground">
          Konfiguracja systemu i integracji
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Baza danych</CardTitle>
                <CardDescription>
                  Status połączenia z bazą danych
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Mock
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aplikacja aktualnie używa symulowanej bazy danych w pamięci. 
              Aby podłączyć prawdziwą bazę Supabase, skonfiguruj zmienne środowiskowe
              i odkomentuj odpowiednie sekcje w pliku <code className="rounded bg-muted px-1 py-0.5">lib/services/mock-database.ts</code>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generowanie PDF</CardTitle>
                <CardDescription>
                  Konfiguracja skierowań na badania
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Aktywne
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Generowanie skierowań PDF jest aktywne. Pracownicy mogą pobierać 
              spersonalizowane skierowania po wypełnieniu ankiety i zatwierdzeniu zestawu badań.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Algorytm rekomendacji</CardTitle>
            <CardDescription>
              Reguły doboru badań laboratoryjnych
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <p className="font-medium mb-2">Badania podstawowe (zawsze):</p>
              <p className="text-muted-foreground">Morfologia krwi, Lipidogram, Kreatynina</p>
            </div>
            <div className="text-sm">
              <p className="font-medium mb-2">Reguły warunkowe:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Mężczyzna 40+ - PSA całkowity</li>
                <li>Kobieta 40+ - Wapń całkowity</li>
                <li>Praca siedząca - D-dimer</li>
                <li>Dieta wegetariańska - B12, Ferrytyna, Żelazo</li>
                <li>Dieta przetworzona - Próby wątrobowe, Kwas moczowy</li>
                <li>Historia tarczycy - Pełny profil tarczycowy</li>
                <li>Historia cukrzycy - Hemoglobina glikowana</li>
                <li>Objawy: zmęczenie, skurcze, bóle brzucha, itd.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
