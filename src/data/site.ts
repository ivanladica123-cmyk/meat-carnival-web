/**
 * Content adapter. The editable source of truth lives in /content/*.json
 * (edited by the owner via Decap CMS at /admin) and is imported at BUILD TIME —
 * Vite fails the build on malformed JSON, so a broken edit can never reach
 * production, and the rendered site needs no runtime fetch (no loading state,
 * no layout shift). This module validates/normalizes the JSON defensively and
 * keeps the export shape the components already use.
 *
 * Prices are stored as numbers and formatted with Intl (hr-HR/EUR) at render
 * time via src/lib/format.ts.
 */
import menuJson from "../../content/menu.json"
import restaurantJson from "../../content/restaurant.json"
import { slugify, telHref } from "@/lib/format"

export type MenuItem = {
  name: string
  price: number
  description?: string
  popular?: boolean
  available: boolean
  featured?: boolean
  featuredBlurb?: string
  /** CMS upload (public path like /images/menu/x.jpg) */
  image?: string
  note?: string
}

export type MenuCategory = {
  id: string
  label: string
  items: MenuItem[]
  note?: string
}

type RawItem = Partial<MenuItem> & { name?: unknown; price?: unknown }
type RawCategory = { id?: unknown; label?: unknown; note?: unknown; items?: unknown }

function normalizeItem(raw: RawItem): MenuItem | null {
  if (typeof raw?.name !== "string" || raw.name.trim() === "") return null
  const price = typeof raw.price === "number" ? raw.price : Number(raw.price)
  if (!Number.isFinite(price)) return null
  return {
    name: raw.name,
    price,
    description:
      typeof raw.description === "string" && raw.description.trim() !== ""
        ? raw.description
        : undefined,
    popular: raw.popular === true,
    available: raw.available !== false,
    featured: raw.featured === true,
    featuredBlurb:
      typeof raw.featuredBlurb === "string" && raw.featuredBlurb.trim() !== ""
        ? raw.featuredBlurb
        : undefined,
    image:
      typeof raw.image === "string" && raw.image.trim() !== ""
        ? raw.image
        : undefined,
    note:
      typeof raw.note === "string" && raw.note.trim() !== ""
        ? raw.note
        : undefined,
  }
}

function normalizeCategory(raw: RawCategory): MenuCategory | null {
  if (typeof raw?.label !== "string" || raw.label.trim() === "") return null
  const items = (Array.isArray(raw.items) ? raw.items : [])
    .map((i) => normalizeItem(i as RawItem))
    .filter((i): i is MenuItem => i !== null)
  if (items.length === 0) return null
  return {
    id: typeof raw.id === "string" && raw.id !== "" ? raw.id : slugify(raw.label),
    label: raw.label,
    note: typeof raw.note === "string" && raw.note.trim() !== "" ? raw.note : undefined,
    items,
  }
}

/** Full menu. Unavailable items are kept here; rendering filters them. */
export const menu: MenuCategory[] = (
  Array.isArray(menuJson?.categories) ? menuJson.categories : []
)
  .map((c) => normalizeCategory(c as RawCategory))
  .filter((c): c is MenuCategory => c !== null)

const r = restaurantJson ?? ({} as typeof restaurantJson)

export const business = {
  name: typeof r.name === "string" ? r.name : "Meat Carnival",
  address: typeof r.address === "string" ? r.address : "",
  phone: typeof r.phone === "string" ? r.phone : "",
  phoneHref: telHref(typeof r.phone === "string" ? r.phone : ""),
  rating: typeof r.rating === "string" ? r.rating : "",
  reviewCount: typeof r.reviewCount === "number" ? r.reviewCount : 0,
  lateNightNote: typeof r.lateNightNote === "string" ? r.lateNightNote : "",
  mapsUrl: typeof r.mapsUrl === "string" ? r.mapsUrl : "",
  mapsEmbedUrl: typeof r.mapsEmbedUrl === "string" ? r.mapsEmbedUrl : "",
  woltUrl: typeof r.woltUrl === "string" ? r.woltUrl : "",
  glovoUrl: typeof r.glovoUrl === "string" ? r.glovoUrl : "",
  instagramUrl: typeof r.instagramUrl === "string" ? r.instagramUrl : "",
}

export const hours = {
  /** shows the "podložno potvrdi" footnote while the owner hasn't confirmed */
  placeholder: r.hours?.unconfirmed !== false,
  rows: (Array.isArray(r.hours?.rows) ? r.hours.rows : []).filter(
    (row): row is { days: string; time: string } =>
      typeof row?.days === "string" && typeof row?.time === "string",
  ),
}

export const review = {
  show:
    r.review?.show === true &&
    typeof r.review?.text === "string" &&
    r.review.text.trim() !== "",
  text: typeof r.review?.text === "string" ? r.review.text : "",
  author: typeof r.review?.author === "string" ? r.review.author : "",
}

/** Signature row: menu items the owner flagged "featured", available only. */
export const signatureItems = menu
  .flatMap((cat) => cat.items)
  .filter((item) => item.featured && item.available)
  .map((item) => ({
    name: item.name,
    price: item.price,
    blurb: item.featuredBlurb ?? item.description ?? "",
    imgLabel: item.name,
    photoKey: slugify(item.name),
    image: item.image,
    popular: item.popular === true,
  }))

/** Owner-supplied Instagram promo photos (2026-07-12). Captions condensed from
 *  the original post filenames. Files: src/assets/photos/gallery-N.webp */
export const gallery = [
  {
    photoKey: "gallery-1",
    alt: "Carnival plata — vrhunsko meso domaćeg uzgoja",
  },
  {
    photoKey: "gallery-2",
    alt: "Carnival Cheese s duplim komadom 100 % junećeg mesa",
  },
  {
    photoKey: "gallery-3",
    alt: "Carnival Cheese burger s duplom dozom cheddara",
  },
  {
    photoKey: "gallery-4",
    alt: "Proljeće na terasi Meat Carnivala",
  },
]
