import { cn } from "@/lib/utils"
import logoUrl from "@/assets/logo.png"

/**
 * Official mark (owner-supplied 2026-07-12): red bull in a gold/red jester cap.
 * Mounted in a cream circle so it reads on both light and dark surfaces
 * (source PNG has a white background). Decorative — the adjacent wordmark
 * carries the accessible name.
 */
export function LogoBadge({
  className,
  size = "md",
}: {
  className?: string
  size?: "md" | "lg"
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-[#fffdf8] select-none",
        size === "md" ? "size-10" : "size-16",
        className
      )}
    >
      <img
        src={logoUrl}
        alt=""
        className={cn("object-contain", size === "md" ? "size-8" : "size-13")}
      />
    </span>
  )
}
