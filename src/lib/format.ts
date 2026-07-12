/** Croatian euro price formatting: 9.4 -> "9,40 €" (Intl, hr-HR). */
const eur = new Intl.NumberFormat("hr-HR", {
  style: "currency",
  currency: "EUR",
})

export function formatPrice(price: number): string {
  if (!Number.isFinite(price)) return ""
  return eur.format(price)
}

/** "097 612 7608" -> "tel:+385976127608" (Croatian numbers). */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  const intl = digits.startsWith("0") ? `+385${digits.slice(1)}` : `+${digits}`
  return `tel:${intl}`
}

/** "Ćevapi veliki" -> "cevapi-veliki" (photo keys for src/assets/photos). */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
