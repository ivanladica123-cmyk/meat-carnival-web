import { ChevronDownIcon, PhoneIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { business } from "@/data/site"

/**
 * Delivery-channel chooser: one CTA, user picks Wolt / Glovo / phone.
 * Items render as real anchors so navigation works natively everywhere
 * (including inside the mobile sheet).
 */
export function OrderMenu({
  label = "Naruči dostavu",
  size = "xl",
  variant = "default",
  className,
}: {
  label?: string
  size?: "lg" | "xl"
  variant?: "default" | "outline"
  className?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size={size} variant={variant} className={className} />
        }
      >
        {label}
        <ChevronDownIcon data-icon="inline-end" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        {/* GroupLabel MUST live inside the Group — Base UI throws otherwise,
            which unmounted the whole app when the popup opened. */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="caps-label text-xs text-muted-foreground">
            Odaberi način narudžbe
          </DropdownMenuLabel>
          {/* Channels without a configured link are omitted gracefully. */}
          {business.woltUrl && (
            <DropdownMenuItem
              render={
                <a
                  href={business.woltUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <span className="font-semibold">Wolt</span>
              <span className="ml-auto text-xs text-muted-foreground">dostava</span>
            </DropdownMenuItem>
          )}
          {business.glovoUrl && (
            <DropdownMenuItem
              render={
                <a
                  href={business.glovoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <span className="font-semibold">Glovo</span>
              <span className="ml-auto text-xs text-muted-foreground">dostava</span>
            </DropdownMenuItem>
          )}
          {business.phone && (
            <DropdownMenuItem render={<a href={business.phoneHref} />}>
              <PhoneIcon aria-hidden="true" />
              <span className="font-semibold">{business.phone}</span>
              <span className="ml-auto text-xs text-muted-foreground">telefon</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
