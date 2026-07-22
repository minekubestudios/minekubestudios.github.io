# Minekube FPS — demonstrační web

Moderní responzivní katalog Minecraft FPS modpacků v černo-fialové, oranžové a zlaté paletě podle Minekube loga.

## Spuštění

Nejjednodušší varianta:
1. Rozbal ZIP.
2. Otevři `index.html` v prohlížeči.

Lepší varianta pro vývoj:
```bash
python -m http.server 8080
```
Potom otevři `http://localhost:8080`.

## Co web umí

- responzivní desktopovou a mobilní verzi
- vyhledávání modpacků
- filtry podle Minecraft verze, loaderu a zaměření
- řazení výsledků
- ukládání oblíbených modpacků do localStorage
- detail modpacku v modálním okně
- tmavý a světlý motiv
- animované benchmarky a FPS panel
- plynulé odhalování obsahu při scrollování, ukazatel průchodu stránkou a aktivní navigaci
- žádné externí knihovny ani CDN

## Kde upravit data

V souboru `app.js` najdi pole `modpacks`. Každý objekt představuje jeden modpack.

Důležitá pole:
- `name` — název
- `description` — krátký popis
- `versions` — podporované verze Minecraftu
- `loader` — Fabric / NeoForge
- `downloads` — počet stažení
- `release` — označení verze
- `features` — hlavní funkce
- `requirements` — požadavky

## Skutečné download odkazy

V `app.js` nahraď funkci `demoDownload(pack)` skutečným přesměrováním, například:

```js
window.location.href = pack.downloadUrl;
```

A do každého modpacku přidej:
```js
downloadUrl: "downloads/nazev-balicku.mrpack"
```

## Důležité před zveřejněním

- Nahraď ukázkové benchmarky vlastními naměřenými daty.
- Doplň reálné odkazy na Discord, Game Jolt a GitHub.
- Doplň licenční podmínky.
- Ověř oprávnění autorů modů k distribuci.
- Přidej vlastní soubory `.mrpack` nebo odkazy na oficiální hosting.


## Propojení s Game Jolt

Tlačítko u Minekube Ultra Performance otevírá veřejnou stránku projektu:
`https://gamejolt.com/games/_/1053229`

Aktuální nastavení: Minecraft 1.21.1, Fabric, verze 1.0.0, velikost 95 MB, 80 modů.

## Přímé stahování z Game Joltu

Web obsahuje Netlify Function `netlify/functions/gamejolt-download.js`.
Po kliknutí na tlačítko web podle ID Game Jolt projektu automaticky:

1. zjistí aktuální build,
2. vyžádá nový dočasný download odkaz,
3. ihned spustí stahování souboru.

Není potřeba ručně kopírovat dočasný CDN odkaz. Ten by později přestal fungovat.

U modpacku stačí v `app.js` nastavit:

```js
gameJoltGameId: "1053229",
gameJoltUrl: "https://gamejolt.com/games/_/1053229",
```

Při nasazení na Netlify nahraj celou složku projektu včetně:

- `netlify.toml`
- `package.json`
- složky `netlify/functions`

## Úprava katalogu

- katalog obsahuje pouze Minekube Ultra Performance
- filtry verzí: 1.21.1, 1.21.11 a 26.2
- přímé stahování z Game Joltu zůstává aktivní

## Ultimate animace tlačítka ke stažení

Tlačítko pro stažení nově obsahuje několik vrstev efektů bez externích knihoven:

- jemně animovaný zlatý/oranžový energetický povrch
- světlo reagující na pozici kurzoru a magnetický 3D náklon
- pohyblivý energetický rámeček, světelný sweep a drobné částice
- samostatnou animaci textu, ikony a kruhového orbitu
- vícevrstvou explozi, rázové vlny, jiskry a fragmenty po kliknutí
- šetrnou variantu pro systémové nastavení `prefers-reduced-motion`

## Ultimate detail modpacku

Detail modpacku byl přepracovaný do jednotného herního UI:

- výrazná hlavička s výkonovým jádrem a stavem releasu
- přehledné informační karty s vlastními SVG ikonami
- oddělené panely výhod a požadavků
- jemné nástupové a hover animace bez rušivého blikání
- větší, kontrastnější text tlačítka ke stažení i během efektů
- plně responzivní rozložení pro desktop i mobil
