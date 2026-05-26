"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Copy, ExternalLink, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { Company } from "@/lib/data/types"
import { createCompany, deleteCompany, getCompanies } from "@/lib/services/mock-database"

export function CompaniesTable() {
  const [companies, setCompanies] = React.useState<Company[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    nazwa: "",
    adres: "",
    nip: "",
    budzet: "50.00"
  })
  const [submitting, setSubmitting] = React.useState(false)

  const loadCompanies = React.useCallback(async () => {
    try {
      const data = await getCompanies()
      setCompanies(data)
    } catch {
      toast.error("Nie udało się załadować listy firm")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createCompany({
        nazwa: formData.nazwa,
        adres: formData.adres,
        nip: formData.nip,
        budzet: parseFloat(formData.budzet)
      })
      
      toast.success("Firma została dodana pomyślnie")
      setDialogOpen(false)
      setFormData({ nazwa: "", adres: "", nip: "", budzet: "50.00" })
      loadCompanies()
    } catch {
      toast.error("Nie udało się dodać firmy")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/ankieta/${slug}`
    navigator.clipboard.writeText(url)
    toast.success("Link skopiowany do schowka")
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCompany(id)
      toast.success("Firma została usunięta")
      loadCompanies()
    } catch {
      toast.error("Nie udało się usunąć firmy")
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pl-PL", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date(date))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Lista firm</CardTitle>
            <CardDescription>
              Zarządzaj firmami i ich budżetami na badania profilaktyczne
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Dodaj firmę
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Dodaj nową firmę</DialogTitle>
                  <DialogDescription>
                    Wypełnij dane firmy, aby wygenerować unikalny link do ankiety.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nazwa">Nazwa firmy</Label>
                    <Input
                      id="nazwa"
                      placeholder="np. Acme Sp. z o.o."
                      value={formData.nazwa}
                      onChange={(e) => setFormData({ ...formData, nazwa: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="adres">Adres</Label>
                    <Input
                      id="adres"
                      placeholder="ul. Przykładowa 1, 00-001 Warszawa"
                      value={formData.adres}
                      onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nip">NIP</Label>
                    <Input
                      id="nip"
                      placeholder="1234567890"
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      required
                      pattern="[0-9]{10}"
                      title="NIP musi składać się z 10 cyfr"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budzet">Budżet pracodawcy (PLN)</Label>
                    <Input
                      id="budzet"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="50.00"
                      value={formData.budzet}
                      onChange={(e) => setFormData({ ...formData, budzet: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Maksymalna kwota, jaką firma pokrywa za badania pracownika (cena wewnętrzna).
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Anuluj
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Dodawanie..." : "Dodaj firmę"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : companies.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
            <p className="text-muted-foreground">Brak firm w systemie</p>
            <p className="text-sm text-muted-foreground">
              Kliknij &quot;Dodaj firmę&quot;, aby rozpocząć
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa firmy</TableHead>
                  <TableHead className="hidden md:table-cell">NIP</TableHead>
                  <TableHead>Budżet</TableHead>
                  <TableHead className="hidden lg:table-cell">Data dodania</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{company.nazwa}</span>
                        <span className="text-xs text-muted-foreground md:hidden">
                          NIP: {company.nip}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">
                      {company.nip}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {company.budzet.toFixed(2)} PLN
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {formatDate(company.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Otwórz menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCopyLink(company.slug)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Kopiuj link
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a
                              href={`/ankieta/${company.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Otwórz ankietę
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(company.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Usuń
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
