import { AtSignIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/site/section-heading"
import { SmartImage } from "@/components/site/smart-image"
import { business, gallery } from "@/data/site"

/**
 * Owner-supplied Instagram promo shots (2026-07-12) + follow CTA.
 * Photography direction per blueprint §5.3: hero item, warm light, dark bg.
 */
export function Gallery() {
  return (
    <section aria-labelledby="galerija-title" className="py-16 md:py-24">
      <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-10 px-6 lg:px-8">
        <SectionHeading
          id="galerija-title"
          kicker="Galerija"
          title="S našeg roštilja"
        />
        <ul className="grid w-full list-none grid-cols-2 gap-4 lg:grid-cols-4">
          {gallery.map((shot) => (
            <li key={shot.photoKey} className="group overflow-hidden rounded-lg">
              <SmartImage
                photoKey={shot.photoKey}
                label={shot.alt}
                className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </li>
          ))}
        </ul>
        <Button
          size="xl"
          variant="outline"
          className="caps-label"
          nativeButton={false}
          render={
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <AtSignIcon data-icon="inline-start" aria-hidden="true" />
          Prati nas — @meatcarnivalhr
        </Button>
      </div>
    </section>
  )
}
