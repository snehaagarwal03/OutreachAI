"use client"

import { deleteOffering } from "@/features/offerings/actions"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export function DeleteOfferingButton({ id }: { id: string }) {
  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    try {
      await deleteOffering(id)
      toast.success("Offering deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}