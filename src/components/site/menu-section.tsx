import { PhoneIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CategoryTiles } from "@/components/site/category-tiles"
import { SectionHeading } from "@/components/site/section-heading"
import { formatPrice } from "@/lib/format"
import { business, menu, type MenuItem } from "@/data/site"

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="-mx-3 flex gap-3 rounded-md px-3 py-3 transition-colors duration-150 hover:bg-muted/60">
      {/* Optional CMS-uploaded thumbnail; absent for most items by design. */}
      {item.image && (
        <img
          src={item.image}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          className="size-16 shrink-0 rounded-md border object-cover"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-base font-semibold">
            {item.name}
            {item.note && (
              <Badge
                variant="outline"
                className="caps-label ml-2 border-red-deep align-middle text-xs text-red-deep"
              >
                {item.note}
              </Badge>
            )}
            {item.popular && (
              <Badge className="caps-label ml-2 bg-gold align-middle text-xs text-foreground">
                Popularno
              </Badge>
            )}
          </span>
          <span
            aria-hidden="true"
            className="mx-1 flex-1 border-b border-dotted border-input"
          />
          <span className="price whitespace-nowrap text-red-deep">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="max-w-[60ch] text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </li>
  )
}

export function MenuSection() {
  return (
    <section
      id="jelovnik"
      aria-labelledby="jelovnik-title"
      className="scroll-mt-20 py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-[1140px] flex-col gap-10 px-6 lg:px-8">
        <SectionHeading id="jelovnik-title" kicker="Jelovnik" title="Cirkus okusa, ozbiljno meso" />

        {/* Category tile grid (visual quick-nav) + real headings below (blueprint §5.9) */}
        <CategoryTiles />

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
          {menu
            .map((cat) => ({
              ...cat,
              // CMS "Dostupno" toggle: unavailable items are hidden entirely
              // (clean price list beats a struck-through row in this design).
              items: cat.items.filter((item) => item.available),
            }))
            .filter((cat) => cat.items.length > 0)
            .map((cat) => (
              <div key={cat.id} id={cat.id} className="scroll-mt-24">
                <h3 className="font-display text-2xl text-primary">{cat.label}</h3>
                {cat.note && (
                  <p className="mt-1 text-sm text-muted-foreground">{cat.note}</p>
                )}
                <Separator className="mt-3 mb-1 bg-wood/40" />
                <ul className="list-none divide-y divide-border/60">
                  {cat.items.map((item) => (
                    <MenuRow key={item.name} item={item} />
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Order panel (blueprint §5.8) */}
        <div className="section-dark mx-auto flex w-full max-w-3xl flex-col items-center gap-4 rounded-xl px-6 py-8 text-center">
          <h3 className="font-display text-xl text-[#faf6ef]">Gladan? Riješimo to.</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            {business.woltUrl && (
              <Button
                size="xl"
                className="caps-label"
                nativeButton={false}
                render={<a href={business.woltUrl} target="_blank" rel="noopener noreferrer" />}
              >
                Naruči na Woltu
              </Button>
            )}
            {business.glovoUrl && (
              <Button
                size="xl"
                variant="outline"
                className="caps-label border-gold bg-transparent text-[#faf6ef] hover:bg-gold/10 hover:text-gold"
                nativeButton={false}
                render={<a href={business.glovoUrl} target="_blank" rel="noopener noreferrer" />}
              >
                Naruči na Glovu
              </Button>
            )}
            {business.phone && (
              <Button
                size="xl"
                variant="outline"
                className="caps-label border-gold bg-transparent text-[#faf6ef] hover:bg-gold/10 hover:text-gold"
                nativeButton={false}
                render={<a href={business.phoneHref} />}
              >
                <PhoneIcon data-icon="inline-start" aria-hidden="true" />
                {business.phone}
              </Button>
            )}
          </div>
          <p className="text-xs text-[#c9b9a4]">
            Dostavne cijene na Woltu i Glovu mogu se razlikovati od cijena u
            lokalu.
          </p>
        </div>
      </div>
    </section>
  )
}
