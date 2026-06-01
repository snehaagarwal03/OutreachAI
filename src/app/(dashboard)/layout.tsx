export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { SidebarLayout } from "@/components/layout/sidebar"
import { Toaster } from "sonner"

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <SidebarLayout>{children}</SidebarLayout>
      <Toaster theme="dark" position="bottom-right" richColors />
    </>
  )
}