# Minekube FPS web – přímé stahování přes GitHub Release

Tlačítko **Stáhnout** je upravené tak, aby nikam neotevíralo Game Jolt ani jinou stránku. Kliknutí rovnou zavolá přímý odkaz na ZIP soubor v GitHub Release a prohlížeč zahájí stahování.

## Jednorázové nastavení na GitHubu

V repozitáři `MinekubeStudios/minekubestudios.github.io` vytvoř nový Release:

- tag: `v1.21.1`
- název může být například `Minekube Ultra Performance 1.21.1`
- jako asset nahraj modpack přesně pod názvem `Minekube-Ultra-Performance-1.21.1.zip`

Web už má nastavený tento přímý odkaz:

```text
https://github.com/MinekubeStudios/minekubestudios.github.io/releases/download/v1.21.1/Minekube-Ultra-Performance-1.21.1.zip
```

Jakmile Release zveřejníš, tlačítka **Stáhnout Modpack** i **Stáhnout ZIP** začnou rovnou stahovat soubor.

## Kde změnit odkaz

V `app.js` najdeš u modpacku:

```js
downloadUrl: "https://github.com/MinekubeStudios/minekubestudios.github.io/releases/download/v1.21.1/Minekube-Ultra-Performance-1.21.1.zip",
downloadFileName: "Minekube-Ultra-Performance-1.21.1.zip",
```

Při jiné verzi nebo názvu souboru uprav tag, název assetu a `downloadFileName`.

## Proč GitHub Release

Soubor na Game Joltu používá dočasný download odkaz, který expiruje. GitHub Pages je statický web a neumí serverovou funkci pro průběžné získávání nového Game Jolt odkazu. GitHub Release naproti tomu poskytuje stabilní přímý odkaz na asset a dovoluje nahrávat podstatně větší soubory než běžné nahrání souboru do repozitáře přes webové rozhraní.

## Vizuální overhaul

Tato verze obsahuje přepracovaný katalog modpacků, animované filtry, vlastní nabídku řazení, 3D karty, profesionální animaci oblíbeného modpacku, nové instalační kroky, vylepšenou sekci projektu a vlastní scrollbar. Přímé stahování z GitHub Release zůstalo beze změny.
