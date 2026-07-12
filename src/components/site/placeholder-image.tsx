import { CameraIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Temporary image placeholder — blueprint §9: owner-authorized photography and
 * logo files are pending. Swap for real <img> assets on delivery; keep the
 * aria-label as the basis for the final alt text.
 */
export function PlaceholderImage({
  label,
  className,
  dark = false,
}: {
  label: string
  className?: string
  dark?: boolean
}) {
  return (
    <div
      role="img"
      aria-label={`Rezervirano mjesto za fotografiju: ${label}`}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg border",
        dark
          ? "border-wood-dark bg-[repeating-linear-gradient(45deg,#2c231d_0px,#2c231d_14px,#261e19_14px,#261e19_28px)] text-[#c9b9a4]"
          : "border-border bg-[repeating-linear-gradient(45deg,#f2ebdd_0px,#f2ebdd_14px,#ece2cf_14px,#ece2cf_28px)] text-muted-foreground",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <CameraIcon aria-hidden="true" className="size-6 opacity-70" />
        <p className="caps-label text-xs">Fotografija uskoro</p>
        <p className="max-w-[22ch] text-xs leading-snug opacity-80">{label}</p>
      </div>
    </div>
  )
}
