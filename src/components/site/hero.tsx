import { useEffect, useRef } from "react"
import { ClockIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { OrderMenu } from "@/components/site/order-menu"
import { photoUrl } from "@/lib/photos"
import { business } from "@/data/site"

export function Hero() {
  const heroPhoto = photoUrl("hero")
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)

  // Scroll-linked parallax, vanilla (no animation library). The hero is at the
  // top of the document, so window.scrollY maps directly onto it. Transforms are
  // ADDITIVE over always-visible content — if this effect never runs (no-JS,
  // reduced-motion), the hero is simply static and fully legible.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return
    const bg = bgRef.current
    const content = contentRef.current
    const cue = cueRef.current
    if (!bg || !content) return

    // Direct style writes on scroll. These are compositor-only properties
    // (transform/opacity) on a handful of nodes, so no rAF throttle is needed;
    // this also keeps the effect observable when a rAF loop is unavailable.
    const apply = () => {
      const y = window.scrollY
      const p = Math.min(y, 600) / 600
      bg.style.transform = `translateY(${p * 60}px) scale(1.25)`
      content.style.transform = `translateY(${p * 130}px)`
      const op = Math.max(0, 1 - y / 460)
      content.style.opacity = String(op)
      if (cue) cue.style.opacity = String(op)
    }
    apply()
    window.addEventListener("scroll", apply, { passive: true })
    return () => window.removeEventListener("scroll", apply)
  }, [])

  return (
    <section
      aria-labelledby="hero-title"
      className="section-dark relative overflow-hidden"
    >
      {/* Parallax backdrop. Scaled 1.25 to overscan the translate so no edge gap
          appears. Owner photo (src/assets/photos/hero.*) or striped placeholder
          until authorized photography arrives (§5.3, §9.10). */}
      <div ref={bgRef} aria-hidden="true" className="absolute inset-0 will-change-transform">
        {heroPhoto ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroPhoto})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#2c231d_0px,#2c231d_18px,#261e19_18px,#261e19_36px)]" />
        )}
      </div>
      {/* Scrim sits above the parallax layer and always covers the viewport. */}
      <div
        aria-hidden="true"
        className={
          heroPhoto
            ? "absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(23,17,13,0.55)_0%,rgba(23,17,13,0.9)_100%)]"
            : "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(23,17,13,0.85)_100%)]"
        }
      />

      <div
        ref={contentRef}
        className="relative mx-auto flex max-w-[1140px] flex-col items-center gap-6 px-6 py-20 text-center will-change-transform md:py-28 lg:px-8"
      >
        <p className="caps-label text-sm text-gold">Pečenjara · Jarun, Zagreb</p>
        <h1
          id="hero-title"
          className="font-display text-[clamp(2.25rem,7vw,3.5rem)] text-[#faf6ef]"
        >
          Meat Carnival
        </h1>
        <p className="max-w-[45ch] text-lg text-[#e8ddcc]">
          Burgeri, kebab i grill — 100&nbsp;% junetina s hrvatskih farmi,
          domaći Carnival umak i porcije za pravu glad.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="xl" className="caps-label" nativeButton={false}
            render={<a href="#jelovnik" />}>
            Pogledaj jelovnik
          </Button>
          <OrderMenu
            label="Naruči dostavu"
            variant="outline"
            className="caps-label border-gold bg-transparent text-[#faf6ef] hover:bg-gold/10 hover:text-gold"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          {business.rating && business.mapsUrl && (
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-wood-dark bg-black/20 px-4 text-[#e8ddcc] transition-colors hover:text-gold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <StarIcon aria-hidden="true" className="size-4 fill-gold text-gold" />
              <span>
                {business.rating} ({business.reviewCount} recenzija na Googleu)
              </span>
            </a>
          )}
          {business.lateNightNote && (
            <span className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-wood-dark bg-black/20 px-4 text-[#e8ddcc]">
              <ClockIcon aria-hidden="true" className="size-4" />
              {business.lateNightNote}
            </span>
          )}
        </div>
      </div>

      {/* Scroll cue (mouse outline). Static dot: no perpetual motion. */}
      <div
        ref={cueRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-4 flex justify-center"
      >
        <span className="block h-9 w-6 rounded-full border-2 border-gold/60">
          <span className="mx-auto mt-1.5 block size-1.5 rounded-full bg-gold" />
        </span>
      </div>
    </section>
  )
}
