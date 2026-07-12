import { photoUrl } from "@/lib/photos"
import { cn } from "@/lib/utils"
import { PlaceholderImage } from "@/components/site/placeholder-image"

/**
 * Renders the owner photo for `photoKey` when a matching file exists in
 * src/assets/photos/, otherwise the labeled placeholder (blueprint §9.10).
 */
export function SmartImage({
  photoKey,
  label,
  className,
  dark = false,
  src,
}: {
  photoKey: string
  label: string
  className?: string
  dark?: boolean
  /** Explicit image URL (e.g. CMS upload) — wins over the photoKey lookup. */
  src?: string
}) {
  const url = src || photoUrl(photoKey)
  if (!url) {
    return <PlaceholderImage label={label} className={className} dark={dark} />
  }
  return (
    <img
      src={url}
      alt={label}
      loading="lazy"
      className={cn("rounded-lg object-cover", className)}
    />
  )
}
