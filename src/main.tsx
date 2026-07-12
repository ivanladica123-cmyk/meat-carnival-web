import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { business } from "@/data/site"

// Restaurant structured data (schema.org), built from the CMS-edited content so
// it can never drift from the visible site. Confirmed business info only —
// no ratings, no opening hours (unconfirmed), no invented fields.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: business.name,
  telephone: business.phoneHref.replace("tel:", ""),
  servesCuisine: ["Burgers", "Kebab", "Grill"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Pakoštanska ul. 5",
    addressLocality: "Zagreb",
    postalCode: "10000",
    addressCountry: "HR",
  },
  hasMap: business.mapsUrl,
  sameAs: [business.instagramUrl, business.mapsUrl].filter(Boolean),
}
const ld = document.createElement("script")
ld.type = "application/ld+json"
ld.textContent = JSON.stringify(structuredData)
document.head.appendChild(ld)

// Light-only site per DESIGN_BLUEPRINT.md (no dark page theme defined);
// the template ThemeProvider (system dark + "d" hotkey) is intentionally unused.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
