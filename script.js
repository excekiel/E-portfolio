const names = ["Excekiel Dote", "Future Web Developer"];
let ni = 0, ci = 0, deleting = false;
const el = document.getElementById("typed-name");

function type() {
  const word = names[ni];
  el.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);
  let delay = deleting ? 60 : 100;
  if (!deleting && ci === word.length) { delay = 1800; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; ni = (ni + 1) % names.length; delay = 400; }
  setTimeout(type, delay);
}
type();

document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("open");
});
document.querySelectorAll("#nav-links a").forEach(a =>
  a.addEventListener("click", () => document.getElementById("nav-links").classList.remove("open"))
);

document.getElementById("more-about").addEventListener("click", function () {
  const extra = document.getElementById("extra-about");
  const show = extra.classList.toggle("hidden");
  this.textContent = show ? "Read More" : "Read Less";
});

document.getElementById("dl-cv").addEventListener("click", e => {
  e.preventDefault();
  alert("CV download will be available soon!");
});

const fills = document.querySelectorAll(".fill");
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.width = el.dataset.w + "%";
      barObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });
fills.forEach(f => barObserver.observe(f));

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("fname").value.trim();
  const email = document.getElementById("femail").value.trim();
  const msg = document.getElementById("fmsg").value.trim();
  let valid = true;

  document.getElementById("err-name").textContent = "";
  document.getElementById("err-email").textContent = "";
  document.getElementById("err-msg").textContent = "";
  document.getElementById("form-success").classList.add("hidden");

  if (!name) { document.getElementById("err-name").textContent = "Name is required."; valid = false; }
  if (!email || !/\S+@\S+\.\S+/.test(email)) { document.getElementById("err-email").textContent = "Valid email required."; valid = false; }
  if (!msg) { document.getElementById("err-msg").textContent = "Message is required."; valid = false; }

  if (valid) {
    document.getElementById("form-success").classList.remove("hidden");
    this.reset();
  }
});

const overlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");

const modals = {
  thermo: `
    <h3>🌡️ Thermometer App</h3>
    <p>Enter a Celsius value to convert:</p>
    <div class="thermo-wrap">
      <input type="number" id="c-input" placeholder="Enter °C" oninput="convertTemp()" />
      <div class="thermo-results">
        <div class="thermo-card"><div class="label">Celsius</div><div class="val" id="r-c">—</div></div>
        <div class="thermo-card"><div class="label">Fahrenheit</div><div class="val" id="r-f">—</div></div>
        <div class="thermo-card"><div class="label">Kelvin</div><div class="val" id="r-k">—</div></div>
      </div>
    </div>`,

  notepad: `
    <h3>📝 Notepad</h3>
    <div class="notepad-wrap">
      <textarea id="note-area" placeholder="Start typing..." oninput="updateNoteCount()"></textarea>
      <div class="notepad-meta">Characters: <span id="note-count">0</span></div>
      <div class="notepad-btns">
        <button class="btn small" onclick="saveNote()">Save</button>
        <button class="btn small" onclick="loadNote()">Load</button>
        <button class="btn small" onclick="clearNote()">Clear</button>
      </div>
    </div>`,

  calc: `
    <h3>🔢 Calculator</h3>
    <div class="calc-wrap">
      <div class="calc-sub" id="calc-sub"></div>
      <div class="calc-display" id="calc-display">0</div>
      <div class="calc-btns">
        <button class="op" onclick="calcInput('C')">C</button>
        <button class="op" onclick="calcInput('±')">±</button>
        <button class="op" onclick="calcInput('%')">%</button>
        <button class="op" onclick="calcInput('/')">÷</button>
        <button onclick="calcInput('7')">7</button>
        <button onclick="calcInput('8')">8</button>
        <button onclick="calcInput('9')">9</button>
        <button class="op" onclick="calcInput('*')">×</button>
        <button onclick="calcInput('4')">4</button>
        <button onclick="calcInput('5')">5</button>
        <button onclick="calcInput('6')">6</button>
        <button class="op" onclick="calcInput('-')">−</button>
        <button onclick="calcInput('1')">1</button>
        <button onclick="calcInput('2')">2</button>
        <button onclick="calcInput('3')">3</button>
        <button class="op" onclick="calcInput('+')">+</button>
        <button onclick="calcInput('0')" class="span2">0</button>
        <button onclick="calcInput('.')">.</button>
        <button class="eq" onclick="calcInput('=')">=</button>
      </div>
    </div>`,

  rps: `
    <h3>✊ Rock Paper Scissors</h3>
    <div class="rps-wrap">
      <p style="color:var(--muted);font-size:.85rem">Pick your move:</p>
      <div class="rps-choices">
        <button class="rps-btn" onclick="playRPS('rock')" title="Rock">✊</button>
        <button class="rps-btn" onclick="playRPS('paper')" title="Paper">✋</button>
        <button class="rps-btn" onclick="playRPS('scissors')" title="Scissors">✌️</button>
      </div>
      <div class="rps-result" id="rps-result">Choose to start!</div>
      <div class="rps-score" id="rps-score">Wins: 0 | Losses: 0 | Draws: 0</div>
      <br><button class="btn small" onclick="resetRPS()">Reset Score</button>
    </div>`
};

function openModal(key) {
  modalContent.innerHTML = modals[key];
  overlay.classList.remove("hidden");

  if (key === "notepad") {
    const saved = localStorage.getItem("portfolio-note");
    if (saved) document.getElementById("note-area").value = saved;
    updateNoteCount();
  }
  if (key === "calc") resetCalc();
}

document.getElementById("close-modal").addEventListener("click", () => overlay.classList.add("hidden"));
overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.add("hidden"); });

window.convertTemp = function () {
  const c = parseFloat(document.getElementById("c-input").value);
  if (isNaN(c)) { ["r-c","r-f","r-k"].forEach(id => document.getElementById(id).textContent = "—"); return; }
  document.getElementById("r-c").textContent = c.toFixed(2) + "°";
  document.getElementById("r-f").textContent = (c * 9/5 + 32).toFixed(2) + "°";
  document.getElementById("r-k").textContent = (c + 273.15).toFixed(2) + "°";
};

window.updateNoteCount = function () {
  const t = document.getElementById("note-area").value;
  document.getElementById("note-count").textContent = t.length;
};
window.saveNote = function () {
  localStorage.setItem("portfolio-note", document.getElementById("note-area").value);
  alert("Note saved!");
};
window.loadNote = function () {
  const n = localStorage.getItem("portfolio-note");
  if (n) { document.getElementById("note-area").value = n; updateNoteCount(); }
  else alert("No saved note found.");
};
window.clearNote = function () {
  document.getElementById("note-area").value = "";
  updateNoteCount();
};

let calcVal = "0", calcPrev = "", calcOp = "", calcReset = false;

function resetCalc() { calcVal = "0"; calcPrev = ""; calcOp = ""; calcReset = false; updateCalcDisplay(); }

function updateCalcDisplay() {
  const d = document.getElementById("calc-display");
  const s = document.getElementById("calc-sub");
  if (d) d.textContent = calcVal;
  if (s) s.textContent = calcOp ? `${calcPrev} ${calcOp}` : "";
}

window.calcInput = function (v) {
  if (v === "C") { resetCalc(); return; }
  if (v === "±") { calcVal = String(-parseFloat(calcVal)); updateCalcDisplay(); return; }
  if (v === "%") { calcVal = String(parseFloat(calcVal) / 100); updateCalcDisplay(); return; }

  if (["+","-","*","/"].includes(v)) {
    calcPrev = calcVal; calcOp = v; calcReset = true; updateCalcDisplay(); return;
  }

  if (v === "=") {
    if (!calcOp) return;
    const a = parseFloat(calcPrev), b = parseFloat(calcVal);
    let res;
    if (calcOp === "+") res = a + b;
    else if (calcOp === "-") res = a - b;
    else if (calcOp === "*") res = a * b;
    else if (calcOp === "/") res = b !== 0 ? a / b : "Err";
    calcVal = String(parseFloat(res.toFixed(10)));
    calcOp = ""; calcPrev = ""; calcReset = false;
    updateCalcDisplay(); return;
  }

  if (v === ".") {
    if (calcReset) { calcVal = "0."; calcReset = false; }
    else if (!calcVal.includes(".")) calcVal += ".";
    updateCalcDisplay(); return;
  }

  if (calcReset || calcVal === "0") { calcVal = v; calcReset = false; }
  else calcVal += v;
  if (calcVal.length > 12) calcVal = calcVal.slice(0, 12);
  updateCalcDisplay();
};

let rpsW = 0, rpsL = 0, rpsD = 0;
const rpsMoves = ["rock","paper","scissors"];
const rpsEmoji = { rock:"✊", paper:"✋", scissors:"✌️" };

window.playRPS = function (player) {
  const cpu = rpsMoves[Math.floor(Math.random() * 3)];
  let outcome;
  if (player === cpu) { outcome = "Draw!"; rpsD++; }
  else if ((player==="rock"&&cpu==="scissors")||(player==="paper"&&cpu==="rock")||(player==="scissors"&&cpu==="paper"))
    { outcome = "You Win! 🎉"; rpsW++; }
  else { outcome = "You Lose! 😅"; rpsL++; }
  document.getElementById("rps-result").textContent =
    `You: ${rpsEmoji[player]}  CPU: ${rpsEmoji[cpu]}  →  ${outcome}`;
  document.getElementById("rps-score").textContent =
    `Wins: ${rpsW} | Losses: ${rpsL} | Draws: ${rpsD}`;
};

window.resetRPS = function () {
  rpsW = 0; rpsL = 0; rpsD = 0;
  document.getElementById("rps-result").textContent = "Choose to start!";
  document.getElementById("rps-score").textContent = "Wins: 0 | Losses: 0 | Draws: 0";
};