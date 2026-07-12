const claims = [
  {
    title: "100 % junetina",
    text: "Pljeskavice od 150 g, s hrvatskih farmi", // E11
  },
  {
    title: "Carnival umak",
    text: "Domaći potpisni umak — radimo ga sami", // E11, E9
  },
  {
    title: "Svježe svaki dan",
    text: "Salate, lepinje i pravi krumpir", // E9
  },
]

/**
 * Red claim band (blueprint wireframe). Icons intentionally omitted: design
 * rule 11 forbids generic icon libraries for food motifs — the flat red
 * illustration set (E3) is a pending owner deliverable.
 */
export function ClaimBand() {
  return (
    <section
      aria-label="Zašto Meat Carnival"
      className="bg-primary text-primary-foreground"
    >
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-3 md:py-14 lg:px-8">
        {claims.map((claim) => (
          <div
            key={claim.title}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <h3 className="font-display text-xl">{claim.title}</h3>
            <p className="text-sm text-primary-foreground/85">{claim.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
