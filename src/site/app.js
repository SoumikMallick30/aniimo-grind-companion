const state = { rv: 8, mode: "bare", data: null };
const $ = (selector) => document.querySelector(selector);

async function loadData() {
  const response = await fetch("data/game-data.json");
  if (!response.ok) throw new Error("Unable to load game data");
  state.data = await response.json();
  $("#rvRange").max = state.data.meta.currentMaxRv;
  render();
}

function render() {
  const level = state.data.levels.find((item) => item.rvLevel === state.rv);
  const complete = level?.zones.farmland != null;
  $("#rvReadout").textContent = String(state.rv).padStart(2, "0");
  $("#layoutTitle").textContent = `RV${state.rv} · ${state.mode === "bare" ? "No Decoration" : "With Decoration"}`;
  $("#pending").hidden = complete;
  $("#layoutContent").hidden = !complete;
  const badge = $("#dataBadge");
  badge.textContent = level.verification === "verified" ? "VERIFIED CORE" : level.verification === "community" ? "COMMUNITY DATA" : "UNVERIFIED";
  badge.className = `confidence ${level.verification}`;
  if (!complete) $("#pendingTitle").textContent = `RV${state.rv} is ready for verified data.`;

  if (complete) {
    const label = level.verification === "verified" ? "verified count" : "community count";
    const values = [
      ["farm", level.zones.farmland],
      ["wood", level.zones.woodland],
      ["mine", level.zones.mines]
    ];
    for (const [key, value] of values) {
      $(`#${key}Count`).textContent = String(value).padStart(2, "0");
      $(`#${key}Confidence`).textContent = label;
    }
    $("#mapFarm").textContent = `${level.zones.farmland} plots`;
    $("#mapWood").textContent = `${level.zones.woodland} plots`;
    $("#mapMine").textContent = `${level.zones.mines} plots`;
  }

  renderWorkforce(level);

  $("#zoneMap").className = `zone-map ${state.mode}`;
  $("#decorScore").textContent = state.mode === "bare" ? "0% decor reserve" : "8% decor reserve";
  $("#modeNoteTitle").textContent = state.mode === "bare" ? "Protect every tile" : "Frame, don’t fragment";
  $("#modeNote").textContent = state.mode === "bare"
    ? "The no-decoration variant reserves the full concept map for functional placement and access lanes."
    : "The decorated variant adds a slim perimeter buffer while keeping the five production zones intact.";
}

function renderWorkforce(level) {
  const guidance = state.data.meta.workforceGuidance;
  const cap = level.productionCrew;
  $("#workforceTitle").textContent = `RV${state.rv} Aniimo crew`;
  $("#aniimoCap").textContent = String(cap).padStart(2, "0");
  $("#capNote").textContent = cap === 0
    ? "No active production crew in the level-one plan."
    : `Aniimo assigned by the production-first RV${state.rv} suggested layout.`;

  const unlocked = new Set();
  if (state.rv >= 2) guidance.fieldAbilities.forEach((item) => unlocked.add(item));
  if (state.rv >= 3) ["Artisanship", "Leisure"].forEach((item) => unlocked.add(item));
  if (state.rv >= 4) ["Fire", "Wind"].forEach((item) => unlocked.add(item));
  if (state.rv >= 6) unlocked.add("Perfumery");
  if (state.rv >= 10) ["Ice", "Light"].forEach((item) => unlocked.add(item));
  if (state.rv >= 12) unlocked.add("Lightning");
  const abilities = [...guidance.fieldAbilities, ...guidance.facilityAbilities];
  $("#abilityChips").innerHTML = abilities.map((name) => {
    const kind = guidance.fieldAbilities.includes(name) ? "field" : "facility";
    return `<span class="ability-chip ${kind} ${unlocked.has(name) ? "on" : "off"}">${name}</span>`;
  }).join("");

  $("#personalityGrid").innerHTML = guidance.personalities.map((item) =>
    `<article><b>${item.code}</b><div><strong>${item.name}</strong><span>${item.facilities}</span></div></article>`
  ).join("");
}

$("#rvRange").addEventListener("input", (event) => { state.rv = Number(event.target.value); render(); });
document.querySelectorAll(".mode").forEach((button) => button.addEventListener("click", () => {
  state.mode = button.dataset.mode;
  document.querySelectorAll(".mode").forEach((item) => item.classList.toggle("active", item === button));
  render();
}));
$("#returnRv8").addEventListener("click", () => { state.rv = 8; $("#rvRange").value = 8; render(); });

loadData().catch((error) => {
  $("#pending").hidden = false;
  $("#pendingTitle").textContent = error.message;
  $("#layoutContent").hidden = true;
});

