import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eye,
  FileJson,
  Lock,
  ScanLine,
  Sparkles,
  Ticket,
  X,
} from "lucide-react";
import {
  buildSteps,
  clues,
  isFinalAnswer,
  proofItems,
  type Clue,
  type ClueId,
} from "./gameData";

type Panel = "hints" | "verdict" | "proof" | "build";

const assetBase = import.meta.env.BASE_URL;
const roomImage = `${assetBase}assets/no-ticket-room-v2.png`;
const passImage = `${assetBase}assets/no-ticket-pass.png`;
const submissionUrl = `${assetBase}submission.json`;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function App() {
  const [discovered, setDiscovered] = useState<ClueId[]>([]);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [panel, setPanel] = useState<Panel>("hints");
  const [verdict, setVerdict] = useState(
    "The kiosk is waiting for evidence. Inspect the generated artifacts."
  );
  const [solved, setSolved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [viewShift, setViewShift] = useState(50);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const clueCount = discovered.length;
  const currentHint = useMemo(() => {
    if (selectedClue) {
      return selectedClue.hint;
    }

    const fallbackHints = [
      "Start with the green terminal text on the service board.",
      "The route map is about a mode, not a destination.",
      "The final phrase has two words.",
    ];
    return fallbackHints[Math.min(hintIndex, fallbackHints.length - 1)];
  }, [hintIndex, selectedClue]);

  function inspectClue(clue: Clue) {
    setSelectedClue(clue);
    setPanel("verdict");
    setVerdict(
      `GPT-5.5 judge: ${clue.shortLabel} accepted. The artifact yields fragment "${clue.fragment}".`
    );

    setDiscovered((current) => {
      if (current.includes(clue.id)) {
        return current;
      }
      return [...current, clue.id];
    });
  }

  function submitAnswer() {
    setAttempts((value) => value + 1);

    if (discovered.length < clues.length) {
      setPanel("verdict");
      setVerdict(
        `Kiosk refused the route. ${clues.length - discovered.length} generated artifact${
          clues.length - discovered.length === 1 ? "" : "s"
        } still need inspection.`
      );
      return;
    }

    if (isFinalAnswer(answer)) {
      setSolved(true);
      setShowPass(true);
      setPanel("proof");
      setVerdict(
        "Ticket unlocked. GPT-5.5 accepted the evidence chain and Image Gen rendered the final pass."
      );
      return;
    }

    setPanel("verdict");
    setVerdict(
      "Close, but the phrase is not the kiosk command. Combine the schedule keyword with the map action."
    );
  }

  function useHint() {
    setHintIndex((value) => value + 1);
    setPanel("hints");
  }

  function nudgeView(direction: "left" | "right") {
    setViewShift((value) => {
      const next = direction === "left" ? value - 12 : value + 12;
      return Math.max(34, Math.min(66, next));
    });
  }

  return (
    <main className="app-shell">
      <img className="preload" src={passImage} alt="" />
      <section className="room-stage" aria-label="Generated DevDay ticket office">
        <img
          className="room-image"
          src={roomImage}
          style={{ objectPosition: `${viewShift}% center` }}
          alt="Generated ticket-office escape room with clickable clue artifacts"
        />
        <div className="room-vignette" />

        <header className="hud top-left">
          <p className="eyeline">Generated Escape Room</p>
          <h1>No Ticket</h1>
          <span>SF-TIX-OFFICE-360</span>
        </header>

        <div className="hud status-bar" aria-label="Game status">
          <StatusMetric label="Time" value={formatTime(seconds)} />
          <StatusMetric label="Clues" value={`${clueCount} / ${clues.length}`} />
          <StatusMetric label="Attempts" value={attempts.toString()} />
          <StatusMetric label="Status" value={solved ? "Unlocked" : "Exploring"} />
        </div>

        <div className="view-controls" aria-label="Room view controls">
          <button type="button" onClick={() => nudgeView("left")} aria-label="Pan left">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => nudgeView("right")} aria-label="Pan right">
            <ChevronRight size={18} />
          </button>
        </div>

        <aside className="hud clue-ledger" aria-label="Collected clue ledger">
          <div className="ledger-head">
            <span>Clue Slots</span>
            <b>{clueCount} / 4</b>
          </div>
          {clues.map((clue) => {
            const found = discovered.includes(clue.id);
            return (
              <button
                className={`slot ${found ? "filled" : ""}`}
                key={clue.id}
                type="button"
                onClick={() => (found ? setSelectedClue(clue) : inspectClue(clue))}
              >
                <span>{String(clue.slot).padStart(2, "0")}</span>
                <strong>{found ? clue.shortLabel : "Drop clue here"}</strong>
                {found && <em>{clue.fragment}</em>}
              </button>
            );
          })}
        </aside>

        {clues.map((clue) => {
          const Icon = clue.icon;
          const found = discovered.includes(clue.id);
          return (
            <button
              className={`hotspot ${found ? "found" : ""}`}
              style={{ left: `${clue.hotspot.x}%`, top: `${clue.hotspot.y}%` }}
              key={clue.id}
              type="button"
              onClick={() => inspectClue(clue)}
              aria-label={`Inspect ${clue.title}`}
            >
              <span>
                <Icon size={16} />
              </span>
            </button>
          );
        })}

        <section className="kiosk hud" aria-label="Answer kiosk">
          <div>
            <p>Enter Answer</p>
            <h2>{solved ? "Ticket validated" : "What's the solution?"}</h2>
          </div>
          <div className="answer-row">
            <ScanLine size={18} />
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitAnswer();
                }
              }}
              placeholder="Type the kiosk phrase"
              aria-label="Kiosk answer"
            />
            <button type="button" onClick={submitAnswer}>
              Submit <ArrowRight size={16} />
            </button>
          </div>
          <div className="kiosk-foot">
            <span>Format: two words</span>
            <button type="button" onClick={useHint}>
              Get Hint <CircleHelp size={15} />
            </button>
          </div>
        </section>

        <aside className="hud judge-panel" aria-label="GPT-5.5 judge panel">
          <div className="tabs">
            {(["hints", "verdict", "proof", "build"] as Panel[]).map((item) => (
              <button
                className={panel === item ? "active" : ""}
                key={item}
                type="button"
                onClick={() => setPanel(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <PanelContent
            panel={panel}
            hint={currentHint}
            verdict={verdict}
            solved={solved}
            clueCount={clueCount}
          />
        </aside>

        <div className="hud control-note">
          <span>
            <Eye size={16} /> Click glowing artifacts
          </span>
          <span>
            <Ticket size={16} /> Unlock the pass
          </span>
        </div>
      </section>

      {selectedClue && (
        <ArtifactModal clue={selectedClue} onClose={() => setSelectedClue(null)} />
      )}

      {showPass && <FinalPass onClose={() => setShowPass(false)} />}
    </main>
  );
}

function StatusMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PanelContent({
  panel,
  hint,
  verdict,
  solved,
  clueCount,
}: {
  panel: Panel;
  hint: string;
  verdict: string;
  solved: boolean;
  clueCount: number;
}) {
  if (panel === "hints") {
    return (
      <div className="panel-body">
        <CircleHelp className="panel-icon" />
        <p>{hint}</p>
        <small>Hints reveal layers, not answers.</small>
        <div className="progress-dots" aria-label={`${clueCount} clues found`}>
          {clues.map((clue) => (
            <span className={clue.slot <= clueCount ? "on" : ""} key={clue.id} />
          ))}
        </div>
      </div>
    );
  }

  if (panel === "verdict") {
    return (
      <div className="panel-body">
        <Brain className="panel-icon" />
        <p>{verdict}</p>
        <small>Judge layer: GPT-5.5 style reasoning over generated clues.</small>
      </div>
    );
  }

  if (panel === "proof") {
    return (
      <div className="panel-body proof-list">
        {proofItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label}>
              <Icon size={18} />
              <div>
                <strong>{item.label}</strong>
                <p>{item.value}</p>
              </div>
            </article>
          );
        })}
        <a className="proof-link" href={submissionUrl} target="_blank" rel="noreferrer">
          <FileJson size={16} /> submission.json
        </a>
        <small>{solved ? "Ticket evidence complete." : "Unlock the pass for the full proof."}</small>
      </div>
    );
  }

  return (
    <div className="panel-body build-steps">
      <Sparkles className="panel-icon" />
      {buildSteps.map((step, index) => (
        <p key={step}>
          <span>{index + 1}</span> {step}
        </p>
      ))}
    </div>
  );
}

function ArtifactModal({ clue, onClose }: { clue: Clue; onClose: () => void }) {
  const Icon = clue.icon;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="artifact-title">
      <section className="artifact-card">
        <button className="close-button" type="button" onClick={onClose} aria-label="Close clue">
          <X size={18} />
        </button>
        <div className="artifact-heading">
          <Icon size={22} />
          <div>
            <p>{clue.artifactType}</p>
            <h2 id="artifact-title">{clue.title}</h2>
          </div>
        </div>
        <div className="artifact-paper">
          <span>Image Gen Prompt Surface</span>
          <p>{clue.prompt}</p>
          <strong>{clue.observation}</strong>
        </div>
        <ul>
          {clue.extraction.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <footer>
          <BadgeCheck size={18} />
          <span>Collected fragment: {clue.fragment}</span>
        </footer>
      </section>
    </div>
  );
}

function FinalPass({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop pass-backdrop" role="dialog" aria-modal="true">
      <section className="pass-card">
        <button className="close-button" type="button" onClick={onClose} aria-label="Close pass">
          <X size={18} />
        </button>
        <div className="pass-copy">
          <Lock size={18} />
          <p>Early access unlocked</p>
          <h2>#OpenAIDevDay2026</h2>
        </div>
        <img src={passImage} alt="Generated No Ticket early access pass" />
      </section>
    </div>
  );
}

export default App;
