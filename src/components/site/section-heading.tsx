import { cn } from "@/lib/utils"

export function SectionHeading({
  kicker,
  title,
  id,
  className,
  align = "center",
}: {
  kicker?: string
  title: string
  /** id for the h2, so sections can reference it via aria-labelledby */
  id?: string
  className?: string
  align?: "center" | "left"
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {kicker && (
        <p className="caps-label text-sm text-red-deep">{kicker}</p>
      )}
      <h2 id={id} className="font-display text-[clamp(1.75rem,4vw,2.25rem)] text-foreground">
        {title}
      </h2>
    </div>
  )
}
