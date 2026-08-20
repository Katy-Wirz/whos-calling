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

const scenarioTranslations = {
  skeptiker: {
    title: "The skeptical managing director", short: "Direct decision-maker · Manufacturing", level: "Beginner",
    prospect: { name: "Martin Keller", initials: "MK", role: "Managing Director · Keller Engineering" },
    opening: "Keller speaking. Hello?",
    prompts: [
      "Introduce yourself and give a specific reason for calling.",
      "Use an open question to learn how the company currently wins new customers.",
      "Acknowledge the time objection without arguing, then ask one short question.",
      "Suggest one small, specific next step."
    ],
    turns: [
      { fallback: "Hello. What exactly is this about?", branches: [{ words: ["referral", "website", "new customer"], text: "New customers are relevant, of course. What exactly do you mean?" }] },
      { fallback: "Most business comes through referrals. We are quite happy with that.", branches: [{ words: ["how", "currently", "today"], text: "Mostly through referrals, although it does vary throughout the year." }] },
      { fallback: "Honestly, I do not have time for this right now.", branches: [{ words: ["understand", "brief", "seconds"], text: "All right, you can ask one short question." }] }
    ]
  },
  busy: {
    title: "The busy sales director", short: "Short on time · B2B software", level: "Advanced",
    prospect: { name: "Nina Brandt", initials: "NB", role: "Sales Director · Novalytik" },
    opening: "Brandt speaking. I am about to join another meeting.",
    prompts: ["Respect the time pressure and ask for no more than 20 seconds.", "Show relevance and ask exactly one focused question.", "Address the existing-provider objection calmly.", "Ask for a short meeting and state its duration."],
    turns: [
      { fallback: "Then please make it very quick.", branches: [{ words: ["20 seconds", "twenty seconds", "brief"], text: "All right, you have 20 seconds." }] },
      { fallback: "We already work with a provider and do not want to switch.", branches: [{ words: ["pipeline", "sales", "meetings"], text: "Our pipeline is healthy, but our meeting rate could be better." }] },
      { fallback: "Switching is still out of the question. What would be the point?", branches: [{ words: ["add", "compare", "no switch"], text: "A comparison could be useful. What do you suggest?" }] }
    ]
  },
  price: {
    title: "The price-conscious practice owner", short: "Budget objection · Healthcare", level: "Advanced",
    prospect: { name: "Dr. Tobias Weber", initials: "TW", role: "Owner · Park Medical Practice" },
    opening: "Weber Medical Practice, Dr. Weber speaking.",
    prompts: ["Open personally and explain the reason without filler.", "Ask about the impact of unfilled appointments instead of explaining your product.", "Clarify the price objection with a question.", "Agree on a no-obligation review as the next step."],
    turns: [
      { fallback: "What is this about? We receive many calls like this.", branches: [{ words: ["practice", "appointments", "no-show"], text: "Missed appointments are indeed frustrating. Please continue." }] },
      { fallback: "We sometimes have gaps, but there is no budget for more software.", branches: [{ words: ["how many", "cost", "impact"], text: "On average, three or four appointments remain unfilled each week." }] },
      { fallback: "I am sure this will turn out to be expensive.", branches: [{ words: ["when", "range", "pay off"], text: "If it clearly pays for itself, I would at least look at it." }] }
    ]
  }
};

const scoringRules = {
  de: {
    opening: { label: "Einstieg", words: ["guten tag", "hallo", "mein name", "ich bin", "anlass", "weil"] },
    discovery: { label: "Bedarf", words: ["wie", "was", "welche", "woran", "aktuell", "bisher", "wie viele"] },
    relevance: { label: "Relevanz", words: ["neukunden", "termine", "vertrieb", "ausfall", "praxis", "pipeline", "ergebnis"] },
    objection: { label: "Einwand", words: ["verstehe", "nachvollziehen", "kein wechsel", "ergänzung", "trotzdem", "kurz"] },
    close: { label: "Abschluss", words: ["termin", "minuten", "dienstag", "mittwoch", "donnerstag", "nächster schritt", "unverbindlich"] }
  },
  en: {
    opening: { label: "Opening", words: ["hello", "good morning", "good afternoon", "my name", "i am", "calling because"] },
    discovery: { label: "Discovery", words: ["how", "what", "which", "currently", "today", "how many"] },
    relevance: { label: "Relevance", words: ["customer", "appointments", "sales", "no-show", "practice", "pipeline", "result"] },
    objection: { label: "Objection", words: ["understand", "appreciate", "no switch", "complement", "still", "brief"] },
    close: { label: "Close", words: ["meeting", "minutes", "tuesday", "wednesday", "thursday", "next step", "no obligation"] }
  }
};

function normalize(text, language = currentLanguage) {
  return text.toLocaleLowerCase(language === "en" ? "en-US" : "de-DE").replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();
}

function chooseBranch(turn, reply, language = currentLanguage) {
  const text = normalize(reply, language);
  return turn.branches.find(branch => branch.words.some(word => text.includes(word)))?.text || turn.fallback;
}

function scoreCall(replies, language = currentLanguage) {
  const text = normalize(replies.join(" "), language);
  const questionCount = (replies.join(" ").match(/\?/g) || []).length;
  const wordCount = text ? text.split(" ").length : 0;
  const details = {};

  Object.entries(scoringRules[language]).forEach(([key, rule]) => {
    const hits = rule.words.filter(word => text.includes(word)).length;
    details[key] = Math.min(100, 35 + hits * 18);
  });
  details.discovery = Math.min(100, details.discovery + Math.min(questionCount, 3) * 12);
  if (replies.every(reply => normalize(reply, language).split(" ").length <= 55)) details.relevance = Math.min(100, details.relevance + 8);
  const completion = Math.min(100, replies.length * 25);
  const overall = Math.round((Object.values(details).reduce((sum, value) => sum + value, 0) / 5) * .85 + completion * .15);
  return { overall, details, wordCount, questionCount, feedback: createFeedback(details, wordCount, questionCount, language) };
}

function createFeedback(details, wordCount, questionCount, language) {
  const feedback = [];
  const copy = language === "en"
    ? ["State your name and a specific reason for calling right at the start.", "Ask at least two open questions using ‘how’ or ‘what’ before offering a solution.", "Briefly acknowledge the objection with ‘I understand’, then continue with a factual question.", "Finish with a specific proposal: duration, next step, and ideally a meeting window.", "Shorten your answers. Aim for no more than two clear ideas per turn.", "Strong structure. Next time, vary your questions without adding more explanation."]
    : ["Nenne gleich zu Beginn deinen Namen und einen konkreten Gesprächsanlass.", "Stelle mindestens zwei offene Fragen mit „wie“ oder „was“, bevor du eine Lösung anbietest.", "Spiegle den Einwand kurz mit „Das verstehe ich“ und frage dann sachlich weiter.", "Beende mit einem konkreten Vorschlag: Dauer, nächster Schritt und möglichst ein Terminfenster.", "Kürze deine Antworten. Ziel: pro Wortbeitrag höchstens zwei klare Gedanken.", "Starke Struktur. Variiere beim nächsten Versuch die Fragen, ohne mehr zu erklären."];
  if (details.opening < 70) feedback.push(copy[0]);
  if (questionCount < 2) feedback.push(copy[1]);
  if (details.objection < 70) feedback.push(copy[2]);
  if (details.close < 70) feedback.push(copy[3]);
  if (wordCount > 170) feedback.push(copy[4]);
  if (!feedback.length) feedback.push(copy[5]);
  return feedback.slice(0, 4);
}

const translations = {
  de: {
    pageTitle: "Wer ruft an? – Kaltakquise trainieren", pageDescription: "Kostenloses, privates Training für deutsche Kaltakquise-Gespräche im Browser.",
    brandName: "Wer ruft an?", brandFooter: "Wer ruft an? · MVP", mainNavigation: "Hauptnavigation", homeLabel: "Wer ruft an? Startseite", dashboard: "Übersicht", startTraining: "Training starten", training: "Training", history: "Verlauf", localData: "Alle Daten bleiben in diesem Browser", sections: "Bereiche", language: "Sprache", profileShort: "DU", profileLabel: "DU – lokales Profil",
    dashboardTitle: "Sicherer ins nächste Kaltgespräch.", dashboardIntro: "Trainiere Einstieg, Bedarf und Einwandbehandlung mit realistischen Gesprächsverläufen.", thisWeek: "Diese Woche", averageScore: "Ø Score", calls: "Gespräche", bestScore: "Bester Score", streak: "Serie", scenarios: "Szenarien", exercises: "3 Übungen",
    backDashboard: "← Zur Übersicht", callTraining: "Gesprächstraining", endCall: "Gespräch beenden", callProgress: "Gesprächsfortschritt", connected: "Verbunden", replay: "Antwort erneut abspielen", whatSay: "Was sagst du?", keyboardReady: "Tastatur bereit", yourGoal: "Dein Ziel", replyLabel: "Antwort eingeben oder Mikrofon nutzen", microphone: "Mikrofon", sendReply: "Antwort senden", speechNote: "Tippen funktioniert immer. Sprache kann der Browser online verarbeiten.", conversation: "Gespräch",
    evaluationReady: "Deine Auswertung ist bereit.", callProfile: "Dein Gesprächsprofil", feedback: "Konkretes Feedback", toDashboard: "Zur Übersicht", again: "Noch einmal", yourCalls: "Deine Gespräche.", historyPrivacy: "Nur in diesem Browser. Keine Cloud, kein Konto.", footerPrivacy: "Texte und Verlauf bleiben lokal. Sprachverarbeitung hängt vom Browser ab.",
    new: "Neu", completed: "{count} absolviert", scenarioStart: "Szenario starten", selected: "„{title}“ ausgewählt", noCalls: "Noch keine Gespräche. Starte dein erstes Training.", rounds: "{count} Gesprächsrunden", strong: "Stark", solid: "Solide", keepPracticing: "Weiter üben", prospect: "Prospekt", you: "Du",
    startPlaceholder: "Guten Tag, mein Name ist …", nextPlaceholder: "Deine nächste Antwort …", speechUnsupported: "Sprachausgabe wird nicht unterstützt. Der Dialog bleibt vollständig lesbar.", speechBlocked: "Sprachausgabe ist blockiert. Alle Antworten bleiben lesbar.",
    resultStrong: "Starker Auftritt.", resultSolid: "Solide geführt.", resultStart: "Guter Anfang.", resultSummary: "{rounds} Runden, {words} gesprochene oder geschriebene Wörter.", recognitionUnsupported: "Mikrofon-Erkennung wird hier nicht unterstützt. Du kannst jede Antwort eintippen.", micDenied: "Mikrofonzugriff verweigert. Du kannst ohne Einschränkung tippen.", recognitionInterrupted: "Spracherkennung wurde unterbrochen. Deine Texteingabe bleibt verfügbar.", micActiveToast: "Mikrofon ist bereits aktiv.", stopRecording: "Aufnahme stoppen", listening: "Zuhören …", micActive: "Mikrofon aktiv", speakNow: "Sprich jetzt. Dein Text erscheint direkt im Eingabefeld.", saveFailed: "Fortschritt konnte in diesem Browser nicht gespeichert werden."
  },
  en: {
    pageTitle: "Who's calling? – Practice cold calls", pageDescription: "Free, private cold-call practice in your browser.",
    brandName: "Who's calling?", brandFooter: "Who's calling? · MVP", mainNavigation: "Main navigation", homeLabel: "Who's calling? home", dashboard: "Overview", startTraining: "Start training", training: "Training", history: "History", localData: "All data stays in this browser", sections: "Sections", language: "Language", profileShort: "ME", profileLabel: "ME – local profile",
    dashboardTitle: "More confidence on your next cold call.", dashboardIntro: "Practice openings, discovery, and objection handling with realistic conversations.", thisWeek: "This week", averageScore: "Avg. score", calls: "Calls", bestScore: "Best score", streak: "Streak", scenarios: "Scenarios", exercises: "3 exercises",
    backDashboard: "← Back to overview", callTraining: "Call training", endCall: "End call", callProgress: "Call progress", connected: "Connected", replay: "Replay response", whatSay: "What do you say?", keyboardReady: "Keyboard ready", yourGoal: "Your goal", replyLabel: "Type a reply or use the microphone", microphone: "Microphone", sendReply: "Send reply", speechNote: "Typing always works. Your browser may process speech online.", conversation: "Conversation",
    evaluationReady: "Your evaluation is ready.", callProfile: "Your call profile", feedback: "Specific feedback", toDashboard: "Back to overview", again: "Try again", yourCalls: "Your calls.", historyPrivacy: "Only in this browser. No cloud, no account.", footerPrivacy: "Text and history stay local. Speech processing depends on your browser.",
    new: "New", completed: "{count} completed", scenarioStart: "Start scenario", selected: "“{title}” selected", noCalls: "No calls yet. Start your first training session.", rounds: "{count} conversation rounds", strong: "Strong", solid: "Solid", keepPracticing: "Keep practicing", prospect: "Prospect", you: "You",
    startPlaceholder: "Hello, my name is …", nextPlaceholder: "Your next reply …", speechUnsupported: "Speech output is not supported. The full conversation remains readable.", speechBlocked: "Speech output is blocked. All responses remain readable.",
    resultStrong: "Strong performance.", resultSolid: "Well handled.", resultStart: "Good start.", resultSummary: "{rounds} rounds, {words} spoken or written words.", recognitionUnsupported: "Microphone recognition is not supported here. You can type every reply.", micDenied: "Microphone access was denied. You can continue by typing.", recognitionInterrupted: "Speech recognition was interrupted. Text input remains available.", micActiveToast: "The microphone is already active.", stopRecording: "Stop recording", listening: "Listening …", micActive: "Microphone active", speakNow: "Speak now. Your words will appear in the text field.", saveFailed: "Progress could not be saved in this browser."
  }
};

function t(key, values = {}) {
  return Object.entries(values).reduce((text, [name, value]) => text.replace(`{${name}}`, value), translations[currentLanguage][key]);
}

function getScenario(scenario) {
  return currentLanguage === "en" ? { ...scenario, ...scenarioTranslations[scenario.id] } : scenario;
}

const elements = {
  views: document.querySelectorAll(".view"),
  routeButtons: document.querySelectorAll("[data-route]"),
  scenarioList: document.querySelector("#scenario-list"),
  languageSelect: document.querySelector("#language-select"),
  callsCount: document.querySelector("#calls-count"),
  bestScore: document.querySelector("#best-score"),
  streakCount: document.querySelector("#streak-count"),
  dashboardScore: document.querySelector("#dashboard-score"),
  trendLabel: document.querySelector("#trend-label"),
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

let currentLanguage = (() => {
  try { return localStorage.getItem("whos-calling-language") === "en" ? "en" : "de"; } catch { return "de"; }
})();
let selectedScenarioId = scenarios[0].id;
let call = null;
let lastResult = null;
let timerId = null;
let recognition = null;
let toastId = null;

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]').content = t("pageDescription");
  document.querySelectorAll("[data-i18n]").forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria]").forEach(element => element.setAttribute("aria-label", t(element.dataset.i18nAria)));
  document.querySelectorAll("[data-i18n-title]").forEach(element => element.title = t(element.dataset.i18nTitle));
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => element.placeholder = t(element.dataset.i18nPlaceholder));
  elements.languageSelect.value = currentLanguage;
  if (recognition) recognition.lang = currentLanguage === "en" ? "en-US" : "de-DE";
}

function setLanguage(language) {
  if (!translations[language] || language === currentLanguage) return;
  stopAudioInput();
  window.speechSynthesis?.cancel();
  currentLanguage = language;
  try { localStorage.setItem("whos-calling-language", language); } catch { /* preference remains active for this visit */ }
  applyTranslations();
  if (document.querySelector("#practice-view").classList.contains("active") && call) startCall(call.scenario.id);
  else if (document.querySelector("#results-view").classList.contains("active") && lastResult) renderResults(lastResult);
  else if (document.querySelector("#history-view").classList.contains("active")) renderHistory();
  else renderDashboard();
}

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
    showToast(t("saveFailed"));
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

function renderScenarios() {
  elements.scenarioList.replaceChildren(...scenarios.map((scenario, index) => {
    const copy = getScenario(scenario);
    const item = document.createElement("div");
    item.className = `scenario-item${scenario.id === selectedScenarioId ? " selected" : ""}`;
    item.innerHTML = `<span class="scenario-number">0${index + 1}</span><span class="scenario-copy"><strong></strong><small></small></span><button type="button"><svg><use href="#i-arrow"/></svg></button>`;
    item.querySelector("strong").textContent = copy.title;
    item.querySelector("small").textContent = copy.short;
    item.querySelector("button").setAttribute("aria-label", t("scenarioStart"));
    item.querySelector("button").addEventListener("click", () => startCall(scenario.id));
    item.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      selectedScenarioId = scenario.id;
      renderScenarios();
      showToast(t("selected", { title: copy.title }));
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
  elements.dashboardScore.querySelector("strong").textContent = scores.length ? average : "–";
  elements.trendLabel.textContent = history.length ? t("completed", { count: history.length }) : t("new");
  renderScenarios();
}

function renderHistory() {
  const history = loadHistory();
  if (!history.length) {
    elements.historyList.innerHTML = `<div class="empty-state"><svg><use href="#i-clock"/></svg><p></p></div>`;
    elements.historyList.querySelector("p").textContent = t("noCalls");
    return;
  }
  elements.historyList.replaceChildren(...history.map(entry => {
    const scenario = getScenario(scenarios.find(item => item.id === entry.scenarioId) || scenarios[0]);
    const row = document.createElement("article");
    row.className = "history-row";
    row.innerHTML = `<span class="history-score"></span><span class="history-copy"><strong></strong><small></small></span><small></small><time></time>`;
    row.querySelector(".history-score").textContent = entry.score;
    row.querySelector("strong").textContent = scenario.title || t("callTraining");
    row.querySelector(".history-copy small").textContent = t("rounds", { count: entry.rounds });
    row.children[2].textContent = entry.score >= 80 ? t("strong") : entry.score >= 60 ? t("solid") : t("keepPracticing");
    row.querySelector("time").dateTime = entry.date;
    row.querySelector("time").textContent = new Intl.DateTimeFormat(currentLanguage === "en" ? "en-US" : "de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.date));
    return row;
  }));
}

function startCall(scenarioId) {
  selectedScenarioId = scenarioId;
  const scenario = getScenario(scenarios.find(item => item.id === scenarioId) || scenarios[0]);
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
  addTranscript(t("prospect"), scenario.opening);
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
  elements.coachPrompt.textContent = call.scenario.prompts[current];
  elements.callProgress.setAttribute("aria-valuenow", String(current));
  elements.callProgress.querySelector("span").style.width = `${current * 25}%`;
  elements.replyInput.placeholder = current === 0 ? t("startPlaceholder") : t("nextPlaceholder");
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
    elements.speechNote.textContent = t("speechUnsupported");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = currentLanguage === "en" ? "en-US" : "de-DE";
  utterance.rate = .96;
  const voice = window.speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith(currentLanguage));
  if (voice) utterance.voice = voice;
  utterance.onstart = () => elements.callStage.classList.add("speaking");
  utterance.onend = utterance.onerror = () => elements.callStage.classList.remove("speaking");
  try {
    window.speechSynthesis.speak(utterance);
  } catch {
    elements.speechNote.textContent = t("speechBlocked");
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
  addTranscript(t("you"), reply);
  elements.replyInput.value = "";

  if (call.round >= 3) {
    finishCall();
    return;
  }
  const response = chooseBranch(call.scenario.turns[call.round], reply);
  addTranscript(t("prospect"), response);
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
  const result = scoreCall(call.replies, currentLanguage);
  lastResult = result;
  const entry = { scenarioId: call.scenario.id, score: result.overall, rounds: call.replies.length, date: new Date().toISOString() };
  saveHistory(entry);
  renderResults(result);
  elements.views.forEach(view => view.classList.toggle("active", view.id === "results-view"));
  elements.routeButtons.forEach(button => button.classList.remove("active"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderResults(result) {
  elements.resultScore.textContent = result.overall;
  elements.resultsTitle.textContent = result.overall >= 80 ? t("resultStrong") : result.overall >= 60 ? t("resultSolid") : t("resultStart");
  elements.resultSummary.textContent = t("resultSummary", { rounds: call.replies.length, words: result.wordCount });
  elements.scoreBreakdown.replaceChildren(...Object.entries(result.details).map(([key, value]) => {
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `<span></span><div class="score-bar"><span></span></div><strong></strong>`;
    row.children[0].textContent = scoringRules[currentLanguage][key].label;
    row.querySelector(".score-bar span").style.width = `${value}%`;
    row.querySelector("strong").textContent = value;
    return row;
  }));
  const feedback = createFeedback(result.details, result.wordCount, result.questionCount, currentLanguage);
  elements.feedbackList.replaceChildren(...feedback.map(text => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

function setupRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    elements.micButton.disabled = true;
    elements.speechNote.textContent = t("recognitionUnsupported");
    return;
  }
  recognition = new Recognition();
  recognition.lang = currentLanguage === "en" ? "en-US" : "de-DE";
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
      ? t("micDenied")
      : t("recognitionInterrupted");
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
    showToast(t("micActiveToast"));
  }
}

function setListening(active) {
  elements.micButton.setAttribute("aria-pressed", String(active));
  elements.micButton.querySelector("span").textContent = active ? t("stopRecording") : t("microphone");
  elements.callStatus.classList.toggle("listening", active);
  elements.callStatus.lastChild.textContent = active ? t("listening") : t("connected");
  elements.inputMode.textContent = active ? t("micActive") : t("keyboardReady");
  elements.inputMode.classList.toggle("active", active);
  elements.speechNote.textContent = active ? t("speakNow") : t("speechNote");
}

function stopAudioInput() {
  if (recognition && elements.micButton.getAttribute("aria-pressed") === "true") {
    try { recognition.stop(); } catch { /* already stopped */ }
  }
  setListening(false);
}

function runSelfCheck() {
  const branch = chooseBranch({ fallback: "fallback", branches: [{ words: ["verstehe"], text: "matched" }] }, "Das verstehe ich.", "de");
  const strong = scoreCall([
    "Guten Tag, mein Name ist Lea und ich rufe an, weil es um Ihre Neukunden geht.",
    "Wie gewinnen Sie aktuell neue Termine?",
    "Das verstehe ich. Darf ich trotzdem kurz fragen, was eine bessere Pipeline bewirken würde?",
    "Passt ein unverbindlicher Termin von 15 Minuten am Dienstag?"
  ], "de");
  const weak = scoreCall(["Hallo", "Produkt", "Nein", "Tschüss"], "de");
  const english = scoreCall(["Hello, my name is Lea. I am calling because of your sales pipeline.", "How do you currently win new customers?", "I understand. May I ask one brief question?", "Would a 15 minute meeting on Tuesday work as a next step?"], "en");
  return { passed: branch === "matched" && strong.overall > weak.overall && strong.details.close > weak.details.close && english.overall > weak.overall, branch, strong: strong.overall, weak: weak.overall, english: english.overall };
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
elements.languageSelect.addEventListener("change", event => setLanguage(event.target.value));
document.querySelectorAll(".wordmark, .brand-mark").forEach(link => link.addEventListener("click", event => {
  event.preventDefault();
  navigate("dashboard");
}));

window.WhosCalling = Object.freeze({ scoreCall, chooseBranch, runSelfCheck, scenarios });
applyTranslations();
setupRecognition();
renderDashboard();
