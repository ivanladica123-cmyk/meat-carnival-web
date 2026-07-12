import { AtSignIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { LogoBadge } from "@/components/site/logo-badge"
import { business, hours } from "@/data/site"

export function Footer() {
  return (
    <footer id="kontakt" className="section-dark scroll-mt-20">
      {/* Location map: standard Google embed + link out to the full listing */}
      {business.mapsEmbedUrl && (
        <div className="mx-auto flex max-w-[1140px] flex-col gap-3 px-6 pt-14 lg:px-8">
          <h2 className="caps-label text-sm text-gold">Gdje smo</h2>
          <div className="overflow-hidden rounded-xl border border-wood-dark">
            <iframe
              src={business.mapsEmbedUrl}
              title={`Karta — ${business.name}, ${business.address}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full border-0 md:h-80"
            />
          </div>
          {business.mapsUrl && (
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="caps-label inline-flex min-h-11 items-center gap-2 self-start text-sm text-[#e8ddcc] transition-colors hover:text-gold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <MapPinIcon aria-hidden="true" className="size-4" />
              Otvori u Google kartama →
            </a>
          )}
        </div>
      )}
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <LogoBadge size="lg" />
            <p className="font-display text-xl text-[#faf6ef]">{business.name}</p>
          </div>
          <p className="max-w-[38ch] text-sm text-[#c9b9a4]">
            Pečenjara na Jarunu — burgeri, kebab i grill od mesa s hrvatskih
            farmi, do kasno u noć.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="caps-label text-sm text-gold">Kontakt</h2>
          <ul className="flex list-none flex-col gap-1 text-sm">
            <li>
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-[#e8ddcc] transition-colors hover:text-gold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <MapPinIcon aria-hidden="true" className="size-4 shrink-0" />
                {business.address}
              </a>
            </li>
            <li>
              <a
                href={business.phoneHref}
                className="inline-flex min-h-11 items-center gap-2 text-[#e8ddcc] transition-colors hover:text-gold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <PhoneIcon aria-hidden="true" className="size-4 shrink-0" />
                {business.phone}
              </a>
            </li>
            <li>
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-[#e8ddcc] transition-colors hover:text-gold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <AtSignIcon aria-hidden="true" className="size-4 shrink-0" />
                @meatcarnivalhr
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="caps-label text-sm text-gold">Radno vrijeme</h2>
          <ul className="flex list-none flex-col gap-1 text-sm text-[#e8ddcc]">
            {hours.rows.map((row) => (
              <li key={row.days} className="flex justify-between gap-4">
                <span>{row.days}</span>
                <span className="price">{row.time}</span>
              </li>
            ))}
          </ul>
          {hours.placeholder && (
            <p className="text-xs text-[#c9b9a4]">* podložno potvrdi vlasnika</p>
          )}
        </div>
      </div>

      <Separator className="bg-wood-dark" />
      <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-2 px-6 py-6 text-center text-xs text-[#c9b9a4] lg:px-8">
        <p>
          © 2026 Meat Carnival · Cijene prema Wolt ponudi (11.&nbsp;7.&nbsp;2026.)
        </p>
        <p>
          Alkoholna pića prodajemo samo osobama starijim od 18 godina.
        </p>
      </div>
    </footer>
  )
}
