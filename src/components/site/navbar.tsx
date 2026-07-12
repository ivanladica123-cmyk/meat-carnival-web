import * as React from "react"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LogoBadge } from "@/components/site/logo-badge"
import { OrderMenu } from "@/components/site/order-menu"

const links = [
  { href: "#jelovnik", label: "Jelovnik" },
  { href: "#terasa", label: "Terasa" },
  { href: "#kontakt", label: "Kontakt" },
]

export function Navbar() {
  const [open, setOpen] = React.useState(false)

  // Two constraints force a native listener here: the Base UI popup stops
  // click propagation before it reaches React's delegated root listener (so
  // onClick props inside the sheet never fire), and the sheet's scroll lock
  // swallows same-page anchor jumps. Close first, then scroll once the exit
  // transition (200ms) has released the lock.
  const mobileNavRef = React.useCallback((node: HTMLElement | null) => {
    if (!node) return
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a[href^="#"]')
      if (!anchor) return
      event.preventDefault()
      const href = anchor.getAttribute("href")!
      setOpen(false)
      window.setTimeout(() => {
        const target = document.querySelector(href)
        if (!target) return
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
        history.pushState(null, "", href)
      }, 250)
    }
    node.addEventListener("click", onClick)
    return () => node.removeEventListener("click", onClick)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between gap-4 px-6 lg:px-8">
        <a href="#top" className="group flex min-h-11 items-center gap-3">
          <LogoBadge className="transition-transform duration-200 group-hover:-rotate-6" />
          <span className="font-display text-lg text-primary">
            Meat Carnival
          </span>
        </a>

        <nav aria-label="Glavna navigacija" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="caps-label inline-flex min-h-11 items-center rounded-md px-4 text-sm text-foreground transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="nav-underline py-1">{link.label}</span>
            </a>
          ))}
          <OrderMenu label="Naruči" size="lg" className="caps-label ml-2 h-11 px-5" />
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-xl"
                className="md:hidden"
                aria-label="Otvori izbornik"
              />
            }
          >
            <MenuIcon aria-hidden="true" className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="section-dark border-wood-dark">
            <SheetHeader>
              <SheetTitle className="font-display text-lg font-normal text-[#faf6ef]">
                Meat Carnival
              </SheetTitle>
            </SheetHeader>
            <nav
              ref={mobileNavRef}
              aria-label="Mobilna navigacija"
              className="flex flex-col gap-1 px-4"
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="caps-label inline-flex min-h-11 items-center rounded-md px-3 text-base text-[#faf6ef] transition-colors hover:text-gold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto p-4">
              <OrderMenu label="Naruči dostavu" className="caps-label w-full" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
