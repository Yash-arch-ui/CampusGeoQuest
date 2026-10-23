# Campus GeoQuest — Project Understanding

## 1. What this is

A free, fully client-side web app for a campus treasure-hunt style assignment.

Players start on a beautiful **3D-animated homepage**, press **Begin**, and are taken to a
**QR scanner page**. There are **10 physical QR codes** placed at 10 campus locations. At each
location the player scans the QR, answers a multiple-choice question (with a hint), and if
correct receives a clue to the **next location** plus the next scanner.

No backend, no paid APIs, no accounts required.

---

## 2. The exact player flow

```
Homepage (/)
  └─ "Begin" button
       ↓
Scanner page (/quest) — waiting for QR 1
       ↓ player walks to location 1 and scans QR 1
Question 1 (hint + 4 options)
       ├─ wrong answer → try again (no progress)
       └─ correct answer → reveal hint to location 2
                          + open scanner for QR 2
       ↓ repeat for QR 2 … QR 10
Completion screen (/complete) after QR 10's question
```

### Rules
- QR codes must be scanned **in order**. Scanning QR 5 before QR 4 is rejected with a message.
- Each QR carries a unique station token (see §5), not a website URL.
- A wrong answer never advances the player.
- A correct answer reveals the hint for the **next** location and immediately shows the scanner
  for the next QR.
- After station 10, the player sees a completion screen.

---

## 3. Pages

| Route        | Purpose |
|--------------|---------|
| `/`          | 3D animated landing page with hero, short explanation, and **Begin** button. |
| `/quest`     | The whole game loop: scanner → question → hint → scanner. One page, state-driven. |
| `/complete`  | Final success screen (after station 10). |

The scanner is **never** on the homepage — only on `/quest`.

---

## 4. Tech stack (proposed, free)

- **Build:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **3D homepage:** `@react-three/fiber` + `@react-three/drei`
  (floating globe / location pins / rings, mouse parallax)
- **QR scanning:** `qr-scanner` (Nimiq) — client-side, rear-camera support, image-upload fallback
- **QR generation:** `qrcode` npm package (or a small Python script) to produce printable PNG/PDF
- **State/persistence:** React state + `localStorage` (survives refresh / browser close)
- **Routing:** React Router (or TanStack Router)
- **Hosting:** Vercel / Netlify (static, free) — HTTPS is required for camera access

No server, database, auth, or external API keys.

---

## 5. QR code strategy

The player has **no QR codes yet**; we generate them.

- Payload format (token, not URL): `GEOQUEST:ST-01` … `GEOQUEST:ST-10`
- Why tokens: the app knows which station is expected, so out-of-order scans can be rejected.
- We generate 10 printable QR images with station labels for placing around campus.
- Optional: a small "enter code manually" fallback link for blocked cameras (can be hidden).

### Camera constraints
- Camera access requires **HTTPS** or `localhost`.
- Permission is requested on the `/quest` page, not on load of the homepage.
- If camera access is denied/unavailable, show a clear message and the manual fallback.

---

## 6. Data model

All content lives in one editable file, e.g. `src/data/quest.ts`:

```ts
type Station = {
  id: number;            // 1 … 10
  location: string;      // e.g. "Central Library"
  qrToken: string;       // "GEOQUEST:ST-01"
  hint: string;          // clue shown before the question
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  nextHint: string;      // clue to the next location, revealed on correct answer
};
```

10 stations total, ordered. The user already has the locations; questions/hints can be filled in
later via this template.

---

## 7. Game state (client-side)

Stored in `localStorage`:

```ts
type Progress = {
  currentStation: number;   // 1 … 10
  completed: number[];      // station ids answered correctly
  startedAt?: string;
  finishedAt?: string;
};
```

Behavior:
- Refresh / browser close resumes at the current station.
- Scanning the expected token advances to its question.
- Correct answer advances the station counter and shows the next hint.
- A reset button can clear progress (useful for testing / replay).

---

## 8. Edge cases to handle

- Camera permission denied or no camera found.
- Unsupported browser / insecure HTTP → explain HTTPS requirement.
- Wrong QR scanned → show which station is expected, do not advance.
- Correct QR scanned twice → do not double-advance.
- Wrong answer → retry without penalty.
- Refresh mid-question → stay on the same station.
- Player finishes station 10 → completion screen, no further scanner.
- QR code damaged/unreadable → manual code entry fallback.

---

## 9. Deliverables

1. Working Vite/React/TS app with `/`, `/quest`, `/complete`.
2. 3D-animated homepage with a clear **Begin** button.
3. In-browser QR scanner that validates station order.
4. 10-station question/hint data file (placeholders until content is provided).
5. Generated printable QR codes: `GEOQUEST:ST-01` … `ST-10`.
6. LocalStorage progress persistence + reset.
7. Deployment instructions (Vercel/Netlify, HTTPS note).

---

## 10. Open questions / pending decisions

1. Confirm stack: Vite + React + TS + Tailwind + R3F (recommended).
2. Confirm QR payload as token `GEOQUEST:ST-01` (recommended) vs full URL.
3. Provide the 10 locations + questions/hints, or use the placeholder template.
4. Theme preference: dark "geo/neon" (navy + cyan/green) or bright campus style.
5. Manual code-entry fallback: include or omit?
6. Deploy target: Vercel, Netlify, or local-only.

---

## 11. Summary

A static, free-to-host puzzle hunt: 3D landing page → ordered QR scanning → per-station
multiple-choice question → next-location hint → repeat 10 times → finish. Everything runs in the
browser; QR codes are generated by us; progress survives refresh.
