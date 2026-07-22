document.documentElement.classList.add("js");

const safeStorage = {
  get(key, fallback = null) {
    try {
      const value = window.localStorage.getItem(key);
      return value ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Web zůstane plně funkční i v režimu, kde je úložiště blokované.
    }
  }
};

const modpacks = [
  {
    id: "ultra-performance",
    name: "Ultra Performance",
    shortName: "Ultra Performance - Release",
    description: "Maximálně optimalizovaný FPS modpack.",
    longDescription: "Maximálně optimalizovaný FPS modpack pro Minecraft 1.21.1 s Fabric loaderem.",
    versions: ["1.21.1"],
    loader: "Fabric",
    category: "Maximum FPS",
    tags: ["Fabric", "Client", "Maximum FPS"],
    badge: "DOPORUČENO",
    downloads: 24870,
    performance: "10/10",
    fps: 1000,
    fpsLabel: "1000 FPS+",
    updated: "2026-07-18",
    release: "1.21.1",
    size: "95 MB",
    mods: 80,
    downloadUrl: "https://github.com/MinekubeStudios/minekubestudios.github.io/releases/download/v1.21.1/Minekube-Ultra-Performance-1.21.1.zip",
    downloadFileName: "Minekube-Ultra-Performance-1.21.1.zip",
    gameJoltUrl: "https://gamejolt.com/games/_/1053229",
    color: "linear-gradient(135deg, #04130b 0%, #0a3d20 34%, #159447 62%, #d1a31a 83%, #ffd85a 100%)",
    cube: ["#fff07a", "#e9b91e", "#178f43"],
    features: [
      "Maximum FPS profil",
      "Optimalizované vykreslování chunků",
      "Rychlejší start hry",
      "Nízké využití operační paměti",
      "Přednastavené video nastavení"
    ],
    requirements: [
      "Minecraft Java Edition",
      "Doporučeno 4 GB RAM pro instanci",
      "Java 21 pro řadu 1.21.x",
      "Samostatná čistá instance"
    ]
  }
];

const state = {
  query: "",
  versions: new Set(),
  loaders: new Set(),
  categories: new Set(),
  sort: "featured",
  favorites: new Set(JSON.parse(safeStorage.get("minekube-favorites", "[]")))
};

const packGrid = document.getElementById("packGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filtersPanel = document.querySelector(".filters-panel");
const filterToggle = document.getElementById("filterToggle");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
const toast = document.getElementById("toast");
let modalCloseTimer = null;
let lastModalTrigger = null;

function formatDownloads(value) {
  return new Intl.NumberFormat("cs-CZ", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}


function modalIcon(name, className = "") {
  const icons = {
    verified: '<path d="M12 3.2 14.2 5l2.8-.2.8 2.7 2.4 1.5-1.1 2.6 1.1 2.6-2.4 1.5-.8 2.7-2.8-.2L12 20.8 9.8 19l-2.8.2-.8-2.7L3.8 15l1.1-2.6-1.1-2.6 2.4-1.5L7 5.6l2.8.2L12 3.2Z"/><path d="m8.7 12.1 2.1 2.1 4.6-4.8"/>',
    game: '<path d="M6.4 8.2h11.2a3.4 3.4 0 0 1 3.2 4.5l-1.5 4.5a2.3 2.3 0 0 1-3.8.9l-1.3-1.2H9.8l-1.3 1.2a2.3 2.3 0 0 1-3.8-.9l-1.5-4.5a3.4 3.4 0 0 1 3.2-4.5Z"/><path d="M8 11v4M6 13h4M16.7 12.2h.1M18.4 14h.1"/>',
    cubes: '<path d="m12 3 7 4-7 4-7-4 7-4Z"/><path d="m5 7 7 4 7-4M5 12l7 4 7-4M5 17l7 4 7-4"/>',
    archive: '<path d="M4 7h16v13H4z"/><path d="M3 4h18v3H3zM9 11h6"/>',
    speed: '<path d="M4.9 18a8 8 0 1 1 14.2 0"/><path d="m12 14 4.5-4.5M8 18h8"/>',
    rocket: '<path d="M14.5 5.5c2.2-2.2 4.6-2.4 5.4-2.3.1.8-.1 3.2-2.3 5.4l-4 4-3.4-.6-.6-3.4 4-4Z"/><path d="m9.7 10.3-3.2.5-2.4 2.4 4.1.8M13.7 14.3l-.5 3.2-2.4 2.4-.8-4.1M15.6 7.4h.1"/>',
    chunks: '<path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z"/><path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5"/>',
    memory: '<rect x="5" y="7" width="14" height="10" rx="2"/><path d="M8 10h8v4H8zM8 4v3M12 4v3M16 4v3M8 17v3M12 17v3M16 17v3M2 10h3M2 14h3M19 10h3M19 14h3"/>',
    settings: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10M8 4v6M16 14v6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    java: '<path d="M8 18h8M9 21h6M8.5 14.5h7l-.7 3.5H9.2l-.7-3.5Z"/><path d="M11 3c3 2-2 3.3 1 5.2M14 4.5c2 1.4-1.2 2.5.5 3.8"/>',
    layers: '<path d="m12 3 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4M4 17l8 4 8-4"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 20h14"/>',
    shield: '<path d="M12 3 19 6v5c0 4.4-2.7 7.8-7 10-4.3-2.2-7-5.6-7-10V6l7-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>'
  };
  return `<svg class="modal-svg-icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.check}</svg>`;
}

function createDownloadButton(packId, label, extraClass = "") {
  return `
    <button class="button button-primary download-ultimate ${extraClass}" type="button" data-download="${packId}" aria-label="${label}">
      <span class="download-fx" aria-hidden="true">
        <span class="download-plasma"></span>
        <span class="download-matrix"></span>
        <span class="download-sweep"></span>
        <span class="download-pulse-line"></span>
        <span class="download-particles">
          <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
        </span>
      </span>
      <span class="download-label">${label}</span>
      <span class="download-icon" aria-hidden="true">
        <span class="download-icon-orbit"></span>
        <svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 20h14"/></svg>
      </span>
    </button>
  `;
}

function createPackCard(pack) {
  const favorite = state.favorites.has(pack.id);
  const tagIcons = {
    Fabric: '<path d="M5 7h14v10H5z"/><path d="M8 4v3M12 4v3M16 4v3M8 17v3M12 17v3M16 17v3"/>',
    Client: '<rect x="4" y="5" width="16" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    "Maximum FPS": '<path d="M4.9 18a8 8 0 1 1 14.2 0"/><path d="m12 14 4.5-4.5M8 18h8"/>'
  };

  return `
    <article class="pack-card" data-pack-id="${pack.id}">
      <span class="pack-card-aura" aria-hidden="true"></span>
      <span class="pack-card-grid" aria-hidden="true"></span>
      <div class="pack-cover" style="--cover-bg:${pack.color}; --cube-a:${pack.cube[0]}; --cube-b:${pack.cube[1]}; --cube-c:${pack.cube[2]}">
        <span class="pack-badge"><i></i>${pack.badge}</span>
        <button class="favorite-button ${favorite ? "active" : ""}" type="button" data-favorite="${pack.id}" aria-label="${favorite ? "Odebrat z oblíbených" : "Přidat do oblíbených"}" aria-pressed="${favorite}">
          <span class="favorite-orbit" aria-hidden="true"></span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
        </button>
        <div class="cover-speed-lines"><i></i><i></i><i></i></div>
        <div class="cover-hud cover-hud-left" aria-hidden="true"><i></i><span>PERFORMANCE CORE</span></div>
        <div class="cover-hud cover-hud-right" aria-hidden="true"><span>MK // 01</span><i></i></div>
        <div class="cover-cube" aria-hidden="true">
          <span class="face-top"></span>
          <span class="face-left"></span>
          <span class="face-right"></span>
        </div>
        <div class="cover-data-strip" aria-hidden="true"><span><i></i> LIVE BUILD</span><b>FPS ENGINE</b></div>
      </div>
      <div class="pack-body">
        <div class="pack-title-row">
          <div class="pack-title-main">
            <span class="release-state"><i></i> STABLE RELEASE</span>
            <h3>${pack.name}</h3>
          </div>
          <span class="pack-version"><small>MINECRAFT</small>${pack.release}</span>
        </div>
        <p class="pack-description">${pack.description}</p>
        <div class="tag-row">
          ${pack.tags.map(tag => `<span class="tag"><svg viewBox="0 0 24 24" aria-hidden="true">${tagIcons[tag] || '<path d="m5 12 4 4L19 6"/>'}</svg>${tag}</span>`).join("")}
        </div>
        <div class="pack-stats">
          <span class="pack-stat" title="Celkový výkon">
            <svg viewBox="0 0 24 24"><path d="M4.9 18a8 8 0 1 1 14.2 0"/><path d="m12 14 4.5-4.5M8 18h8"/></svg>
            <small>VÝKON</small><strong>${pack.performance}</strong>
          </span>
          <span class="pack-stat" title="Počet modů">
            <svg viewBox="0 0 24 24"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>
            <small>MODŮ</small><strong>${pack.mods}</strong>
          </span>
          <span class="pack-stat" title="Maximální naměřené FPS v demo datech">
            <svg viewBox="0 0 24 24"><path d="M5 17a7 7 0 1 1 14 0"/><path d="m12 17 4-5"/></svg>
            <small>MAX FPS</small><strong>${pack.fpsLabel}</strong>
          </span>
        </div>
        <div class="pack-actions">
          ${createDownloadButton(pack.id, "Stáhnout Modpack", "download-button")}
          <button class="details-button" type="button" data-details="${pack.id}" aria-label="Zobrazit detail ${pack.name}" title="Detail modpacku">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

function getFilteredPacks() {
  const query = state.query.trim().toLocaleLowerCase("cs");

  let result = modpacks.filter(pack => {
    const searchable = `${pack.name} ${pack.description} ${pack.loader} ${pack.category} ${pack.tags.join(" ")}`.toLocaleLowerCase("cs");
    const queryMatch = !query || searchable.includes(query);
    const versionMatch = state.versions.size === 0 || pack.versions.some(version => state.versions.has(version));
    const loaderMatch = state.loaders.size === 0 || state.loaders.has(pack.loader);
    const categoryMatch = state.categories.size === 0 || state.categories.has(pack.category);
    return queryMatch && versionMatch && loaderMatch && categoryMatch;
  });

  const sorters = {
    featured: (a, b) => modpacks.indexOf(a) - modpacks.indexOf(b),
    downloads: (a, b) => b.downloads - a.downloads,
    fps: (a, b) => b.fps - a.fps,
    newest: (a, b) => new Date(b.updated) - new Date(a.updated),
    name: (a, b) => a.name.localeCompare(b.name, "cs")
  };

  return result.sort(sorters[state.sort]);
}

function renderPacks() {
  const filtered = getFilteredPacks();
  packGrid.innerHTML = filtered.map(createPackCard).join("");
  requestAnimationFrame(() => registerRevealElements(packGrid.querySelectorAll(".pack-card"), 90));
  resultCount.textContent = filtered.length;
  emptyState.hidden = filtered.length !== 0;
  packGrid.hidden = filtered.length === 0;
}

function updateFilterState(input) {
  const collection = input.name === "version"
    ? state.versions
    : input.name === "loader"
      ? state.loaders
      : state.categories;

  input.checked ? collection.add(input.value) : collection.delete(input.value);
  renderPacks();
}

function resetFilters() {
  state.query = "";
  state.versions.clear();
  state.loaders.clear();
  state.categories.clear();
  searchInput.value = "";
  document.querySelectorAll('.filters-panel input[type="checkbox"]').forEach(input => input.checked = false);
  renderPacks();
}

function openPackModal(pack) {
  const featureIcons = ["speed", "chunks", "rocket", "memory", "settings"];
  const requirementIcons = ["game", "memory", "java", "layers"];

  modalContent.innerHTML = `
    <div class="modal-hero" style="--cover-bg:${pack.color}">
      <span class="modal-hero-grid-lines" aria-hidden="true"></span>
      <span class="modal-hero-glow" aria-hidden="true"></span>
      <div class="modal-hero-layout">
        <div class="modal-hero-copy">
          <span class="modal-kicker">${modalIcon("verified")} MINEKUBE VERIFIED BUILD</span>
          <h2 id="modalTitle">${pack.shortName || pack.name}</h2>
          <p>${pack.category} <i></i> ${pack.loader} <i></i> Minecraft ${pack.release}</p>
          <div class="modal-hero-status">
            <span><b></b> Stabilní release</span>
            <span>Optimalizováno pro klienta</span>
          </div>
        </div>
        <div class="modal-power-core" aria-hidden="true">
          <span class="power-ring power-ring-one"></span>
          <span class="power-ring power-ring-two"></span>
          <span class="power-ring power-ring-three"></span>
          <span class="power-diamond"><i></i></span>
          <small>ULTRA</small>
        </div>
      </div>
    </div>

    <div class="modal-body">
      <div class="modal-stats" aria-label="Parametry modpacku">
        <article class="modal-stat-card">
          <span class="modal-stat-icon">${modalIcon("game")}</span>
          <div><small>VERZE HRY</small><strong>Minecraft ${pack.versions[0]}</strong></div>
        </article>
        <article class="modal-stat-card">
          <span class="modal-stat-icon">${modalIcon("cubes")}</span>
          <div><small>OBSAH BALÍČKU</small><strong>${pack.mods} optimalizačních modů</strong></div>
        </article>
        <article class="modal-stat-card">
          <span class="modal-stat-icon">${modalIcon("archive")}</span>
          <div><small>VELIKOST</small><strong>${pack.size}</strong></div>
        </article>
        <article class="modal-stat-card modal-stat-highlight">
          <span class="modal-stat-icon">${modalIcon("speed")}</span>
          <div><small>VÝKONOVÝ PROFIL</small><strong>${pack.performance} · Maximum FPS</strong></div>
        </article>
      </div>

      <div class="modal-description">
        <span class="modal-description-icon">${modalIcon("shield")}</span>
        <div>
          <small>PROVĚŘENÁ KONFIGURACE</small>
          <p>${pack.longDescription} Nastavení je připravené tak, aby poskytovalo vysoký výkon, rychlé načítání a stabilní průběh hry bez zbytečného nastavování.</p>
        </div>
      </div>

      <div class="modal-columns">
        <section class="modal-panel modal-panel-features">
          <header class="modal-panel-heading">
            <span>${modalIcon("rocket")}</span>
            <div><small>HLAVNÍ VÝHODY</small><h3>Co balíček nabízí</h3></div>
          </header>
          <ul class="modal-feature-list">
            ${pack.features.map((feature, index) => `
              <li>
                <span class="modal-list-icon">${modalIcon(featureIcons[index] || "check")}</span>
                <span>${feature}</span>
                <b>${modalIcon("check")}</b>
              </li>`).join("")}
          </ul>
        </section>

        <section class="modal-panel modal-panel-requirements">
          <header class="modal-panel-heading">
            <span>${modalIcon("settings")}</span>
            <div><small>RYCHLÝ START</small><h3>Požadavky a doporučení</h3></div>
          </header>
          <ul class="modal-feature-list">
            ${pack.requirements.map((item, index) => `
              <li>
                <span class="modal-list-icon">${modalIcon(requirementIcons[index] || "check")}</span>
                <span>${item}</span>
                <b>${modalIcon("check")}</b>
              </li>`).join("")}
          </ul>
        </section>
      </div>

      <div class="modal-download">
        <div class="modal-release-icon">${modalIcon("download")}</div>
        <div class="modal-release-copy">
          <span>AKTUÁLNÍ RELEASE</span>
          <strong>${pack.release} · Minecraft ${pack.versions[0]}</strong>
          <small>${pack.loader} build · ${pack.size} · připraveno ke stažení</small>
        </div>
        ${pack.downloadUrl ? `
        ${createDownloadButton(pack.id, "Stáhnout ZIP", "modal-download-button")}` : `
        <button class="button button-secondary" type="button" disabled>
          Zatím nedostupné
        </button>`}
      </div>
    </div>
  `;

  showModal();
}

function openInfoModal(type) {
  const content = {
    methodology: {
      title: "Metodika měření výkonu",
      text: "Pro důvěryhodné srovnání používej stejný svět, seed, pozici hráče, render distance, rozlišení, verzi Javy i ovladače. Každý test spusť několikrát, první průchod nepočítej a uváděj nejen průměrné FPS, ale také 1% low a frametime."
    },
    changelog: {
      title: "Changelog",
      text: "Tady může být seznam verzí, datum vydání, přidané a odebrané mody, změny konfigurace, známé chyby a pokyny pro bezpečný update."
    },
    compatibility: {
      title: "Kompatibilita",
      text: "Tady můžeš popsat podporované verze Minecraftu, loadery, doporučené verze Javy, kompatibilitu se shadery, resource packy a známé konflikty."
    },
    license: {
      title: "Licence a upozornění",
      text: "Před zveřejněním doplň vlastní licenční podmínky a zkontroluj oprávnění jednotlivých autorů modů k distribuci v modpacku."
    }
  }[type];

  modalContent.innerHTML = `
    <div class="modal-hero" style="--cover-bg:linear-gradient(135deg,#210623,#7c1194,#ff8500,#ffd84f)">
      <div><h2 id="modalTitle">${content.title}</h2></div>
    </div>
    <div class="modal-body">
      <p>${content.text}</p>
      <div class="modal-download">
        <div>
          <span>DEMONSTRAČNÍ OBSAH</span>
          <strong>Tento text uprav podle skutečného projektu.</strong>
        </div>
        <button class="button button-secondary" type="button" data-close-modal>Zavřít</button>
      </div>
    </div>
  `;
  showModal();
}

function showModal() {
  window.clearTimeout(modalCloseTimer);
  modalCloseTimer = null;
  lastModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  modalBackdrop.classList.remove("is-closing", "is-visible");
  modalClose.classList.remove("is-closing-trigger");
  modalBackdrop.hidden = false;
  document.body.classList.add("modal-open");

  // Dva snímky zajistí, že prohlížeč nejdřív vykreslí počáteční stav a až potom animaci.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modalBackdrop.classList.add("is-visible");
      modalClose.focus({ preventScroll: true });
    });
  });
}

function closeModal({ animateCloseButton = false } = {}) {
  if (modalBackdrop.hidden || modalBackdrop.classList.contains("is-closing")) return;

  window.clearTimeout(modalCloseTimer);
  modalBackdrop.classList.remove("is-visible");
  modalBackdrop.classList.add("is-closing");

  if (animateCloseButton) {
    modalClose.classList.remove("is-closing-trigger");
    void modalClose.offsetWidth;
    modalClose.classList.add("is-closing-trigger");
  }

  const finishClosing = () => {
    modalBackdrop.hidden = true;
    modalBackdrop.classList.remove("is-closing");
    modalClose.classList.remove("is-closing-trigger");
    document.body.classList.remove("modal-open");

    if (lastModalTrigger?.isConnected) {
      lastModalTrigger.focus({ preventScroll: true });
    }
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  modalCloseTimer = window.setTimeout(finishClosing, reducedMotion ? 20 : 430);
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2900);
}

function createFavoriteBurst(button, activating) {
  if (!button || prefersReducedMotion.matches) return;

  const burst = document.createElement("span");
  burst.className = `favorite-burst ${activating ? "is-love" : "is-unlove"}`;

  for (let index = 0; index < 10; index += 1) {
    const particle = document.createElement("i");
    particle.style.setProperty("--favorite-angle", `${index * 36 + Math.random() * 10 - 5}deg`);
    particle.style.setProperty("--favorite-distance", `${22 + Math.random() * 18}px`);
    particle.style.setProperty("--favorite-delay", `${Math.random() * 70}ms`);
    burst.appendChild(particle);
  }

  button.appendChild(burst);
  window.setTimeout(() => burst.remove(), 760);
}

function toggleFavorite(id, button) {
  const activating = !state.favorites.has(id);

  if (activating) {
    state.favorites.add(id);
    showToast("Modpack byl uložen do oblíbených.");
  } else {
    state.favorites.delete(id);
    showToast("Modpack byl odebrán z oblíbených.");
  }

  safeStorage.set("minekube-favorites", JSON.stringify([...state.favorites]));

  if (button) {
    button.classList.toggle("active", activating);
    button.classList.remove("is-popping", "is-unpopping");
    void button.offsetWidth;
    button.classList.add(activating ? "is-popping" : "is-unpopping");
    button.setAttribute("aria-pressed", String(activating));
    button.setAttribute("aria-label", activating ? "Odebrat z oblíbených" : "Přidat do oblíbených");
    createFavoriteBurst(button, activating);
    window.setTimeout(() => button.classList.remove("is-popping", "is-unpopping"), 720);
  }
}

function playDownloadAnimation(button, event) {
  if (!button) return;

  button.classList.remove("download-animating");
  void button.offsetWidth;
  button.classList.add("download-animating");

  const rect = button.getBoundingClientRect();
  const hasPointerPosition = event && Number.isFinite(event.clientX) && Number.isFinite(event.clientY) && (event.clientX || event.clientY);
  const x = hasPointerPosition ? event.clientX : rect.left + rect.width / 2;
  const y = hasPointerPosition ? event.clientY : rect.top + rect.height / 2;

  const burst = document.createElement("span");
  burst.className = "download-click-burst";
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;

  for (let index = 0; index < 3; index += 1) {
    const ring = document.createElement("span");
    ring.className = "download-burst-ring";
    ring.style.setProperty("--ring-delay", `${index * 70}ms`);
    ring.style.setProperty("--ring-scale", `${6.8 + index * 2.1}`);
    burst.appendChild(ring);
  }

  const sparkCount = 24;
  for (let index = 0; index < sparkCount; index += 1) {
    const spark = document.createElement("i");
    const angle = (360 / sparkCount) * index + (Math.random() * 11 - 5.5);
    spark.style.setProperty("--spark-angle", `${angle}deg`);
    spark.style.setProperty("--spark-distance", `${62 + Math.random() * 68}px`);
    spark.style.setProperty("--spark-length", `${11 + Math.random() * 20}px`);
    spark.style.setProperty("--spark-delay", `${Math.random() * 90}ms`);
    spark.style.setProperty("--spark-width", `${2 + Math.random() * 2}px`);
    burst.appendChild(spark);
  }

  const fragmentCount = 12;
  for (let index = 0; index < fragmentCount; index += 1) {
    const fragment = document.createElement("b");
    const angle = (360 / fragmentCount) * index + (Math.random() * 22 - 11);
    fragment.style.setProperty("--fragment-angle", `${angle}deg`);
    fragment.style.setProperty("--fragment-distance", `${46 + Math.random() * 70}px`);
    fragment.style.setProperty("--fragment-spin", `${180 + Math.random() * 480}deg`);
    fragment.style.setProperty("--fragment-delay", `${20 + Math.random() * 100}ms`);
    burst.appendChild(fragment);
  }

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1150);
  window.setTimeout(() => button.classList.remove("download-animating"), 980);
}

async function triggerDownload(button, pack, event) {
  if (!button || button.getAttribute("aria-busy") === "true") return;

  button.setAttribute("aria-busy", "true");
  playDownloadAnimation(button, event);

  await new Promise(resolve => window.setTimeout(resolve, 620));

  try {
    await demoDownload(pack);
  } finally {
    button.removeAttribute("aria-busy");
  }
}

async function demoDownload(pack) {
  if (!pack?.downloadUrl) {
    showToast("Soubor ke stažení zatím není nastavený.");
    return;
  }

  showToast("Spouštím přímé stahování…");

  // Přímý odkaz míří na soubor v GitHub Release. GitHub ho vrátí
  // jako přílohu, takže se neotevře stránka projektu ani Game Jolt.
  const link = document.createElement("a");
  link.href = pack.downloadUrl;
  link.download = pack.downloadFileName || "";
  link.target = "_self";
  link.rel = "noopener noreferrer";
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();

  showToast("Stahování bylo zahájeno.");
}


searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  renderPacks();
});

document.querySelectorAll('.filters-panel input[type="checkbox"]').forEach(input => {
  input.addEventListener("change", () => updateFilterState(input));
});

sortSelect.addEventListener("change", event => {
  state.sort = event.target.value;
  renderPacks();
});

document.getElementById("resetFilters").addEventListener("click", resetFilters);
document.getElementById("emptyReset").addEventListener("click", resetFilters);

filterToggle.addEventListener("click", () => {
  filtersPanel.classList.toggle("mobile-open");
  filterToggle.setAttribute("aria-expanded", filtersPanel.classList.contains("mobile-open"));
});

packGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const detailsButton = event.target.closest("[data-details]");
  const downloadButton = event.target.closest("[data-download]");

  if (favoriteButton) toggleFavorite(favoriteButton.dataset.favorite, favoriteButton);
  if (detailsButton) {
    detailsButton.classList.remove("is-activating");
    void detailsButton.offsetWidth;
    detailsButton.classList.add("is-activating");
    window.setTimeout(() => detailsButton.classList.remove("is-activating"), 420);
    openPackModal(modpacks.find(pack => pack.id === detailsButton.dataset.details));
  }
  if (downloadButton) triggerDownload(downloadButton, modpacks.find(pack => pack.id === downloadButton.dataset.download), event);
});

modalContent.addEventListener("click", event => {
  const downloadButton = event.target.closest("[data-download]");
  const closeButton = event.target.closest("[data-close-modal]");
  if (downloadButton) triggerDownload(downloadButton, modpacks.find(pack => pack.id === downloadButton.dataset.download), event);
  if (closeButton) closeModal();
});

modalClose.addEventListener("click", () => closeModal({ animateCloseButton: true }));
modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modalBackdrop.hidden) closeModal();
});

document.getElementById("methodologyButton").addEventListener("click", () => openInfoModal("methodology"));
document.querySelectorAll("[data-dialog]").forEach(button => {
  button.addEventListener("click", () => openInfoModal(button.dataset.dialog));
});

const menuButton = document.getElementById("menuButton");
const mobileNav = document.getElementById("mobileNav");

menuButton.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuButton.classList.toggle("active", isOpen);
  menuButton.setAttribute("aria-expanded", isOpen);
});

mobileNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
  });
});


function initializeUltimateDownloadButtons() {
  const precisePointer = window.matchMedia("(pointer: fine)");
  if (!precisePointer.matches || prefersReducedMotion.matches) return;

  let activeButton = null;
  let frame = 0;
  let pendingEvent = null;

  const updateButton = () => {
    frame = 0;
    if (!activeButton || !pendingEvent || !activeButton.isConnected) return;

    const rect = activeButton.getBoundingClientRect();
    const px = Math.min(Math.max((pendingEvent.clientX - rect.left) / rect.width, 0), 1);
    const py = Math.min(Math.max((pendingEvent.clientY - rect.top) / rect.height, 0), 1);
    const nx = px - .5;
    const ny = py - .5;

    activeButton.style.setProperty("--pointer-x", `${px * 100}%`);
    activeButton.style.setProperty("--pointer-y", `${py * 100}%`);
    activeButton.style.setProperty("--tilt-x", `${ny * -7}deg`);
    activeButton.style.setProperty("--tilt-y", `${nx * 9}deg`);
    activeButton.style.setProperty("--magnet-x", `${nx * 5}px`);
    activeButton.style.setProperty("--magnet-y", `${ny * 3}px`);
  };

  document.addEventListener("pointermove", event => {
    const button = event.target.closest?.(".download-ultimate");
    if (!button) return;

    activeButton = button;
    pendingEvent = event;
    button.classList.add("is-pointer-active");

    if (!frame) frame = requestAnimationFrame(updateButton);
  });

  document.addEventListener("pointerout", event => {
    const button = event.target.closest?.(".download-ultimate");
    if (!button || button.contains(event.relatedTarget)) return;

    button.classList.remove("is-pointer-active");
    button.style.setProperty("--pointer-x", "50%");
    button.style.setProperty("--pointer-y", "50%");
    button.style.setProperty("--tilt-x", "0deg");
    button.style.setProperty("--tilt-y", "0deg");
    button.style.setProperty("--magnet-x", "0px");
    button.style.setProperty("--magnet-y", "0px");

    if (activeButton === button) {
      activeButton = null;
      pendingEvent = null;
    }
  });
}

const themeToggle = document.getElementById("themeToggle");
const savedTheme = safeStorage.get("minekube-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = current;
  safeStorage.set("minekube-theme", current);
  showToast(current === "light" ? "Zapnut světlý motiv." : "Zapnut tmavý motiv.");
});

const siteHeader = document.querySelector(".site-header");
const scrollProgress = document.querySelector("#scrollProgress span");
const benchmarkSection = document.querySelector(".benchmark-section");
let scrollFramePending = false;

function syncScrollExperience() {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

  siteHeader?.classList.toggle("scrolled", window.scrollY > 16);
  scrollProgress?.style.setProperty("--scroll-progress", progress.toFixed(4));

  if (benchmarkSection) {
    const rect = benchmarkSection.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const sectionCenter = rect.top + rect.height / 2;
    const normalized = Math.max(-1, Math.min(1, (sectionCenter - viewportCenter) / window.innerHeight));
    benchmarkSection.style.setProperty("--benchmark-parallax", `${normalized * 34}px`);
  }

  scrollFramePending = false;
}

window.addEventListener("scroll", () => {
  if (scrollFramePending) return;
  scrollFramePending = true;
  requestAnimationFrame(syncScrollExperience);
}, { passive: true });

window.addEventListener("resize", syncScrollExperience, { passive: true });

const counter = document.querySelector("[data-counter]");
const performanceCard = document.querySelector(".performance-card");
const counterObserver = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  const target = Number(counter.dataset.counter);
  const start = performance.now();
  const duration = 1100;

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
  counterObserver.disconnect();
}, { threshold: .55 });

counterObserver.observe(performanceCard);

// Jemný 3D parallax výkonového HUDu. Funguje pouze s přesným ukazatelem.
if (window.matchMedia("(pointer: fine)").matches) {
  performanceCard.addEventListener("pointermove", event => {
    const rect = performanceCard.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    performanceCard.style.setProperty("--ry", `${px * 7}deg`);
    performanceCard.style.setProperty("--rx", `${py * -5}deg`);
  });

  performanceCard.addEventListener("pointerleave", () => {
    performanceCard.style.setProperty("--ry", "-4deg");
    performanceCard.style.setProperty("--rx", "2deg");
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const benchmarkBoard = document.querySelector(".benchmark-board");

function animateNumericValue(element, duration = 1350) {
  const target = Number(element.dataset.count || 0);
  const suffix = element.dataset.suffix || "";

  if (prefersReducedMotion.matches) {
    element.textContent = `${target}${suffix}`;
    return;
  }

  const start = performance.now();
  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

if (benchmarkBoard) {
  const revealBenchmark = () => {
    benchmarkBoard.classList.add("is-visible");
    benchmarkBoard.querySelectorAll("[data-count]").forEach((element, index) => {
      window.setTimeout(() => animateNumericValue(element, index < 2 ? 1450 : 1050), 300 + index * 115);
    });
  };

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealBenchmark();
  } else {
    const benchmarkObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      revealBenchmark();
      benchmarkObserver.disconnect();
    }, { threshold: .3 });

    benchmarkObserver.observe(benchmarkBoard);
  }

  if (window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion.matches) {
    benchmarkBoard.addEventListener("pointermove", event => {
      const rect = benchmarkBoard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      benchmarkBoard.style.setProperty("--by", `${x * 3.8}deg`);
      benchmarkBoard.style.setProperty("--bx", `${y * -3}deg`);
    });

    benchmarkBoard.addEventListener("pointerleave", () => {
      benchmarkBoard.style.setProperty("--by", "0deg");
      benchmarkBoard.style.setProperty("--bx", "0deg");
    });
  }
}

let revealObserver = null;

function registerRevealElements(elements, baseDelay = 65) {
  const list = [...elements].filter(element => !element.classList.contains("scroll-reveal"));
  if (!list.length) return;

  list.forEach((element, index) => {
    element.classList.add("scroll-reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index, 6) * baseDelay}ms`);

    if (element.matches(".benchmark-copy, .filters-panel, .about-copy")) {
      element.style.setProperty("--reveal-x", "-28px");
      element.style.setProperty("--reveal-y", "0px");
    } else if (element.matches(".about-emblem")) {
      element.style.setProperty("--reveal-x", "28px");
      element.style.setProperty("--reveal-y", "0px");
    }

    if (prefersReducedMotion.matches || !revealObserver) {
      element.classList.add("is-revealed");
    } else {
      revealObserver.observe(element);
    }
  });
}

function initializeScrollExperience() {
  if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: .12,
      rootMargin: "0px 0px -7% 0px"
    });
  }

  const revealGroups = [
    [document.querySelectorAll(".trust-items > *"), 55],
    [document.querySelectorAll(".section-heading"), 0],
    [document.querySelectorAll(".filters-panel, .catalog-toolbar"), 80],
    [document.querySelectorAll(".pack-card"), 90],
    [document.querySelectorAll(".benchmark-copy"), 0],
    [document.querySelectorAll(".steps-grid .step-card"), 105],
    [document.querySelectorAll(".about-copy, .about-emblem"), 110],
    [document.querySelectorAll(".cta-card"), 0],
    [document.querySelectorAll(".footer-grid > *"), 70]
  ];

  revealGroups.forEach(([elements, delay]) => registerRevealElements(elements, delay));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  const sectionLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]')];
  const observedSections = [...new Set(sectionLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean))];

  if ("IntersectionObserver" in window) {
    const navigationObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      sectionLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0, .1, .35] });

    observedSections.forEach(section => navigationObserver.observe(section));
  }

  syncScrollExperience();
}


function initializeCustomSort() {
  const wrapper = sortSelect?.closest(".sort-select");
  if (!wrapper || wrapper.querySelector(".sort-control")) return;

  sortSelect.classList.add("native-sort-select");

  const control = document.createElement("div");
  control.className = "sort-control";
  control.innerHTML = `
    <button class="sort-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
      <span class="sort-trigger-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 6h12M4 6h.01M8 12h9M4 12h.01M8 18h6M4 18h.01"/></svg></span>
      <span class="sort-trigger-copy"><small>AKTUÁLNÍ ŘAZENÍ</small><strong>${sortSelect.options[sortSelect.selectedIndex].text}</strong></span>
      <span class="sort-trigger-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></svg></span>
    </button>
    <div class="sort-menu" role="listbox" aria-label="Řazení modpacků"></div>
  `;

  const menu = control.querySelector(".sort-menu");
  [...sortSelect.options].forEach((option, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "sort-option";
    item.dataset.value = option.value;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", String(option.selected));
    item.innerHTML = `<span class="sort-option-index">0${index + 1}</span><span>${option.text}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>`;
    menu.appendChild(item);
  });

  wrapper.appendChild(control);
  const trigger = control.querySelector(".sort-trigger");
  const currentLabel = control.querySelector(".sort-trigger-copy strong");

  const close = () => {
    control.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };

  trigger.addEventListener("click", event => {
    event.preventDefault();
    const isOpen = control.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", event => {
    const optionButton = event.target.closest(".sort-option");
    if (!optionButton) return;
    sortSelect.value = optionButton.dataset.value;
    sortSelect.dispatchEvent(new Event("change", { bubbles: true }));
    currentLabel.textContent = sortSelect.options[sortSelect.selectedIndex].text;
    menu.querySelectorAll(".sort-option").forEach(item => item.setAttribute("aria-selected", String(item === optionButton)));
    close();
  });

  document.addEventListener("click", event => {
    if (!control.contains(event.target)) close();
  });

  control.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      close();
      trigger.focus();
    }
  });
}

function initializeEpicSurfaceInteractions() {
  if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion.matches) return;

  const applyTilt = (element, event, strength = 5) => {
    const rect = element.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
    element.style.setProperty("--surface-x", `${x * 100}%`);
    element.style.setProperty("--surface-y", `${y * 100}%`);
    element.style.setProperty("--surface-ry", `${(x - .5) * strength}deg`);
    element.style.setProperty("--surface-rx", `${(y - .5) * -strength}deg`);
  };

  const resetTilt = element => {
    element.style.setProperty("--surface-x", "50%");
    element.style.setProperty("--surface-y", "50%");
    element.style.setProperty("--surface-ry", "0deg");
    element.style.setProperty("--surface-rx", "0deg");
  };

  packGrid.addEventListener("pointermove", event => {
    const card = event.target.closest(".pack-card");
    if (card) applyTilt(card, event, 5.5);
  });
  packGrid.addEventListener("pointerout", event => {
    const card = event.target.closest(".pack-card");
    if (card && !card.contains(event.relatedTarget)) resetTilt(card);
  });

  document.querySelectorAll(".step-card").forEach(card => {
    card.addEventListener("pointermove", event => applyTilt(card, event, 4));
    card.addEventListener("pointerleave", () => resetTilt(card));
  });

  const aboutCard = document.querySelector(".about-card");
  aboutCard?.addEventListener("pointermove", event => applyTilt(aboutCard, event, 2.5));
  aboutCard?.addEventListener("pointerleave", () => resetTilt(aboutCard));

  const filters = document.querySelector(".filters-panel");
  filters?.addEventListener("pointermove", event => applyTilt(filters, event, 0));
}

function initializeSearchShortcut() {
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
}

document.getElementById("currentYear").textContent = new Date().getFullYear();

renderPacks();
initializeCustomSort();
initializeUltimateDownloadButtons();
initializeEpicSurfaceInteractions();
initializeSearchShortcut();
initializeScrollExperience();
