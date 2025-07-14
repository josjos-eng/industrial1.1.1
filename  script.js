/* -------------------------------------------
   Malla Curricular Dinámica – Plan 122
   Autor: IA + YOU ✨
--------------------------------------------*/

const STORAGE_KEY = "malla122_ru_"; // base; se concatena RU
const grid = document.getElementById("grid");
const loadBtn = document.getElementById("loadBtn");
const ruInput = document.getElementById("ruInput");
const cardTpl = document.getElementById("cardTpl").content;
let materias = [];
let currentRU = null;

// 1. Carga JSON
fetch("materias.json")
  .then(r => r.json())
  .then(data => { materias = data; })
  .catch(console.error);

// 2. Evento Login / Cambio RU
loadBtn.addEventListener("click", () => {
  const ru = ruInput.value.trim();
  if (!ru) { alert("Introduce un RU."); return; }
  currentRU = ru;
  render();
});

// 3. Renderizado principal
function render(){
  if(!currentRU){return;}
  grid.classList.remove("hidden");
  grid.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY+currentRU) || "{}");
  materias.forEach(mat => {
    const node = cardTpl.cloneNode(true);
    const card = node.querySelector(".card");
    const state = saved[mat.codigo] || "pending";
    card.classList.remove("approved","failed","pending");
    card.classList.add(state);
    card.querySelector(".name").textContent = mat.nombre;
    card.querySelector(".sem").textContent = `Semestre ${mat.semestre}`;
    card.addEventListener("click", ()=>toggleState(mat.codigo, card));
    grid.appendChild(node);
  });
}

// 4. Ciclo de estados Pending → Approved → Failed → Pending
function toggleState(cod, card){
  const order = ["pending","approved","failed"];
  const next = order[(order.indexOf(card.classList[1])+1)%order.length];
  card.classList.remove(...order);
  card.classList.add(next);
  saveState(cod,next);
}

function saveState(cod,state){
  const key = STORAGE_KEY+currentRU;
  const saved = JSON.parse(localStorage.getItem(key) || "{}");
  saved[cod]=state;
  localStorage.setItem(key, JSON.stringify(saved));
}
