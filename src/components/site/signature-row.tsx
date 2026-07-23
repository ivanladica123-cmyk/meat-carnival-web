import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { SectionHeading } from "@/components/site/section-heading"
import { SmartImage } from "@/components/site/smart-image"
import { formatPrice } from "@/lib/format"
import { signatureItems } from "@/data/site"

export function SignatureRow() {
  if (signatureItems.length === 0) return null
  return (
    <section aria-labelledby="signature-title" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto flex max-w-[1140px] flex-col gap-10 px-6 lg:px-8">
        <SectionHeading
          id="signature-title"
          kicker="Najtraženije"
          title="Ljubimci gostiju"
        />
        <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signatureItems.map((item) => (
            <li key={item.name}>
              <Card className="group h-full gap-4 overflow-hidden pt-0 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative overflow-hidden">
                  <SmartImage
                    photoKey={item.photoKey}
                    src={item.image}
                    label={item.imgLabel}
                    className="aspect-[4/3] w-full rounded-none border-0 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {item.popular && (
                    <Badge className="caps-label absolute top-3 right-3 bg-gold text-foreground">
                      Popularno
                    </Badge>
                  )}
                </div>
                <CardContent className="flex flex-col gap-1.5">
                  <CardTitle className="caps-label text-base">
                    {item.name}
                  </CardTitle>
                  {item.blurb && (
                    <CardDescription className="line-clamp-2">
                      {item.blurb}
                    </CardDescription>
                  )}
                </CardContent>
                <CardFooter className="mt-auto">
                  <p className="price text-lg text-red-deep">
                    {formatPrice(item.price)}
                  </p>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
