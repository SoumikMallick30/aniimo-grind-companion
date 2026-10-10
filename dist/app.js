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

  $("#zoneMap").className = `zone-map ${state.mode}`;
  $("#decorScore").textContent = state.mode === "bare" ? "0% decor reserve" : "8% decor reserve";
  $("#modeNoteTitle").textContent = state.mode === "bare" ? "Protect every tile" : "Frame, don’t fragment";
  $("#modeNote").textContent = state.mode === "bare"
    ? "The no-decoration variant reserves the full concept map for functional placement and access lanes."
    : "The decorated variant adds a slim perimeter buffer while keeping the five production zones intact.";
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

