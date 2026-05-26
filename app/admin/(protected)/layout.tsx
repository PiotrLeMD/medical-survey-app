import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl py-8 px-4 md:px-8">
            {children}
          </div>
        </main>
        <Toaster position="top-right" />
      </div>
    </AdminAuthGuard>
  )
}
