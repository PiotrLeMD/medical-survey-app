"use client"

import * as React from "react"
import { Building2, ClipboardList, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCompanies } from "@/lib/services/mock-database"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const [stats, setStats] = React.useState({
    companies: 0,
    totalBudget: 0,
    avgBudget: 0
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadStats() {
      try {
        const companies = await getCompanies()
        const totalBudget = companies.reduce((sum, c) => sum + c.budzet, 0)
        setStats({
          companies: companies.length,
          totalBudget,
          avgBudget: companies.length > 0 ? totalBudget / companies.length : 0
        })
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Aktywne firmy"
        value={stats.companies}
        description="Zarejestrowane w systemie"
        icon={<Building2 className="h-5 w-5" />}
      />
      <StatCard
        title="Suma budżetów"
        value={`${stats.totalBudget.toFixed(2)} PLN`}
        description="Łączna pula na badania"
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <StatCard
        title="Średni budżet"
        value={`${stats.avgBudget.toFixed(2)} PLN`}
        description="Na pracownika"
        icon={<Users className="h-5 w-5" />}
      />
      <StatCard
        title="Ankiety"
        value="Funkcja w przygotowaniu"
        description="Statystyki wypełnień"
        icon={<ClipboardList className="h-5 w-5" />}
      />
    </div>
  )
}
