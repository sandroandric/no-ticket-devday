import {
  BadgeCheck,
  ClipboardList,
  Map,
  Newspaper,
  ReceiptText,
  TrainFront,
  type LucideIcon,
} from "lucide-react";

export type ClueId = "schedule" | "map" | "receipt" | "chronicle";

export type Clue = {
  id: ClueId;
  slot: number;
  title: string;
  shortLabel: string;
  artifactType: string;
  hotspot: { x: number; y: number };
  icon: LucideIcon;
  prompt: string;
  observation: string;
  extraction: string[];
  fragment: string;
  hint: string;
};

export const finalAnswers = ["PROOF MODE", "PROOF", "PROOFMODE"];

export const clues: Clue[] = [
  {
    id: "schedule",
    slot: 1,
    title: "Night Service Board",
    shortLabel: "Schedule",
    artifactType: "Generated transit board",
    hotspot: { x: 30.5, y: 44.5 },
    icon: TrainFront,
    prompt:
      "Image Gen produced a night-service board with multiple fictional routes, arrival times, and one line of green terminal text.",
    observation:
      "The board mixes ordinary route names with one instruction: proof is your ticket.",
    extraction: [
      "Ocean Beach, Twin Peaks, and Mission Cache are decoys.",
      "The only imperative sentence is printed in green.",
      "The key word is PROOF.",
    ],
    fragment: "PROOF",
    hint: "Ignore destinations. The ticket office trusts proof, not a route number.",
  },
  {
    id: "map",
    slot: 2,
    title: "San Franskyo Transit Map",
    shortLabel: "Map",
    artifactType: "Generated route diagram",
    hotspot: { x: 73.4, y: 37.7 },
    icon: Map,
    prompt:
      "Image Gen produced a readable fictional route map whose colored lines all converge near the validation point.",
    observation:
      "Every route crosses through a central node before reaching the final station.",
    extraction: [
      "The colored paths are not meant to be followed separately.",
      "The shared station is the action: validate the build.",
      "The map confirms the mode required by the first clue.",
    ],
    fragment: "MODE",
    hint: "The map answers what kind of proof the kiosk wants.",
  },
  {
    id: "receipt",
    slot: 3,
    title: "Counter Receipt",
    shortLabel: "Receipt",
    artifactType: "Generated receipt artifact",
    hotspot: { x: 18.0, y: 91.0 },
    icon: ReceiptText,
    prompt:
      "Image Gen produced a tiny receipt with fare lines and a legible terminal route hidden in transaction metadata.",
    observation:
      "The receipt is a compressed build log: idea, prompt, generate, refine, validate.",
    extraction: [
      "This clue proves the artifact is about process, not only visuals.",
      "The route mirrors the generated pass: build, solve, unlock.",
      "It supports the answer assembled from the schedule and map.",
    ],
    fragment: "BUILD LOG",
    hint: "Receipts record what happened. This one records the model pipeline.",
  },
  {
    id: "chronicle",
    slot: 4,
    title: "Street Chronicle",
    shortLabel: "Paper",
    artifactType: "Generated newspaper clue",
    hotspot: { x: 65.1, y: 61.4 },
    icon: Newspaper,
    prompt:
      "Image Gen produced a newspaper rack with a readable headline about early tickets hidden in plain sight.",
    observation:
      "The headline tells you the ticket is not bought. It is unlocked by evidence.",
    extraction: [
      "The room is an application, not a literal transit stop.",
      "The last action is to submit the proof phrase.",
      "The pass unlocks only after all four generated artifacts are inspected.",
    ],
    fragment: "UNLOCK",
    hint: "The paper gives the submission story: build something worth riding.",
  },
];

export const proofItems = [
  {
    label: "GPT-5.5 role",
    value:
      "Planned the escape-room structure, authored puzzle logic, built the React/Vite app, and generated the judge/verdict language.",
    icon: ClipboardList,
  },
  {
    label: "Image Gen role",
    value:
      "Created the generated ticket-office room concept and final unlock pass used as core gameplay artifacts.",
    icon: BadgeCheck,
  },
  {
    label: "Playable proof",
    value:
      "The public route is fully seeded, so judges can play without accounts, API keys, or waiting on model calls.",
    icon: Map,
  },
];

export const buildSteps = [
  "Idea: earn a DevDay ticket inside a generated world.",
  "Image Gen: render the room, clue surface, and final pass.",
  "GPT-5.5: turn the assets into puzzle logic and judge feedback.",
  "Codex: implement, test, and package the playable link.",
];

export function normalizeAnswer(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9#]+/g, " ");
}

export function isFinalAnswer(value: string) {
  const normalized = normalizeAnswer(value).replace(/\s+/g, " ").trim();
  return finalAnswers.some((answer) => normalizeAnswer(answer) === normalized);
}
