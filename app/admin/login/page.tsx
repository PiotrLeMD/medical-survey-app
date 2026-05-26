"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AppLogo } from "@/components/app-logo"
import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = React.useState(true)

  React.useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin")
    } else {
      setIsRedirecting(false)
    }
  }, [router])

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AppLogo showSubtitle={false} className="justify-center mb-4" />
          <CardTitle>Panel administratora</CardTitle>
          <CardDescription>
            Zaloguj się, aby zarządzać firmami i ankietami
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
