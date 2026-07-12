/**
 * Drop-in photo pipeline. Put owner-approved images in `src/assets/photos/`
 * named by key (see README.md there) and they replace the placeholders
 * automatically — no code changes needed.
 */
const modules = import.meta.glob("../assets/photos/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

const byKey = new Map<string, string>()
for (const [path, url] of Object.entries(modules)) {
  const base = path.split("/").pop()!.replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")
  byKey.set(base.toLowerCase(), url)
}

export function photoUrl(key: string): string | undefined {
  return byKey.get(key.toLowerCase())
}
