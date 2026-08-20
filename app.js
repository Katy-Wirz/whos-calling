"use strict";

const scenarios = [
  {
    id: "skeptiker",
    title: "Der skeptische Geschäftsführer",
    short: "Direkter Entscheider · Maschinenbau",
    level: "Einsteiger",
    prospect: { name: "Martin Keller", initials: "MK", role: "Geschäftsführer · Keller Werktechnik" },
    opening: "Keller, guten Tag?",
    prompts: [
      "Stelle dich vor und nenne einen konkreten Anlass.",
      "Finde mit einer offenen Frage heraus, wie der Betrieb heute Neukunden gewinnt.",
      "Nimm den Zeit-Einwand auf, ohne zu argumentieren. Stelle dann eine kurze Frage.",
      "Schlage einen kleinen, konkreten nächsten Schritt vor."
    ],
    turns: [
      { fallback: "Ja, guten Tag. Worum geht es denn genau?", branches: [{ words: ["empfehlung", "website", "neukunden"], text: "Neukunden sind natürlich ein Thema. Was genau meinen Sie?" }] },
      { fallback: "Das läuft bei uns über Empfehlungen. Eigentlich sind wir damit ganz zufrieden.", branches: [{ words: ["wie", "aktuell", "bisher"], text: "Meistens über Empfehlungen. Es schwankt aber schon übers Jahr." }] },
      { fallback: "Ehrlich gesagt habe ich für so etwas gerade keine Zeit.", branches: [{ words: ["verstehe", "kurz", "sekunden"], text: "Gut, eine kurze Frage können Sie noch stellen." }] }
    ]
  },
  {
    id: "busy",
    title: "Die vielbeschäftigte Vertriebsleiterin",
    short: "Wenig Zeit · B2B-Software",
    level: "Fortgeschritten",
    prospect: { name: "Nina Brandt", initials: "NB", role: "Vertriebsleiterin · Novalytik" },
    opening: "Brandt hier, ich bin gleich im nächsten Termin.",
    prompts: [
      "Respektiere den Zeitdruck und bitte um höchstens 20 Sekunden.",
      "Zeige Relevanz und stelle genau eine fokussierte Frage.",
      "Behandle den Einwand zum bestehenden Anbieter sachlich.",
      "Bitte um einen kurzen Termin mit klarer Dauer."
    ],
    turns: [
      { fallback: "Dann machen Sie es bitte wirklich kurz.", branches: [{ words: ["20 sekunden", "zwanzig sekunden", "kurz"], text: "In Ordnung, Sie haben 20 Sekunden." }] },
      { fallback: "Wir arbeiten bereits mit einem Anbieter und wollen nicht wechseln.", branches: [{ words: ["pipeline", "vertrieb", "termine"], text: "Unsere Pipeline steht, nur die Terminquote könnte besser sein." }] },
      { fallback: "Ein Wechsel kommt trotzdem nicht infrage. Was wäre also der Sinn?", branches: [{ words: ["ergänz", "vergleich", "kein wechsel"], text: "Als Vergleich könnte es interessant sein. Was schlagen Sie vor?" }] }
    ]
  },
  {
    id: "price",
    title: "Der preisbewusste Praxisinhaber",
    short: "Budget-Einwand · Gesundheitswesen",
    level: "Fortgeschritten",
    prospect: { name: "Dr. Tobias Weber", initials: "TW", role: "Inhaber · Praxis am Park" },
    opening: "Praxis Weber, Weber am Apparat.",
    prompts: [
      "Eröffne persönlich und erkläre den Anlass ohne Floskeln.",
      "Erfrage die Auswirkung unbesetzter Termine, statt dein Produkt zu erklären.",
      "Ordne den Preis-Einwand durch eine Rückfrage ein.",
      "Vereinbare eine unverbindliche Prüfung als nächsten Schritt."
    ],
    turns: [
      { fallback: "Worum geht es? Wir bekommen sehr viele solcher Anrufe.", branches: [{ words: ["praxis", "termine", "ausfall"], text: "Terminausfälle sind tatsächlich lästig. Fahren Sie fort." }] },
      { fallback: "Wir haben manchmal Lücken, aber für zusätzliche Software ist kein Budget da.", branches: [{ words: ["wie viele", "kosten", "auswirkung"], text: "Im Schnitt bleiben drei oder vier Termine pro Woche unbesetzt." }] },
      { fallback: "Das klingt am Ende sicher wieder teuer.", branches: [{ words: ["ab wann", "rahmen", "lohnen"], text: "Wenn es sich nachweislich rechnet, würde ich es zumindest ansehen." }] }
    ]
  }
];

const scoringRules = {
  opening: { label: "Einstieg", words: ["guten tag", "hallo", "mein name", "ich bin", "anlass", "weil"] },
  discovery: { label: "Bedarf", words: ["wie", "was", "welche", "woran", "aktuell", "bisher", "wie viele"] },
  relevance: { label: "Relevanz", words: ["neukunden", "termine", "vertrieb", "ausfall", "praxis", "pipeline", "ergebnis"] },
  objection: { label: "Einwand", words: ["verstehe", "nachvollziehen", "kein wechsel", "ergänzung", "trotzdem", "kurz"] },
  close: { label: "Abschluss", words: ["termin", "minuten", "dienstag", "mittwoch", "donnerstag", "nächster schritt", "unverbindlich"] }
};

function normalize(text) {
  return text.toLocaleLowerCase("de-DE").replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();
}

function chooseBranch(turn, reply) {
  const text = normalize(reply);
  return turn.branches.find(branch => branch.words.some(word => text.includes(word)))?.text || turn.fallback;
}

function scoreCall(replies) {
  const text = normalize(replies.join(" "));
  const questionCount = (replies.join(" ").match(/\?/g) || []).length;
  const wordCount = text ? text.split(" ").length : 0;
  const details = {};

  Object.entries(scoringRules).forEach(([key, rule]) => {
    const hits = rule.words.filter(word => text.includes(word)).length;
    details[key] = Math.min(100, 35 + hits * 18);
  });
  details.discovery = Math.min(100, details.discovery + Math.min(questionCount, 3) * 12);
  if (replies.every(reply => normalize(reply).split(" ").length <= 55)) details.relevance = Math.min(100, details.relevance + 8);
  const completion = Math.min(100, replies.length * 25);
  const overall = Math.round((Object.values(details).reduce((sum, value) => sum + value, 0) / 5) * .85 + completion * .15);
  return { overall, details, wordCount, feedback: createFeedback(details, wordCount, questionCount) };
}

function createFeedback(details, wordCount, questionCount) {
  const feedback = [];
  if (details.opening < 70) feedback.push("Nenne gleich zu Beginn deinen Namen und einen konkreten Gesprächsanlass.");
  if (questionCount < 2) feedback.push("Stelle mindestens zwei offene Fragen mit „wie“ oder „was“, bevor du eine Lösung anbietest.");
  if (details.objection < 70) feedback.push("Spiegle den Einwand kurz mit „Das verstehe ich“ und frage dann sachlich weiter.");
  if (details.close < 70) feedback.push("Beende mit einem konkreten Vorschlag: Dauer, nächster Schritt und möglichst ein Terminfenster.");
  if (wordCount > 170) feedback.push("Kürze deine Antworten. Ziel: pro Wortbeitrag höchstens zwei klare Gedanken.");
  if (!feedback.length) feedback.push("Starke Struktur. Variiere beim nächsten Versuch die Fragen, ohne mehr zu erklären.");
  return feedback.slice(0, 4);
}

const elements = {
  views: document.querySelectorAll(".view"),
  routeButtons: document.querySelectorAll("[data-route]"),
  scenarioList: document.querySelector("#scenario-list"),
  scenarioSearch: document.querySelector("#scenario-search"),
  callsCount: document.querySelector("#calls-count"),
  bestScore: document.querySelector("#best-score"),
  streakCount: document.querySelector("#streak-count"),
  dashboardScore: document.querySelector("#dashboard-score"),
  trendLabel: document.querySelector("#trend-label"),
  practiceStep: document.querySelector("#practice-step"),
  callProgress: document.querySelector(".call-progress"),
  callStatus: document.querySelector("#call-status"),
  callTimer: document.querySelector("#call-timer"),
  callStage: document.querySelector(".call-stage"),
  prospectName: document.querySelector("#prospect-name"),
  prospectInitials: document.querySelector("#prospect-initials"),
  prospectRole: document.querySelector("#prospect-role"),
  prospectLine: document.querySelector("#prospect-line"),
  coachPrompt: document.querySelector("#coach-prompt span"),
  inputMode: document.querySelector("#input-mode"),
  replyForm: document.querySelector("#reply-form"),
  replyInput: document.querySelector("#reply-input"),
  micButton: document.querySelector("#mic-button"),
  speechNote: document.querySelector("#speech-note"),
  transcriptList: document.querySelector("#transcript-list"),
  resultScore: document.querySelector("#result-score"),
  resultsTitle: document.querySelector("#results-title"),
  resultSummary: document.querySelector("#result-summary"),
  scoreBreakdown: document.querySelector("#score-breakdown"),
  feedbackList: document.querySelector("#feedback-list"),
  historyList: document.querySelector("#history-list"),
  toast: document.querySelector("#toast")
};

let selectedScenarioId = scenarios[0].id;
let call = null;
let timerId = null;
let recognition = null;
let toastId = null;

function loadHistory() {
  try {
    const history = JSON.parse(localStorage.getItem("whos-calling-history") || "[]");
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

function saveHistory(entry) {
  const history = [entry, ...loadHistory()].slice(0, 30);
  try {
    localStorage.setItem("whos-calling-history", JSON.stringify(history));
  } catch {
    showToast("Fortschritt konnte in diesem Browser nicht gespeichert werden.");
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  clearTimeout(toastId);
  toastId = setTimeout(() => elements.toast.classList.remove("visible"), 3200);
}

function navigate(route) {
  if (route === "practice") {
    startCall(selectedScenarioId);
    return;
  }
  stopAudioInput();
  clearInterval(timerId);
  elements.views.forEach(view => view.classList.toggle("active", view.id === `${route}-view`));
  elements.routeButtons.forEach(button => button.classList.toggle("active", button.dataset.route === route));
  if (route === "dashboard") renderDashboard();
  if (route === "history") renderHistory();
  document.querySelector(`#${route}-view h1`)?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderScenarios(filter = "") {
  const query = normalize(filter);
  elements.scenarioList.replaceChildren(...scenarios.map((scenario, index) => {
    const item = document.createElement("div");
    item.className = `scenario-item${scenario.id === selectedScenarioId ? " selected" : ""}`;
    item.hidden = Boolean(query && !normalize(`${scenario.title} ${scenario.short}`).includes(query));
    item.innerHTML = `<span class="scenario-number">0${index + 1}</span><span class="scenario-copy"><strong></strong><small></small></span><button type="button" aria-label="Szenario starten"><svg><use href="#i-arrow"/></svg></button>`;
    item.querySelector("strong").textContent = scenario.title;
    item.querySelector("small").textContent = scenario.short;
    item.querySelector("button").addEventListener("click", () => startCall(scenario.id));
    item.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      selectedScenarioId = scenario.id;
      renderScenarios(elements.scenarioSearch.value);
      showToast(`„${scenario.title}“ ausgewählt`);
    });
    return item;
  }));
}

function renderDashboard() {
  const history = loadHistory();
  const scores = history.map(item => item.score);
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  elements.callsCount.textContent = history.length;
  elements.bestScore.textContent = scores.length ? Math.max(...scores) : "–";
  elements.streakCount.textContent = Math.min(history.length, 7);
  elements.dashboardScore.style.setProperty("--score", average);
  elements.dashboardScore.querySelector("strong").textContent = scores.length ? average : "–";
  elements.trendLabel.textContent = history.length ? `${history.length} absolviert` : "Neu";
  renderScenarios(elements.scenarioSearch.value);
}

function renderHistory() {
  const history = loadHistory();
  if (!history.length) {
    elements.historyList.innerHTML = `<div class="empty-state"><svg><use href="#i-clock"/></svg><p>Noch keine Gespräche. Starte dein erstes Training.</p></div>`;
    return;
  }
  elements.historyList.replaceChildren(...history.map(entry => {
    const scenario = scenarios.find(item => item.id === entry.scenarioId);
    const row = document.createElement("article");
    row.className = "history-row";
    row.innerHTML = `<span class="history-score"></span><span class="history-copy"><strong></strong><small></small></span><small></small><time></time>`;
    row.querySelector(".history-score").textContent = entry.score;
    row.querySelector("strong").textContent = scenario?.title || "Gesprächstraining";
    row.querySelector(".history-copy small").textContent = `${entry.rounds} Gesprächsrunden`;
    row.children[2].textContent = entry.score >= 80 ? "Stark" : entry.score >= 60 ? "Solide" : "Weiter üben";
    row.querySelector("time").dateTime = entry.date;
    row.querySelector("time").textContent = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.date));
    return row;
  }));
}

function startCall(scenarioId) {
  selectedScenarioId = scenarioId;
  const scenario = scenarios.find(item => item.id === scenarioId) || scenarios[0];
  call = { scenario, round: 0, replies: [], transcript: [], startedAt: Date.now() };
  clearInterval(timerId);
  stopAudioInput();
  window.speechSynthesis?.cancel();

  elements.views.forEach(view => view.classList.toggle("active", view.id === "practice-view"));
  elements.routeButtons.forEach(button => button.classList.toggle("active", button.dataset.route === "practice"));
  elements.prospectName.textContent = scenario.prospect.name;
  elements.prospectInitials.textContent = scenario.prospect.initials;
  elements.prospectRole.textContent = scenario.prospect.role;
  elements.replyInput.value = "";
  elements.transcriptList.replaceChildren();
  addTranscript("Prospekt", scenario.opening);
  setProspectLine(scenario.opening, true);
  updateRound();
  updateTimer();
  timerId = setInterval(updateTimer, 1000);
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => elements.replyInput.focus(), 250);
}

function updateRound() {
  if (!call) return;
  const current = Math.min(call.round, 3);
  elements.practiceStep.textContent = `Gespräch · Runde ${current + 1} von 4`;
  elements.coachPrompt.textContent = call.scenario.prompts[current];
  elements.callProgress.setAttribute("aria-valuenow", String(current));
  elements.callProgress.querySelector("span").style.width = `${current * 25}%`;
  elements.replyInput.placeholder = current === 0 ? "Guten Tag, mein Name ist …" : "Deine nächste Antwort …";
}

function updateTimer() {
  if (!call) return;
  const elapsed = Math.floor((Date.now() - call.startedAt) / 1000);
  elements.callTimer.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
}

function addTranscript(speaker, text) {
  if (!call) return;
  call.transcript.push({ speaker, text });
  const item = document.createElement("li");
  const label = document.createElement("strong");
  const copy = document.createElement("span");
  label.textContent = speaker;
  copy.textContent = text;
  item.append(label, copy);
  elements.transcriptList.append(item);
}

function setProspectLine(text, speak = true) {
  elements.prospectLine.textContent = `„${text}“`;
  if (speak) speakText(text);
}

function speakText(text) {
  if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance === "undefined") {
    elements.speechNote.textContent = "Sprachausgabe wird nicht unterstützt. Der Dialog bleibt vollständig lesbar.";
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = .96;
  const germanVoice = window.speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase().startsWith("de"));
  if (germanVoice) utterance.voice = germanVoice;
  utterance.onstart = () => elements.callStage.classList.add("speaking");
  utterance.onend = utterance.onerror = () => elements.callStage.classList.remove("speaking");
  try {
    window.speechSynthesis.speak(utterance);
  } catch {
    elements.speechNote.textContent = "Sprachausgabe ist blockiert. Alle Antworten bleiben lesbar.";
  }
}

function submitReply(event) {
  event.preventDefault();
  if (!call) return;
  const reply = elements.replyInput.value.trim();
  if (!reply) {
    elements.replyInput.focus();
    return;
  }
  stopAudioInput();
  call.replies.push(reply);
  addTranscript("Du", reply);
  elements.replyInput.value = "";

  if (call.round >= 3) {
    finishCall();
    return;
  }
  const response = chooseBranch(call.scenario.turns[call.round], reply);
  addTranscript("Prospekt", response);
  setProspectLine(response, true);
  call.round += 1;
  updateRound();
  elements.replyInput.focus();
}

function finishCall() {
  if (!call) return;
  stopAudioInput();
  window.speechSynthesis?.cancel();
  clearInterval(timerId);
  const result = scoreCall(call.replies);
  const entry = { scenarioId: call.scenario.id, score: result.overall, rounds: call.replies.length, date: new Date().toISOString() };
  saveHistory(entry);
  renderResults(result);
  elements.views.forEach(view => view.classList.toggle("active", view.id === "results-view"));
  elements.routeButtons.forEach(button => button.classList.remove("active"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderResults(result) {
  elements.resultScore.textContent = result.overall;
  elements.resultsTitle.textContent = result.overall >= 80 ? "Starker Auftritt." : result.overall >= 60 ? "Solide geführt." : "Guter Anfang.";
  elements.resultSummary.textContent = `${call.replies.length} Runden, ${result.wordCount} gesprochene oder geschriebene Wörter.`;
  elements.scoreBreakdown.replaceChildren(...Object.entries(result.details).map(([key, value]) => {
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `<span></span><div class="score-bar"><span></span></div><strong></strong>`;
    row.children[0].textContent = scoringRules[key].label;
    row.querySelector(".score-bar span").style.width = `${value}%`;
    row.querySelector("strong").textContent = value;
    return row;
  }));
  elements.feedbackList.replaceChildren(...result.feedback.map(text => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

function setupRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    elements.micButton.disabled = true;
    elements.speechNote.textContent = "Mikrofon-Erkennung wird hier nicht unterstützt. Du kannst jede Antwort eintippen.";
    return;
  }
  recognition = new Recognition();
  recognition.lang = "de-DE";
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onstart = () => setListening(true);
  recognition.onresult = event => {
    let transcript = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) transcript += event.results[index][0].transcript;
    elements.replyInput.value = transcript.trim();
  };
  recognition.onerror = event => {
    setListening(false);
    const denied = event.error === "not-allowed" || event.error === "service-not-allowed";
    elements.speechNote.textContent = denied
      ? "Mikrofonzugriff verweigert. Du kannst ohne Einschränkung tippen."
      : "Spracherkennung wurde unterbrochen. Deine Texteingabe bleibt verfügbar.";
    if (denied) elements.micButton.disabled = true;
  };
  recognition.onend = () => setListening(false);
}

function toggleRecognition() {
  if (!recognition) return;
  if (elements.micButton.getAttribute("aria-pressed") === "true") {
    recognition.stop();
    return;
  }
  try {
    recognition.start();
  } catch {
    showToast("Mikrofon ist bereits aktiv.");
  }
}

function setListening(active) {
  elements.micButton.setAttribute("aria-pressed", String(active));
  elements.micButton.querySelector("span").textContent = active ? "Aufnahme stoppen" : "Mikrofon";
  elements.callStatus.classList.toggle("listening", active);
  elements.callStatus.lastChild.textContent = active ? " Zuhören …" : " Verbunden";
  elements.inputMode.textContent = active ? "Mikrofon aktiv" : "Tastatur bereit";
  elements.inputMode.classList.toggle("active", active);
  elements.speechNote.textContent = active ? "Sprich jetzt. Dein Text erscheint direkt im Eingabefeld." : "Tippen funktioniert immer. Sprache kann der Browser online verarbeiten.";
}

function stopAudioInput() {
  if (recognition && elements.micButton.getAttribute("aria-pressed") === "true") {
    try { recognition.stop(); } catch { /* already stopped */ }
  }
  setListening(false);
}

function runSelfCheck() {
  const branch = chooseBranch({ fallback: "fallback", branches: [{ words: ["verstehe"], text: "matched" }] }, "Das verstehe ich.");
  const strong = scoreCall([
    "Guten Tag, mein Name ist Lea und ich rufe an, weil es um Ihre Neukunden geht.",
    "Wie gewinnen Sie aktuell neue Termine?",
    "Das verstehe ich. Darf ich trotzdem kurz fragen, was eine bessere Pipeline bewirken würde?",
    "Passt ein unverbindlicher Termin von 15 Minuten am Dienstag?"
  ]);
  const weak = scoreCall(["Hallo", "Produkt", "Nein", "Tschüss"]);
  return { passed: branch === "matched" && strong.overall > weak.overall && strong.details.close > weak.details.close, branch, strong: strong.overall, weak: weak.overall };
}

elements.routeButtons.forEach(button => button.addEventListener("click", () => navigate(button.dataset.route)));
document.querySelector("#start-practice").addEventListener("click", () => startCall(selectedScenarioId));
document.querySelectorAll(".back-dashboard").forEach(button => button.addEventListener("click", () => navigate("dashboard")));
document.querySelector("#end-call").addEventListener("click", () => {
  if (call?.replies.length) finishCall();
  else navigate("dashboard");
});
document.querySelector("#retry-call").addEventListener("click", () => startCall(selectedScenarioId));
document.querySelector("#replay-line").addEventListener("click", () => speakText(elements.prospectLine.textContent.replace(/[„“]/g, "")));
elements.replyForm.addEventListener("submit", submitReply);
elements.micButton.addEventListener("click", toggleRecognition);
elements.scenarioSearch.addEventListener("input", event => renderScenarios(event.target.value));
document.querySelectorAll(".wordmark, .brand-mark").forEach(link => link.addEventListener("click", event => {
  event.preventDefault();
  navigate("dashboard");
}));

window.WhosCalling = Object.freeze({ scoreCall, chooseBranch, runSelfCheck, scenarios });
setupRecognition();
renderDashboard();
