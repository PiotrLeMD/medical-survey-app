import Link from "next/link"
import { ArrowRight, Building2, ClipboardList, FileText, Shield } from "lucide-react"
import { AppLogo } from "@/components/app-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <AppLogo subtitle="Platforma badań profilaktycznych" priority />
            <Button asChild>
              <Link href="/admin">
                Panel admina
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Inteligentny dobór badań laboratoryjnych dla Twojej firmy
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-balance">
              MedScreen to platforma B2B, która automatycznie dobiera zestaw badań profilaktycznych 
              na podstawie indywidualnej ankiety zdrowotnej pracownika.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin">
                  Rozpocznij jako administrator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/ankieta/techcorp-polska">
                  Zobacz demo ankiety
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Jak to działa?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Dodaj firmę</CardTitle>
                <CardDescription>
                  Administrator kliniki dodaje firmę klienta i ustala budżet na badania dla każdego pracownika.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Pracownik wypełnia ankietę</CardTitle>
                <CardDescription>
                  Dział HR rozsyła unikalny link. Pracownik odpowiada na pytania o zdrowie, styl życia i objawy.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Automatyczny dobór badań</CardTitle>
                <CardDescription>
                  Algorytm rekomenduje badania dopasowane do profilu. Pracownik pobiera skierowanie PDF.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6">Korzyści dla Twojej kliniki</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Automatyzacja procesu</p>
                    <p className="text-sm text-muted-foreground">
                      Koniec z ręcznym dobieraniem badań - algorytm robi to za Ciebie.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Kontrola budżetu</p>
                    <p className="text-sm text-muted-foreground">
                      Pracodawca płaci tylko do ustalonego limitu, reszta ze zniżką 30%.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Skalowalność</p>
                    <p className="text-sm text-muted-foreground">
                      Obsługuj setki firm i tysiące pracowników z jednego panelu.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-lg font-medium mb-4">Przykładowe firmy w systemie:</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <span className="font-medium">TechCorp Polska</span>
                    <span className="text-sm text-muted-foreground">75,00 PLN/os.</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <span className="font-medium">Zdrowa Firma Sp. z o.o.</span>
                    <span className="text-sm text-muted-foreground">50,00 PLN/os.</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/admin/firmy">
                    Zarządzaj firmami
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">MedScreen</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Platforma B2B do zarządzania badaniami profilaktycznymi
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
