import { SmartImage } from "@/components/site/smart-image"
import { menu } from "@/data/site"

/**
 * Category tile grid (owner-requested pattern, modeled on Taco Bell's
 * "Our Food" layout but restyled to Meat Carnival tokens): one visual tile
 * per menu category, anchoring to the full listing below. Replaces the
 * earlier text-pill quick-nav; headings below keep the a11y semantics.
 */
export function CategoryTiles() {
  return (
    <nav aria-label="Kategorije jelovnika">
      <ul className="grid list-none grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {/* Mirror MenuSection's availability filter so tiles never anchor to a hidden section. */}
        {menu.filter((cat) => cat.items.some((i) => i.available)).map((cat) => (
          <li key={cat.id}>
            <a
              href={`#${cat.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="block overflow-hidden">
                <SmartImage
                  photoKey={cat.id}
                  label={cat.label}
                  className="aspect-[4/3] w-full rounded-none border-0 transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </span>
              <span className="caps-label flex min-h-11 items-center justify-center gap-1 px-2 py-2 text-center text-sm text-red-deep transition-colors group-hover:text-primary">
                {cat.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
