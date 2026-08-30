import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
              SP
            </div>
            <span className="text-sm text-muted-foreground">
              Shehri Portal - Karachi Metropolitan Corporation
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>KMC Helpdesk: <span className="font-bold text-foreground">1339</span></span>
            <span>|</span>
            <span>Email: info@kmc.gov.pk</span>
            <span>|</span>
            <span>Karachi, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
