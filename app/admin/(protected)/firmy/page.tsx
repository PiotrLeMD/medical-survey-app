import { CompaniesTable } from "@/components/admin/companies-table"

export default function CompaniesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Firmy</h1>
        <p className="text-muted-foreground">
          Zarządzaj firmami i generuj linki do ankiet dla pracowników
        </p>
      </div>

      <CompaniesTable />
    </div>
  )
}
