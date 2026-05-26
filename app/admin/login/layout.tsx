import { Toaster } from "@/components/ui/sonner"

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  )
}
