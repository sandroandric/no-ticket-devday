# No Ticket

`No Ticket` is a playable GPT-5.5 + Image Gen DevDay contest entry.

The player enters a generated ticket office and earns an early DevDay pass by
inspecting Image Gen artifacts, collecting four clue fragments, and entering the
kiosk phrase.

## Contest Note

`#OpenAIDevDay2026 I built No Ticket: a generated DevDay escape room. GPT-5.5 planned/coded the game, puzzle logic, and hint judge; Image Gen created the room and final ticket artifacts. Play it here: <link>`

## Local Run

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
npm test
```

## Model Roles

- GPT-5.5: concept selection, puzzle system, React/Vite implementation, hints,
  verdicts, and proof manifest. The final proof metadata includes a Responses
  API call to `gpt-5.5-2026-04-23` (`resp_0fc7a7143244605d0069fa4d4d09b081969be477cbd2a50bd0`).
- Image Gen: generated ticket-office playfield concept and final unlock pass.
- Codex: implementation, iteration, testing, and browser verification.
