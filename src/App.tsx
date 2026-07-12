import { ClaimBand } from "@/components/site/claim-band"
import { Footer } from "@/components/site/footer"
import { Gallery } from "@/components/site/gallery"
import { Hero } from "@/components/site/hero"
import { MenuSection } from "@/components/site/menu-section"
import { Navbar } from "@/components/site/navbar"
import { Reveal } from "@/components/site/reveal"
import { SignatureRow } from "@/components/site/signature-row"
import { Terrace } from "@/components/site/terrace"

export function App() {
  return (
    <div id="top" className="min-h-svh">
      <a
        href="#glavni-sadrzaj"
        className="caps-label sr-only z-50 rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3"
      >
        Preskoči na sadržaj
      </a>
      <Navbar />
      <main id="glavni-sadrzaj">
        <Hero />
        <Reveal>
          <SignatureRow />
        </Reveal>
        <Reveal>
          <ClaimBand />
        </Reveal>
        <Reveal>
          <Terrace />
        </Reveal>
        <Reveal>
          <MenuSection />
        </Reveal>
        <Reveal>
          <Gallery />
        </Reveal>
      </main>
      <Footer />
    </div>
  )
}

export default App
