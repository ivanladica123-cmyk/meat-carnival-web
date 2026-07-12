# Meat Carnival — web stranica

Jednostranična stranica restorana (Vite + React + Tailwind + shadcn/ui), s CMS
sučeljem za uređivanje sadržaja na `/admin` (Decap CMS + Netlify Identity).

## Pokretanje i build

```bash
npm install     # jednom
npm run dev     # lokalni razvoj (http://localhost:5173)
npm run build   # produkcijski build u dist/
npm run preview # pregled produkcijskog builda
```

Netlify postavke: build naredba `npm run build`, publish direktorij `dist`
(vidi `netlify.toml`). Ako je Git repozitorij mapa iznad `meat-carnival-web`,
u Netlifyju postavite *Base directory* na `meat-carnival-web`.

UI komponente: `npx shadcn@latest add <komponenta>` (spremaju se u
`src/components/ui`).

## Gdje živi sadržaj

| Datoteka | Sadržaj |
|---|---|
| `content/menu.json` | jelovnik: kategorije, proizvodi, cijene, dostupnost |
| `content/restaurant.json` | adresa, telefon, radno vrijeme, poveznice, recenzija |
| `public/images/menu/` | fotografije proizvoda učitane kroz CMS |
| `src/assets/photos/` | dizajnerske fotografije (naslovnica, pločice kategorija, galerija) |

Cijene se spremaju kao brojevi (`9.4`), a prikazuju hrvatski (`9,40 €`) preko
`Intl.NumberFormat("hr-HR")`. Sadržaj se učitava u build vremenu — neispravan
JSON ruši build i **ne može** dospjeti u produkciju.

---

## Uređivanje jelovnika

### Prijava
1. Otvorite `https://VAŠA-STRANICA/admin` u pregledniku.
2. Kliknite **Login with GitHub** i prijavite se GitHub računom.
3. Pristup ima samo GitHub račun koji je dodan kao suradnik (*collaborator*) na
   repozitorij (vidi „Prvo postavljanje" dolje). Nema javne registracije.

### Promjena cijene
1. U izborniku otvorite **Sadržaj stranice → Jelovnik**.
2. Otvorite kategoriju (npr. *Grill ponuda*), zatim proizvod.
3. Upišite novu **Cijenu (€)** kao broj, npr. `10.5` (prikazat će se kao 10,50 €).
4. Kliknite **Publish → Publish now**.

### Dodavanje ili brisanje proizvoda
- **Dodavanje:** u kategoriji kliknite **Add Proizvod**, ispunite naziv i
  cijenu (opis i fotografija nisu obavezni), pa **Publish**.
- **Brisanje:** otvorite kategoriju, uz red proizvoda kliknite ikonu tri
  točkice i odaberite **Remove**. Zatim **Publish**.

### Proizvod trenutno nedostupan
Otvorite proizvod i isključite **Dostupno**. Proizvod nestaje s jelovnika (ne
briše se — kad ga opet uključite, vraća se s istim podacima).

### Učitavanje fotografije
1. U proizvodu kliknite **Fotografija → Choose an image → Upload**.
2. Odaberite datoteku (najbolje vodoravna, do ~300 kB).
3. Fotografija se sprema u `public/images/menu/` i prikazuje uz proizvod.

### Objava promjena
Svaki **Publish** stvara *commit* u GitHub repozitoriju
`ivanladica123-cmyk/meat-carnival-web` i automatski pokreće Netlify build.
Nova verzija stranice obično je uživo za **1–3 minute**. Promjena NIJE vidljiva
odmah — pričekajte da build završi (status se vidi u Netlify sučelju).

---

## Prvo postavljanje (jednokratno) — GitHub + Netlify

Autentikacija koristi **GitHub backend** (Netlify je službeno napustio Git
Gateway). Netlify služi samo kao OAuth posrednik. Redoslijed je važan.

### A. Kod na GitHub
Repozitorij mora postojati na GitHubu kao `ivanladica123-cmyk/meat-carnival-web`
i sadržavati ovaj projekt na grani `main`. (CMS ne radi s „drag-and-drop"
deployem — mora biti Git-povezan.)

### B. GitHub račun za vlasnika restorana
1. Vlasnik otvara besplatan račun na <https://github.com/join>.
2. Vlasnik vam pošalje svoje GitHub korisničko ime.

### C. Vlasnik kao suradnik s najmanjim ovlastima
1. Na GitHubu otvorite repozitorij → **Settings → Collaborators →
   Add people**.
2. Upišite vlasnikovo korisničko ime i dodijelite ulogu **Write** (najmanja
   ovlast koja omogućuje CMS-u spremanje izmjena; **ne** dajte Admin).
3. Vlasnik u e-mailu/na GitHubu prihvati pozivnicu.
   *Napomena: privatni repozitorij + Write je dovoljno; nije potreban javni repo.*

### D. Registracija GitHub OAuth aplikacije
1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   (<https://github.com/settings/developers>).
2. **Application name:** `Meat Carnival CMS` (bilo koje ime).
3. **Homepage URL:** adresa vaše stranice (npr. `https://meatcarnival.netlify.app`).
4. **Authorization callback URL:** `https://api.netlify.com/auth/done`
   (točno ovako — to je Netlifyjev OAuth posrednik).
5. **Register application**, zatim **Generate a new client secret**.
6. Zabilježite **Client ID** i **Client Secret** (Secret se prikazuje samo
   jednom). **Secret NE ide u kod ni u repozitorij** — samo u Netlify (korak E).

### E. Unos Client ID i Secret u Netlify
1. Netlify → vaša stranica → **Site configuration → Access control → OAuth →
   Install provider**.
2. **Provider:** GitHub. Zalijepite **Client ID** i **Client Secret** iz koraka D.
3. **Install**. Netlify od sada obavlja OAuth razmjenu; tajna ostaje kod
   Netlifyja i nikad se ne pojavljuje u kodu.

### F. Prijava u /admin
Vlasnik otvara `https://VAŠA-STRANICA/admin`, klikne **Login with GitHub**,
odobri aplikaciju i uređuje sadržaj. Gotovo.

### G. Oduzimanje pristupa vlasniku (kasnije, ako zatreba)
1. GitHub repozitorij → **Settings → Collaborators** → uz vlasnika kliknite
   **Remove** (odmah gubi mogućnost spremanja).
2. Neobavezno: vlasnik u **GitHub → Settings → Applications → Authorized OAuth
   Apps** može opozvati aplikaciju `Meat Carnival CMS`.
3. Ako želite potpuno ugasiti pristup: u GitHubu obrišite OAuth aplikaciju iz
   koraka D, a u Netlifyju uklonite OAuth providera iz koraka E.

### Ostale ručne provjere
- [ ] Netlify build naredba `npm run build`, publish `dist`. Ako Git repo root
      nije `meat-carnival-web`, postavite **Base directory** na `meat-carnival-web`.
- [ ] Lokalna grana je trenutno `master`, a `config.yml` i Netlify očekuju
      **`main`**. Prije pusha preimenujte granu:
      `git branch -M main` pa `git push -u origin main`.

### Ako se objavi pogrešna promjena
- **Brzo:** ispravite vrijednost u CMS-u i ponovno kliknite Publish.
- **Vraćanje builda:** u Netlifyju otvorite **Deploys**, odaberite zadnji dobar
  deploy i kliknite **Publish deploy** — stranica se odmah vraća na tu verziju
  (sadržaj u repozitoriju i dalje treba ispraviti za sljedeći build).
- **Git revert:** svaka CMS objava je zaseban commit. Pogrešnu izmjenu vratite
  s `git revert <hash-commita>` pa `git push` (ili na GitHubu kroz povijest
  commita → *Revert*).

### Sadržaj koji vlasnik treba potvrditi
- Radno vrijeme (prikazuje se s napomenom „podložno potvrdi" dok se u CMS-u ne
  isključi opcija *Prikaži napomenu*).
- Recenzija gošće Petre (dozvola za objavu) — može se sakriti u CMS-u
  (*Recenzija gosta → Prikaži recenziju*).
- Cijene su preuzete s Wolta 11. 7. 2026. — potvrditi da vrijede i u lokalu.

## Sigurnosna kopija i vraćanje (za developera)

**Datoteke `content/*.json` NISU sigurnosna kopija.** One su trenutačni
sadržaj stranice — svaka CMS objava ih prepisuje. Prava zaštita je Git povijest:
svaka objava je commit, pa se svako stanje može vratiti.

**Prije lansiranja** napravite čist commit i označite ga *tagom* kao poznatu
dobru točku za povratak:

```bash
git add -A
git commit -m "Lansiranje: potvrđeni sadržaj i cijene"
git tag -a v1.0-launch -m "Stanje na dan lansiranja"
git push origin main --tags
```

Za povratak na to stanje kasnije:

```bash
git checkout v1.0-launch -- content/    # vrati samo sadržaj na stanje lansiranja
git commit -m "Vraćanje sadržaja na v1.0-launch"
git push origin main
```

Za poništavanje jedne pogrešne CMS objave koristite `git revert <hash>` (vidi
„Ako se objavi pogrešna promjena" gore).

## Što vlasnik NE može mijenjati kroz CMS
Boje, fontove, razmake, raspored stranice, CSS, skripte — dizajn je zaključan
u kodu (`src/`). CMS uređuje isključivo sadržaj u `content/*.json` i fotografije.
