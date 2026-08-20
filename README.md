# Who's Calling?

**Who's Calling?** is a free, browser-based cold-calling practice tool. It lets you rehearse sales conversations with simulated prospects before making real calls.

Choose a scenario, respond by voice or text, and work through a branching conversation in German or English. After each session, the tool scores your approach and gives feedback on areas such as your opening, discovery questions, objection handling, and next step.

## Who it is for

- Salespeople who want to practise cold calls without pressure
- Founders and freelancers who sell their own services
- New team members preparing for live prospect conversations
- Coaches and sales teams looking for a simple role-play exercise
- Anyone who wants to become more confident on the phone

No sales experience, account, or paid API is required.

## What it does

- Provides several realistic cold-calling scenarios
- Simulates prospect responses through branching conversations
- Accepts spoken or typed answers
- Reads prospect replies aloud when browser speech is available
- Supports German and English
- Gives rule-based feedback and a score after each session
- Saves progress and session history in the browser

## Run it locally

Open `index.html` directly in a browser, or serve the folder locally:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). There is no installation or build step.

## Make it your own

The project uses plain HTML, CSS, and JavaScript, so it is easy to adapt:

- Edit page structure and labels in `index.html`
- Change colours, spacing, and layout in `styles.css`
- Add or rewrite scenarios, responses, translations, and scoring rules in `app.js`

You can replace the sample prospects with situations from your own market, product, or sales process. Keep the existing structure and adjust one scenario at a time; no framework or backend is needed.

## Free to use

You are free to use this project, adapt the code, and share it with your team for cold-calling practice.

## Speech and privacy

- Text input is always available.
- Voice input uses `SpeechRecognition` or `webkitSpeechRecognition` when supported and when microphone access is allowed. Depending on the browser, audio may be processed by its speech-recognition service.
- Prospect replies use the browser's local `speechSynthesis` voice. All content remains readable when no voice is available.
- Answers, language choice, and session history stay in the browser through `localStorage`.
- The app has no server and uses no paid API.

## Quick self-check

Run this in the browser console:

```js
WhosCalling.runSelfCheck()
// { passed: true, ... }
```

The check compares strong and weak answers and verifies a conversation branch. To check JavaScript syntax, run `node --check app.js`.
