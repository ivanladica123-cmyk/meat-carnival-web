import { ClockIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { SmartImage } from "@/components/site/smart-image"
import { hours, review } from "@/data/site"

export function Terrace() {
  return (
    <section
      id="terasa"
      aria-labelledby="terasa-title"
      className="scroll-mt-20 bg-burgundy/10 py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 lg:px-8">
        <SmartImage
          photoKey="terasa"
          label="Drvena terasa uz potok — pogled na zelenilo, bordo stolice"
          className="aspect-[4/3] w-full"
        />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="caps-label text-sm text-red-deep">Uživo, uz potok</p>
            <h2
              id="terasa-title"
              className="font-display text-[clamp(1.75rem,4vw,2.25rem)]"
            >
              Terasa uz potok
            </h2>
            <p className="max-w-[55ch] text-base leading-relaxed">
              Natkrivena drvena terasa s pogledom na zelenilo — mjesto gdje
              ćevapi najbolje mirišu. Sjedni, naruči platu za društvo i pusti
              da roštilj radi svoje.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="caps-label flex items-center gap-2 text-sm">
              <ClockIcon aria-hidden="true" className="size-4 text-red-deep" />
              Radno vrijeme
            </h3>
            <table className="w-full max-w-sm text-sm">
              <tbody>
                {hours.rows.map((row) => (
                  <tr key={row.days} className="border-b border-border/70 last:border-0">
                    <th scope="row" className="py-2 pr-4 text-left font-medium">
                      {row.days}
                    </th>
                    <td className="price py-2 text-right">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hours.placeholder && (
              <p className="text-xs text-muted-foreground">
                * Radno vrijeme podložno potvrdi — provjerite na Googleu ili
                nazovite prije dolaska.
              </p>
            )}
          </div>

          {/* Review excerpt — CMS-controlled (owner can hide it or change the
              text once republish permission is settled). */}
          {review.show && (
            <Card className="border-0 bg-burgundy text-[#faf6ef]">
              <CardContent className="flex flex-col gap-2">
                <span aria-hidden="true" className="font-display text-4xl leading-none text-gold">
                  &ldquo;
                </span>
                <blockquote className="text-base leading-relaxed">
                  {review.text}
                </blockquote>
                {review.author && (
                  <cite className="caps-label text-xs not-italic text-[#e8ddcc]">
                    {review.author}
                  </cite>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
