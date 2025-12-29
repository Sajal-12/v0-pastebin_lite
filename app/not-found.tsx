import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Paste Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The paste you're looking for doesn't exist, has expired, or exceeded its view limit.
        </p>
        <Link href="/">
          <Button>Create a New Paste</Button>
        </Link>
      </div>
    </div>
  )
}
