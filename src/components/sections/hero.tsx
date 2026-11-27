"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import {
  Cable,
  FilePen,
  Workflow,
  TrendingUp,
  Users,
  Star,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// 1. ISOMETRIC & GEOMETRIC CONSTANTS (Syntra Exact Math)
// ---------------------------------------------------------------------------
const BR = 0.8660254037844386; // cos(30 deg)
const XR = 0.5; // sin(30 deg)
const CENTER_X = 500;
const CENTER_Y = 500;
const COMPRESS_Y = 0.57;
const RING_RADII = [270, 370];

// Slabs definitions
const SLAB_TE = { half: 168, radius: 40, top: 475, depth: 34 };
const GAP_O2 = 9;
const SLAB_VT = { half: 151, radius: 36, top: SLAB_TE.top - GAP_O2 - 28, depth: 28 };
const SLAB_QN = { half: 101, radius: 28, top: SLAB_VT.top - 14, depth: 14 };

const SLABS_E = [
  { ...SLAB_TE, top: SLAB_TE.top + 17, depth: 17 },
  { ...SLAB_TE, top: SLAB_TE.top, depth: 17 },
  SLAB_VT,
  { ...SLAB_QN, top: SLAB_QN.top + 7, depth: 7 },
  { ...SLAB_QN, top: SLAB_QN.top, depth: 7 },
];

const AI_INDEX = 2;

const RI = {
  spring: { stiffness: 105, damping: 25, mass: 1 },
  gap: 104,
  aiLift: 14,
  topPlateY: 216,
  stagger: 0.05,
  scales: [0.63, 0.62, 0.7, 1.07, 1.06],
};

const MR = {
  left: { edge: 0, width: 33 },
  right: { edge: 0, width: 33 },
  restInset: 6,
  outward: 0,
};

const PLATE_Y_TARGETS = SLABS_E.map(
  (slab, idx) =>
    RI.topPlateY + (SLABS_E.length - 1 - idx) * RI.gap - (idx === AI_INDEX ? RI.aiLift : 0)
);
const PLATE_Y_DELTAS = SLABS_E.map((slab, idx) => PLATE_Y_TARGETS[idx] - slab.top);

const ROUND = (val: number) => Math.round(val * 100) / 100;

// Project 2D coordinates into isometric space
const project = (x: number, y: number, cx = CENTER_X, cy = CENTER_Y): [number, number] => [
  cx + (x - y) * BR,
  cy + (x + y) * XR,
];

// Rounded rectangle footprint in 2D
const footprint = (half: number, radius: number, steps = 14): [number, number][] => {
  const r = Math.min(radius, half);
  const c = half - r;
  const corners = [
    [c, c, 0],
    [-c, c, 90],
    [-c, -c, 180],
    [c, -c, 270],
  ];
  const pts: [number, number][] = [];
  for (const [cx, cy, startAngle] of corners) {
    for (let b = 0; b <= steps; b++) {
      const rad = ((startAngle + (90 * b) / steps) * Math.PI) / 180;
      pts.push([cx + r * Math.cos(rad), cy + r * Math.sin(rad)]);
    }
  }
  return pts;
};

const toPath = (pts: [number, number][]) =>
  `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`;

const topPath = (slab: { half: number; radius: number; top: number }, offset = 0, cx = CENTER_X, dy = 0) => {
  const h = slab.half - offset;
  const r = Math.max(slab.radius - offset, 1);
  return toPath(footprint(h, r).map(([x, y]) => project(x, y, cx, slab.top + dy)));
};

// Monotone chain convex hull
const hull = (points: [number, number][]): [number, number][] => {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const halfHull = (arr: [number, number][]) => {
    const res: [number, number][] = [];
    for (const p of arr) {
      while (res.length >= 2 && cross(res[res.length - 2], res[res.length - 1], p) <= 0) {
        res.pop();
      }
      res.push(p);
    }
    res.pop();
    return res;
  };
  return [...halfHull(sorted), ...halfHull([...sorted].reverse())];
};

const bodyPath = (slab: { half: number; radius: number; top: number; depth: number }, offset = 0) => {
  const h = slab.half - offset;
  const r = Math.max(slab.radius - offset, 1);
  const pts = footprint(h, r);
  const topPts = pts.map(([x, y]) => project(x, y, CENTER_X, slab.top));
  const botPts = pts.map(([x, y]) => project(x, y, CENTER_X, slab.top + slab.depth));
  return toPath(hull([...topPts, ...botPts]));
};

const facePoint = (
  slab: { half: number; top: number; depth: number },
  side: "left" | "right",
  u: number,
  v: number
): [number, number] => {
  const { half: c, top: d, depth: h } = slab;
  if (side === "left") {
    const [px, py] = project(-c + 2 * c * u, c, CENTER_X, d);
    return [px, py + h * v];
  }
  const [px, py] = project(c, c - 2 * c * u, CENTER_X, d);
  return [px, py + h * v];
};

const ringPath = (radius: number) => {
  const ry = radius * COMPRESS_Y;
  return `M${CENTER_X + radius} ${CENTER_Y}A${radius} ${ry} 0 1 1 ${CENTER_X - radius} ${CENTER_Y}A${radius} ${ry} 0 1 1 ${CENTER_X + radius} ${CENTER_Y}Z`;
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));

const plateProgress = (plateIdx: number, p: number) => {
  const dist = Math.abs(plateIdx - AI_INDEX) * RI.stagger;
  return clamp((p - dist) / (1 - dist));
};

const plateY = (plateIdx: number, p: number) => PLATE_Y_DELTAS[plateIdx] * plateProgress(plateIdx, p);

const plateScale = (plateIdx: number, p: number) =>
  1 + (RI.scales[plateIdx] - 1) * plateProgress(plateIdx, p);

const tipOffset = (plateIdx: number) => {
  const { half: a, radius: r } = SLABS_E[plateIdx];
  return 0.866 * (2 * a - 0.586 * r) * RI.scales[plateIdx];
};

const tipX = (plateIdx: number, side: "left" | "right") =>
  CENTER_X + (side === "right" ? 1 : -1) * tipOffset(plateIdx);

const cornerY = (plateIdx: number) => PLATE_Y_TARGETS[plateIdx] + SLABS_E[plateIdx].depth / 2;

// ---------------------------------------------------------------------------
// 2. VECTOR APP LOGOS
// ---------------------------------------------------------------------------
function AirtableLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 215" aria-hidden="true" className={className}>
      <path fill="#ffbf00" d="M114.259 2.701L18.86 42.176c-5.305 2.195-5.25 9.73.089 11.847l95.797 37.989a35.54 35.54 0 0 0 26.208 0l95.799-37.99c5.337-2.115 5.393-9.65.088-11.846L142.043 2.701a35.6 35.6 0 0 0-27.784 0" />
      <path fill="#0080ff" d="m130.686 103.73l95.127-37.72c4.869-1.93 10.187 1.67 10.187 6.907v88.94c0 3.75-2.203 7.15-5.632 8.68l-94.887 42.23c-5.228 2.33-11.164-1.52-11.164-7.23v-93.12c0-3.75 2.193-7.15 5.62-8.687" />
      <path fill="#1a1f2c" d="M111.423 117.654v92.208c0 5.46-5.412 9.176-10.472 7.126l-92.937-37.6c-4.84-1.96-8.014-6.66-8.014-11.87v-55.93c0-4.71 5.411-7.799 9.664-5.753l101.759 41.819" />
    </svg>
  );
}

function ClaudeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 257" aria-hidden="true" className={className}>
      <path fill="#d97757" d="m50.228 170.321l32.404-18.73l22.618 13.086l-1.36 3.953l-3.37 1.75l-7.777 2.98l-15.684-2.527l-6.48 4.925l-2.073 6.221l2.073 7.971l5.702 4.926l11.47 2.528l12.766-2.528l4.471-4.925l3.37-14.84l4.212-21.516l3.37-16.331l3.046-20.284l1.815-6.74l-.13-.453l-1.49.194l-15.295 21l-23.267 31.433l-18.406 19.7l-4.407 1.751l-7.648-3.954l.713-7.064l4.277-6.286l25.47-32.405l15.36-20.092l9.917-11.6l-.065-1.686h-.583L44.07 198.125l-12.055 1.555l-5.185-4.86l.648-7.972l2.463-2.593l20.35-13.999z" />
    </svg>
  );
}

function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path fill="#448aff" d="M15 8.014A7.457 7.457 0 0 0 8.014 15h-.028A7.456 7.456 0 0 0 1 8.014v-.028A7.456 7.456 0 0 0 7.986 1h.028A7.457 7.457 0 0 0 15 7.986z" />
    </svg>
  );
}

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 250" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.51 87.535 121.46c6.397 1.185 8.746-2.777 8.746-6.158c0-3.052-.12-13.135-.174-23.83c-35.61 7.742-43.124-15.184-43.124-15.184c-5.818-14.812-14.216-18.754-14.216-18.754c-11.613-7.944.876-7.78.876-7.78c12.853.902 19.621 13.19 19.621 13.19c11.417 19.568 29.945 13.911 37.249 10.64c1.16-8.275 4.466-13.914 8.127-17.116c-28.431-3.236-58.318-14.212-58.318-63.258c0-13.975 5-25.394 13.188-34.358c-1.329-3.224-5.71-16.242 1.24-33.874c0 0 10.749-3.44 35.21 13.121c10.21-2.836 21.16-4.258 32.038-4.307c10.878.049 21.83 1.47 32.04 4.307c24.437-16.56 35.17-13.121 35.17-13.121c6.967 17.632 2.585 30.65 1.255 33.874c8.202 8.964 13.173 20.383 13.173 34.358c0 49.163-29.944 59.988-58.447 63.157c4.591 3.972 8.682 11.762 8.682 23.704c0 17.126-.148 30.91-.148 35.153c0 3.406 2.304 7.412 8.796 6.148c50.816-16.99 87.441-64.885 87.441-121.439C256.002 57.307 198.691 0 128.001 0" />
    </svg>
  );
}

function NotionLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 268" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M16.092 11.538L160.038.163c19.743-1.558 28.055 3.637 35.333 10.395l47.784 41.564c7.278 6.758 10.394 15.07 10.394 25.46v164.205c0 15.586-7.278 24.423-22.864 25.462L69.066 267.77c-15.586.526-23.898-3.111-30.134-10.903L3.637 215.304C.513 211.141 0 203.864 0 196.586V34.92c0-14.549 7.278-22.345 16.092-23.382" />
      <path fill="#fff" d="M162.115 17.842l-137.124 10.91c-7.278.526-8.826 6.233-8.826 12.473v147.592c0 6.24 3.12 9.351 9.877 8.825l138.167-9.869c6.758-.525 9.351-5.714 9.351-11.954V28.238c0-5.714-4.681-9.87-11.445-10.396" />
      <path fill="currentColor" d="M141.849 57.864l-90.377 6.234c-4.161.517-5.205 3.12-5.205 6.24v91.984c0 3.12 2.087 5.723 5.723 5.723l84.654-5.723c3.637-.517 5.723-3.12 5.723-6.24V63.587c0-3.646-2.086-5.723-5.723-5.723" />
    </svg>
  );
}

function OpenaiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 260" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M239.184 106.203a64.72 64.72 0 0 0-5.581-54.065a66.27 66.27 0 0 0-46.064-32.551a65.3 65.3 0 0 0-56.502 11.47a64.74 64.74 0 0 0-41.564-7.534a66.26 66.26 0 0 0-42.316 29.58a65.35 65.35 0 0 0-14.773 54.34a64.72 64.72 0 0 0-35.983 46.53a66.3 66.3 0 0 0 3.75 51.523a65.35 65.35 0 0 0 41.729 42.871a64.74 64.74 0 0 0 41.563 7.534a66.26 66.26 0 0 0 42.317-29.58a65.35 65.35 0 0 0 14.773-54.34a64.72 64.72 0 0 0 35.983-46.53a66.3 66.3 0 0 0-3.75-51.523a65.35 65.35 0 0 0-41.729-42.871zm-97.108 126.11a48.65 48.65 0 0 1-38.307-1.586l1.535-.87l51.67-29.825a8.6 8.6 0 0 0 4.246-7.367v-73.493l21.845 12.585a.87.87 0 0 1 .41.614v60.912a48.652 48.652 0 0 1-41.399 39.03zM37.332 181.71a48.652 48.652 0 0 1-5.118-38.04l1.535.921l51.619 30.081a8.39 8.39 0 0 0 8.492 0l63.538-36.68v25.221a.72.72 0 0 1-.307.665l-52.233 30.133a48.652 48.652 0 0 1-67.526-12.299zM22.956 94.619a48.652 48.652 0 0 1 33.189-36.455l.051 1.74l-.051 59.907a8.6 8.6 0 0 0 4.246 7.367l63.538 36.68l-21.845 12.585a.87.87 0 0 1-.768.102l-52.233-30.133a48.652 48.652 0 0 1-26.127-51.793zm180.126 19.347l-63.538-36.68l21.845-12.585a.87.87 0 0 1 .768-.102l52.233 30.133a48.652 48.652 0 0 1 26.127 51.793a48.652 48.652 0 0 1-33.189 36.455l-.051-1.74l.051-59.907a8.6 8.6 0 0 0-4.246-7.367zm15.586-32.256l-1.535-.922l-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.72.72 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391zM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87l-51.67 29.825a8.6 8.6 0 0 0-4.246 7.367zm11.868-25.58L128.067 97.3l28.188 16.218v32.434l-28.086 16.218l-28.188-16.218z" />
    </svg>
  );
}

function SalesforceLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 180" aria-hidden="true" className={className}>
      <path fill="#00a1e0" d="M106.553 19.651c8.248-8.594 19.731-13.924 32.43-13.924c16.883 0 31.612 9.414 39.455 23.389a54.5 54.5 0 0 1 22.3-4.74c30.449 0 55.134 24.9 55.134 55.615c0 30.719-24.685 55.62-55.134 55.62a54.7 54.7 0 0 1-10.86-1.083c-6.908 12.321-20.07 20.645-35.178 20.645a40.1 40.1 0 0 1-17.632-4.058c-7.002 16.47-23.316 28.019-42.33 28.019c-19.8 0-36.674-12.529-43.152-30.1c-2.83.602-5.763.915-8.772.915c-23.574 0-42.686-19.308-42.686-43.13a43.2 43.2 0 0 1 21.345-37.36a49.4 49.4 0 0 1-4.088-19.727C17.385 22.336 39.626.128 67.06.128c16.106 0 30.42 7.658 39.494 19.523" />
    </svg>
  );
}

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" className={className}>
      <path fill="#36c5f0" d="M53.841 161.32c0 14.832-11.987 26.819-26.819 26.819S.204 176.152.204 161.32s11.987-26.819 26.818-26.819h26.819zm13.41 0c0-14.831 11.987-26.818 26.818-26.818s26.82 11.987 26.82 26.818v67.25c0 14.832-11.988 26.82-26.82 26.82s-26.818-11.988-26.818-26.82z" />
      <path fill="#2eb67d" d="M94.069 53.841c-14.831 0-26.818-11.987-26.818-26.819S79.238.204 94.07.204s26.819 11.987 26.819 26.818v26.819zm0 13.41c14.831 0 26.819 11.987 26.819 26.818s-11.988 26.82-26.819 26.82H26.82C11.987 120.889 0 108.9 0 94.069s11.987-26.818 26.819-26.818z" />
      <path fill="#e01e5a" d="M201.55 94.069c0-14.831 11.987-26.818 26.819-26.818s26.818 11.987 26.818 26.818s-11.987 26.819-26.818 26.819h-26.82zm-13.41 0c0 14.831-11.988 26.819-26.819 26.819s-26.819-11.988-26.819-26.82V26.82C134.502 11.987 146.489 0 161.32 0s26.819 11.987 26.819 26.819z" />
      <path fill="#ecb22e" d="M161.32 201.55c14.832 0 26.82 11.987 26.82 26.818s-11.988 26.82-26.82 26.82c-14.831 0-26.818-11.988-26.818-26.82V201.55zm0-13.41c-14.831 0-26.818-11.988-26.818-26.82c0-14.831 11.987-26.818 26.819-26.818h67.25c14.832 0 26.82 11.987 26.82 26.819s-11.988 26.819-26.82 26.819z" />
    </svg>
  );
}

function ZapierLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" className={className}>
      <path fill="#FF4A00" d="M128.08 0c7.231 0 13.298 5.437 14.156 12.636l9.645 80.893l76.712-28.752a14.28 14.28 0 0 1 18.064 7.424a14.2 14.2 0 0 1-7.424 18.423l-77.069 28.877l66.974 48.654a14.27 14.27 0 0 1 2.378 19.467a14.24 14.24 0 0 1-19.475 2.378l-67.332-48.914l9.743 81.716a14.27 14.27 0 0 1-12.533 15.894a14.25 14.25 0 0 1-15.895-12.534l-9.742-81.716l-67.333 48.914a14.27 14.27 0 0 1-19.475-2.378a14.23 14.23 0 0 1 2.378-19.467l66.974-48.654l-77.069-28.877a14.25 14.25 0 0 1-7.424-18.423a14.27 14.27 0 0 1 18.064-7.424l76.712 28.752l9.645-80.893A14.27 14.27 0 0 1 128.08 0" />
    </svg>
  );
}

function GoogleDriveLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 238" aria-hidden="true" className={className}>
      <path fill="#fec700" d="M165.7 158.4L204.6 91.1L128 91.1L89.1 158.4z" />
      <path fill="#3186ff" d="M47.7 225.7L86.6 158.4L9.9 25.6L1 42.8z" />
      <path fill="#0ebc5f" d="M165.7 158.4L204.6 225.7H47.7L86.6 158.4z" />
    </svg>
  );
}

function GoogleSheetsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" className={className}>
      <rect width="256" height="256" rx="36" fill="#0F9D58" />
      <path fill="#fff" d="M72 64h112v128H72z" opacity="0.3" />
      <path fill="#fff" d="M84 96h88v16H84zm0 28h88v16H84zm0 28h88v16H84z" />
    </svg>
  );
}

function GoogleAnalyticsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" className={className}>
      <circle cx="56" cy="192" r="32" fill="#E37400" />
      <rect x="104" y="96" width="48" height="128" rx="24" fill="#F9AB00" />
      <rect x="176" y="32" width="48" height="192" rx="24" fill="#F9AB00" />
    </svg>
  );
}

const APP_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Slack: SlackLogo,
  GitHub: GithubLogo,
  Salesforce: SalesforceLogo,
  "Google Slides": GoogleSheetsLogo,
  Notion: NotionLogo,
  "Google Drive": GoogleDriveLogo,
  Zapier: ZapierLogo,
  Airtable: AirtableLogo,
  OpenAI: OpenaiLogo,
  Gemini: GeminiLogo,
  Claude: ClaudeLogo,
  "Google Sheets": GoogleSheetsLogo,
  "Google Analytics": GoogleAnalyticsLogo,
};

const STAGE_CATEGORY_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  sources: ({ size = 16, className }) => <Cable size={size} className={className} />,
  context: ({ size = 16, className }) => <FilePen size={size} className={className} />,
  ai: ({ size = 16, className }) => <Cpu size={size} className={className} />,
  automation: ({ size = 16, className }) => <Workflow size={size} className={className} />,
  outcomes: ({ size = 16, className }) => <TrendingUp size={size} className={className} />,
};

// ---------------------------------------------------------------------------
// 3. WORKFLOW STAGES CONFIGURATION
// ---------------------------------------------------------------------------
const STAGES = [
  {
    title: "Connected Sources",
    items: ["Apps", "Documents", "Business Data"],
    apps: ["Slack", "GitHub", "Salesforce"],
    icon: "sources",
    side: "right" as const,
  },
  {
    title: "Business Context",
    items: ["Knowledge", "Memory", "User Context"],
    apps: ["Google Drive", "Notion", "Google Sheets"],
    icon: "context",
    side: "left" as const,
  },
  {
    title: "AI Intelligence",
    items: ["Reasoning", "Analysis", "Decisions"],
    apps: ["OpenAI", "Gemini", "Claude"],
    icon: "ai",
    side: "right" as const,
    main: true,
  },
  {
    title: "Workflow Automation",
    items: ["Triggers", "Actions", "Processes"],
    apps: ["Zapier", "Slack", "Airtable"],
    icon: "automation",
    side: "left" as const,
  },
  {
    title: "Business Outcomes",
    items: ["Reports", "Insights", "Results"],
    apps: ["Notion", "Google Sheets", "Google Analytics"],
    icon: "outcomes",
    side: "right" as const,
  },
];

// ---------------------------------------------------------------------------
// 4. SUBCOMPONENTS (3D PLATES, CRYSTALS, CONNECTORS, CARDS)
// ---------------------------------------------------------------------------

function Fastener({ slab, x, y }: { slab: { half: number; top: number }; x: number; y: number }) {
  const [px, py] = project(x, y, CENTER_X, slab.top);
  return (
    <g transform={`translate(${px.toFixed(2)} ${py.toFixed(2)}) matrix(0.866 0.5 -0.866 0.5 0 0)`}>
      <circle r="6.5" fill="var(--n3-plate-side-0)" stroke="var(--n3-plate-stroke)" strokeWidth="1" />
    </g>
  );
}

function PanelLine({
  slab,
  side,
  v,
  from = 0.14,
  to = 0.86,
}: {
  slab: { half: number; top: number; depth: number };
  side: "left" | "right";
  v: number;
  from?: number;
  to?: number;
}) {
  const [x1, y1] = facePoint(slab, side, from, v);
  const [x2, y2] = facePoint(slab, side, to, v);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--n3-plate-stroke)" strokeWidth="0.9" opacity="0.55" />;
}

function SlabBody({ slab }: { slab: { half: number; radius: number; top: number; depth: number } }) {
  return (
    <g>
      <path d={bodyPath(slab)} fill="url(#n3-side)" />
      <path d={bodyPath(slab)} fill="url(#n3-side-shade)" />
      <path d={bodyPath(slab)} fill="none" stroke="var(--n3-plate-stroke)" strokeWidth="1" opacity="0.85" />
    </g>
  );
}

function SlabTop({
  slab,
  groove,
}: {
  slab: { half: number; radius: number; top: number };
  groove?: number;
}) {
  return (
    <g>
      <path d={topPath(slab)} fill="url(#n3-bevel)" stroke="var(--n3-plate-stroke)" strokeWidth="1" />
      <path d={topPath(slab, 4.5)} fill="url(#n3-top)" stroke="var(--n3-plate-top-0)" strokeWidth="1" opacity="1" />
      {groove !== undefined && (
        <path d={topPath(slab, groove)} fill="none" stroke="var(--n3-plate-stroke)" strokeWidth="1.2" />
      )}
    </g>
  );
}

// Signature WIZZO logo on the core top plate
function CoreTopLogo({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 12}) scale(0.12) matrix(0.866 0.5 -0.866 0.5 0 0)`}>
      <g transform="translate(-750, -750)">
        {/* Lower wave */}
        <path
          fill="var(--ink)"
          d="M 375.92 787.95 L 513.67 773.47 C 547.98 769.87 582.13 781.70 606.86 805.76 L 703.25 899.56 C 726.79 922.47 759.26 933.78 791.93 930.45 L 887.61 920.69 L 769.35 1020.82 C 722.61 1060.41 653.44 1058.01 609.54 1015.29 Z"
        />
        {/* Middle wave */}
        <path
          fill="var(--ink)"
          d="M 417.59 752.86 L 604.97 733.96 C 637.58 730.67 669.98 741.97 693.48 764.83 L 793.83 862.47 C 836.69 904.18 904.22 906.52 949.87 867.88 L 1073.31 763.36 L 971.83 773.61 C 939.20 776.91 906.79 765.61 883.29 742.74 L 749.54 612.57 C 705.66 569.88 636.54 567.48 589.82 607.04 Z"
        />
        {/* Upper accent shape */}
        <path
          fill="var(--electric)"
          d="M 1124.38 453.77 L 1118.45 612.45 L 1115.34 696.12 L 1041.98 703.52 C 1009.35 706.82 976.92 695.50 953.42 672.64 L 819.63 542.42 C 788.43 512.07 744.47 502.09 704.87 513.07 L 744.84 479.23 C 771.43 456.70 805.39 447.91 837.68 452.58 Z"
        />
      </g>
    </g>
  );
}

// Exploded Plate wrapper using direct useTransform
function Plate({
  index,
  progress,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, (p) => plateY(index, p));
  const scale = useTransform(progress, (p) => plateScale(index, p));
  const shadowOpacity = useTransform(progress, (p) => (index > 0 ? p * 0.28 : 0));
  const slab = SLABS_E[index];

  return (
    <motion.g style={{ y, scale }}>
      {index > 0 && (
        <motion.path
          d={topPath(slab, -6, CENTER_X, slab.depth + 34)}
          fill="rgba(0,0,0,0.22)"
          filter="url(#n3-blur-spill)"
          style={{ opacity: shadowOpacity }}
        />
      )}
      {children}
    </motion.g>
  );
}

// Stage Card Body component (unified layout for all 5 stages, no badges)
function StageCardBody({ index }: { index: number }) {
  const stage = STAGES[index];
  const isMain = stage.main;
  const CategoryIcon = STAGE_CATEGORY_ICONS[stage.icon || "sources"];

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Row 1: Header (Number + Category Icon + Stage Title) */}
      <div className="flex items-center gap-1.5 min-w-0 w-full">
        <span className="text-[10px] xl:text-[11px] font-semibold tabular-nums text-ink-3 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h4 className="flex items-center gap-1 xl:gap-1.5 text-[11px] xl:text-[12px] font-semibold text-ink whitespace-nowrap">
          {CategoryIcon && (
            <CategoryIcon
              size={12}
              className={isMain ? "text-electric shrink-0" : "text-ink-3 shrink-0"}
            />
          )}
          <span>{stage.title}</span>
        </h4>
      </div>

      {/* Row 2: Subtitle Items (Stacked on left) + App Icons (Row on right) */}
      <div className="flex items-end justify-between gap-1 w-full pt-0.5">
        <div className="flex flex-col text-[8px] xl:text-[9px] leading-[1.25] text-ink-2/80 shrink-0">
          {stage.items.map((item, i) => (
            <span key={item} className="whitespace-nowrap">
              {item}
              {i < stage.items.length - 1 ? " ·" : ""}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0 self-end pb-0.5">
          {stage.apps.map((app) => {
            const AppLogo = APP_ICONS[app];
            if (!AppLogo) return null;
            return (
              <span
                key={app}
                className="grid size-4.5 xl:size-5 place-items-center rounded bg-surface border border-line/60 p-0.5 shadow-2xs transition-transform hover:scale-110"
                title={app}
              >
                <AppLogo className="size-2.5 xl:size-3" />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Floating Stage Card driven by MotionValues
function StageCard({
  index,
  progress,
  open,
  lit,
  onHover,
}: {
  index: number;
  progress: MotionValue<number>;
  open: boolean;
  lit: boolean;
  onHover: (idx: number | null) => void;
}) {
  const stage = STAGES[index];
  const { edge, width } = MR[stage.side];
  const leftPct = stage.side === "left" ? edge : 100 - edge - width;
  const topPct = (cornerY(index) / 1000) * 100;

  const cardDirection = stage.side === "left" ? -1 : 1;
  const cardOpacity = useTransform(progress, [0.35, 0.9], [0, 1]);
  const cardX = useTransform(progress, [0, 1], [-cardDirection * MR.restInset, 0]);

  return (
    <li
      style={{
        top: `${topPct}%`,
        left: `${leftPct}%`,
        width: `${width}%`,
      }}
      className="absolute -translate-y-1/2 list-none"
    >
      <motion.div
        style={{
          opacity: cardOpacity,
          x: cardX,
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") onHover(index);
        }}
        onPointerLeave={() => onHover(null)}
        className={cn(
          "n3-stage-card px-2.5 py-2 xl:px-3 xl:py-2.5 transition-all duration-300",
          open ? "pointer-events-auto" : "pointer-events-none",
          stage.main && "border-electric/70 shadow-xs ring-1 ring-electric/25",
          lit && "n3-stage-card-lit scale-[1.02]"
        )}
      >
        <StageCardBody index={index} />
      </motion.div>
    </li>
  );
}

// Stage Connectors (leader lines between plates and cards)
function StageConnectors({
  progress,
  hovered,
}: {
  progress: MotionValue<number>;
  hovered: number | null;
}) {
  const lineOpacity = useTransform(progress, [0.25, 0.85], [0, 1]);

  return (
    <motion.div
      style={{ opacity: lineOpacity }}
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      {STAGES.map((stage, idx) => {
        const { edge, width } = MR[stage.side];
        const cardX = (stage.side === "left" ? edge + width : 100 - edge - width) * 10;
        const plateNodeX = tipX(idx, stage.side);
        const y = cornerY(idx);
        const isHovered = hovered === idx;

        return (
          <svg
            key={stage.title}
            viewBox="0 0 1000 1000"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            aria-hidden="true"
          >
            {/* Base leader line */}
            <line
              x1={plateNodeX}
              x2={cardX}
              y1={y}
              y2={y}
              stroke="var(--n3-line-color)"
              strokeWidth="1"
              strokeDasharray={stage.main ? "none" : "3 3"}
            />
            {/* Active highlight line */}
            <line
              x1={plateNodeX}
              x2={cardX}
              y1={y}
              y2={y}
              stroke="var(--electric)"
              strokeWidth={isHovered || stage.main ? "1.5" : "1"}
              opacity={isHovered ? 0.95 : stage.main ? 0.5 : 0}
            />
            {/* Plate junction dot */}
            <circle cx={plateNodeX} cy={y} r="3" fill="var(--n3-plate-stroke)" />
            {/* Card junction dot */}
            <circle
              cx={cardX}
              cy={y}
              r={stage.main ? 4.5 : 3.5}
              fill="var(--electric)"
              opacity={isHovered || stage.main ? 1 : 0.6}
            />
          </svg>
        );
      })}
    </motion.div>
  );
}

// Orbital Crystals System
const ORBIT_CRYSTALS = [
  { ring: 0, angle: 30, size: 7 },
  { ring: 0, angle: 120, size: 5.5 },
  { ring: 0, angle: 210, size: 7.5 },
  { ring: 0, angle: 300, size: 6 },
  { ring: 1, angle: 15, size: 7.5 },
  { ring: 1, angle: 85, size: 6 },
  { ring: 1, angle: 160, size: 8 },
  { ring: 1, angle: 235, size: 5 },
  { ring: 1, angle: 310, size: 7 },
];

function OrbitalCrystal({ size }: { size: number }) {
  return (
    <g>
      <circle r={size * 1.4} fill="var(--electric)" opacity="0.2" />
      <circle r={size} fill="var(--electric)" opacity="0.8" />
      <circle r={size * 0.45} cx={-size * 0.25} cy={-size * 0.25} fill="#FFFFFF" opacity="0.9" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// 5. MAIN HERO COMPONENT
// ---------------------------------------------------------------------------
export function HeroSection() {
  const reduce = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isExploded, setIsExploded] = useState(false);

  // Motion values
  const rawProgress = useMotionValue(0);
  const progressSpring = useSpring(rawProgress, RI.spring);

  useEffect(() => {
    rawProgress.set(isExploded ? 1 : 0);
  }, [isExploded, rawProgress]);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), {
    stiffness: 120,
    damping: 20,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsExploded(false);
    setHoveredIndex(null);
  };

  return (
    <section
      id="hero"
      aria-label="WIZZO Solutions Hero"
      className="relative isolate min-h-0 lg:min-h-[85svh] flex flex-col justify-center overflow-hidden pt-16 pb-6 sm:pt-24 sm:pb-12 md:pt-26 md:pb-14 lg:pt-32 lg:pb-18 xl:pt-36 xl:pb-22"
    >
      {/* ------------------------------------------------------------------ */}
      {/* BACKGROUND FLOORS: Perspective Diamond Grid & Cursor Spotlight     */}
      {/* ------------------------------------------------------------------ */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Soft radial glow centered behind 3D visual */}
        <div
          className="absolute right-[5%] top-1/2 -translate-y-1/2 size-[320px] sm:size-[650px] rounded-full blur-[90px] sm:blur-[110px] opacity-25 dark:opacity-40"
          style={{ background: "radial-gradient(circle, var(--electric) 0%, transparent 70%)" }}
        />
        {/* Full-bleed seamless diamond grid with smooth radial falloff */}
        <div
          className="absolute inset-0 size-full opacity-30 dark:opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(45deg, var(--n3-grid-line, var(--line)) 1px, transparent 1px),
              linear-gradient(-45deg, var(--n3-grid-line, var(--line)) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, black 15%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, black 15%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-5 sm:gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-12 xl:gap-16 2xl:gap-20">
          {/* ---------------------------------------------------------------- */}
          {/* LEFT COLUMN: Outcome Headline, Copy, 3D Flip CTAs & Metrics       */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex flex-col items-start text-left z-10 w-full max-w-full lg:max-w-[460px] xl:max-w-[510px] 2xl:max-w-[560px]">
            {/* Display Headline */}
            <motion.h1
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-[26px] leading-[31px] sm:text-[36px] sm:leading-[42px] md:text-[40px] md:leading-[46px] lg:text-[38px] lg:leading-[44px] xl:text-[48px] xl:leading-[54px] 2xl:text-[54px] 2xl:leading-[60px] font-bold tracking-tight text-ink"
            >
              <span className="block">Custom software &</span>
              <span className="block">intelligent workflows</span>
              <span className="block">
                engineered to <span className="text-electric">scale.</span>
              </span>
            </motion.h1>

            {/* Body Description */}
            <motion.p
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2.5 sm:mt-5 text-[13px] sm:text-base lg:text-base xl:text-lg leading-relaxed text-ink-2 max-w-[500px] xl:max-w-[540px]"
            >
              We engineer high-performance web applications, automated operational pipelines, and mission-critical API architectures tailored to how your enterprise works.
            </motion.p>

            {/* CTAs with Syntra 3D Cube-Flip interaction */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              {/* Primary 3D Flip Button */}
              <Link
                href="#contact"
                className="n3-flip group relative inline-flex h-11 sm:h-12 items-center justify-center rounded-lg bg-electric px-5 sm:px-6 text-sm font-semibold text-white shadow-md shadow-electric/25 transition-all hover:bg-electric-dark hover:shadow-lg hover:shadow-electric/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg w-full sm:w-auto whitespace-nowrap shrink-0"
              >
                <span className="n3-flip-box">
                  <span className="n3-flip-face gap-2">
                    <span>Schedule consultation</span>
                    <ArrowRight size={15} />
                  </span>
                  <span aria-hidden="true" className="n3-flip-face n3-flip-back gap-2">
                    <span>Schedule consultation</span>
                    <ArrowRight size={15} />
                  </span>
                </span>
              </Link>
            </motion.div>

            {/* Key Outcomes / Badges */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3.5 sm:mt-7 flex flex-wrap items-center gap-x-3.5 sm:gap-x-6 gap-y-1.5 text-[11px] sm:text-sm text-ink-2 font-medium"
            >
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 size={15} className="text-electric shrink-0" />
                Next.js & React 19
              </span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 size={15} className="text-electric shrink-0" />
                Enterprise PostgreSQL
              </span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 size={15} className="text-electric shrink-0" />
                REST & Microservices
              </span>
            </motion.div>

            {/* Metrics Row */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 border-t border-line/70 pt-3.5 sm:pt-6 w-full max-w-[480px]"
            >
              <div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-ink font-bold text-base sm:text-lg xl:text-xl">
                  <ShieldCheck size={16} className="text-electric sm:size-[18px]" />
                  <span>99.9%</span>
                </div>
                <p className="mt-0.5 text-[10px] sm:text-xs text-ink-3">System Uptime</p>
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-ink font-bold text-base sm:text-lg xl:text-xl">
                  <Star size={16} className="text-electric sm:size-[18px]" />
                  <span>4.9 / 5</span>
                </div>
                <p className="mt-0.5 text-[10px] sm:text-xs text-ink-3">Client Satisfaction</p>
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-ink font-bold text-base sm:text-lg xl:text-xl">
                  <Users size={16} className="text-electric sm:size-[18px]" />
                  <span>10K+</span>
                </div>
                <p className="mt-0.5 text-[10px] sm:text-xs text-ink-3">Active Workflows</p>
              </div>
            </motion.div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* RIGHT COLUMN: 3D ISOMETRIC CORE & EXPANDABLE STAGE CARDS         */}
          {/* ---------------------------------------------------------------- */}
          <div
            className="relative flex items-center justify-center lg:justify-end select-none w-full mt-1 sm:mt-4 lg:mt-0"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            {/* Tilted 3D Container */}
            <div className="relative w-full aspect-square max-w-[260px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[460px] xl:max-w-[580px] 2xl:max-w-[650px]">
              <motion.div
                style={{
                  rotateX: reduce ? 0 : rotateXSpring,
                  rotateY: reduce ? 0 : rotateYSpring,
                }}
                className="n3-float relative size-full [perspective:1400px] [transform-style:preserve-3d]"
              >
                {/* 1. Technical Backdrop SVG: Crosshairs, Axes & Orbit Lines */}
                <svg
                  viewBox="0 0 1000 1000"
                  className="pointer-events-none absolute inset-0 size-full overflow-visible opacity-50 dark:opacity-35"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="n3-axis-v" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="var(--n3-plate-stroke)" stopOpacity="0" />
                      <stop offset="0.5" stopColor="var(--n3-plate-stroke)" stopOpacity="0.7" />
                      <stop offset="1" stopColor="var(--n3-plate-stroke)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="n3-axis-h" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="var(--n3-plate-stroke)" stopOpacity="0" />
                      <stop offset="0.5" stopColor="var(--n3-plate-stroke)" stopOpacity="0.7" />
                      <stop offset="1" stopColor="var(--n3-plate-stroke)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Axis lines */}
                  <rect x={CENTER_X - 0.5} y="150" width="1" height="700" fill="url(#n3-axis-v)" />
                  <rect x="150" y={CENTER_Y - 0.5} width="700" height="1" fill="url(#n3-axis-h)" />
                  {/* Crosshairs */}
                  {([
                    [240, 310],
                    [760, 690],
                    [760, 310],
                    [240, 690],
                  ] as const).map(([cx, cy]) => (
                    <path
                      key={`${cx}-${cy}`}
                      d={`M${cx - 5} ${cy}h10M${cx} ${cy - 5}v10`}
                      stroke="var(--n3-plate-stroke)"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Orbital ring ellipses */}
                  <g fill="none" stroke="var(--n3-plate-stroke)" strokeWidth="1">
                    <ellipse cx={CENTER_X} cy={CENTER_Y} rx={RING_RADII[0]} ry={RING_RADII[0] * COMPRESS_Y} opacity="0.6" />
                    <ellipse cx={CENTER_X} cy={CENTER_Y} rx={RING_RADII[1]} ry={RING_RADII[1] * COMPRESS_Y} opacity="0.45" />
                  </g>
                  {/* Rotating orbital crystals */}
                  {!reduce &&
                    ORBIT_CRYSTALS.map((c, i) => {
                      const rad = RING_RADII[c.ring];
                      const dur = c.ring === 0 ? 60 : 85;
                      return (
                        <g key={i}>
                          <animateMotion
                            dur={`${dur}s`}
                            repeatCount="indefinite"
                            path={ringPath(rad)}
                            begin={`-${(i * (dur / ORBIT_CRYSTALS.length)).toFixed(1)}s`}
                          />
                          <OrbitalCrystal size={c.size} />
                        </g>
                      );
                    })}
                </svg>

                {/* 2. Exploded Isometric Core SVG */}
                <svg
                  viewBox="0 0 1000 1000"
                  className="absolute inset-0 size-full cursor-pointer overflow-visible"
                  role="img"
                  aria-label="WIZZO Intelligent System Architecture Core"
                  onMouseEnter={() => setIsExploded(true)}
                  onClick={() => setIsExploded((p) => !p)}
                >
                  <defs>
                    <filter id="n3-blur-spill" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="14" />
                    </filter>
                    <filter id="n3-blur-glow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="18" />
                    </filter>
                    {/* Dynamic Theme Gradients */}
                    <linearGradient id="n3-top" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" style={{ stopColor: "var(--n3-plate-top-0)" }} />
                      <stop offset="1" style={{ stopColor: "var(--n3-plate-top-1)" }} />
                    </linearGradient>
                    <linearGradient id="n3-bevel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" style={{ stopColor: "var(--n3-plate-bevel)" }} />
                      <stop offset="1" style={{ stopColor: "var(--n3-plate-side-0)" }} />
                    </linearGradient>
                    <linearGradient id="n3-side" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" style={{ stopColor: "var(--n3-plate-side-0)" }} />
                      <stop offset="0.5" style={{ stopColor: "var(--n3-plate-side-1)" }} />
                      <stop offset="1" style={{ stopColor: "var(--n3-plate-side-0)" }} />
                    </linearGradient>
                    <linearGradient id="n3-side-shade" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="var(--n3-plate-shade)" stopOpacity="0.4" />
                      <stop offset="1" stopColor="var(--n3-plate-shade)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Plate 0: Bottom Plate (Stage 01 Connected Sources) */}
                  <Plate index={0} progress={progressSpring}>
                    <SlabBody slab={SLABS_E[0]} />
                    <SlabTop slab={SLABS_E[0]} groove={16} />
                    <PanelLine slab={SLABS_E[0]} side="left" v={0.5} />
                    <PanelLine slab={SLABS_E[0]} side="right" v={0.5} />
                    <Fastener slab={SLABS_E[0]} x={0} y={-SLABS_E[0].half + 30} />
                    <Fastener slab={SLABS_E[0]} x={0} y={SLABS_E[0].half - 30} />
                  </Plate>

                  {/* Plate 1: Stage 02 Business Context */}
                  <Plate index={1} progress={progressSpring}>
                    <SlabBody slab={SLABS_E[1]} />
                    <SlabTop slab={SLABS_E[1]} groove={14} />
                    <PanelLine slab={SLABS_E[1]} side="left" v={0.6} />
                    <PanelLine slab={SLABS_E[1]} side="right" v={0.6} />
                    <Fastener slab={SLABS_E[1]} x={-SLABS_E[1].half + 30} y={0} />
                    <Fastener slab={SLABS_E[1]} x={SLABS_E[1].half - 30} y={0} />
                  </Plate>

                  {/* Plate 2: Stage 03 AI Intelligence & Core Seam (MAIN LAYER) */}
                  <Plate index={2} progress={progressSpring}>
                    {/* Glowing Core Seam */}
                    <g className="n3-seam-pulse">
                      <path
                        d={topPath(SLAB_VT, 4, CENTER_X, 0)}
                        fill="var(--electric)"
                        opacity="0.35"
                        filter="url(#n3-blur-spill)"
                      />
                      <path
                        d={bodyPath(SLAB_VT)}
                        fill="var(--electric)"
                        opacity="0.7"
                        filter="url(#n3-blur-glow)"
                      />
                    </g>
                    <SlabBody slab={SLAB_VT} />
                    <SlabTop slab={SLAB_VT} groove={11} />
                    <PanelLine slab={SLAB_VT} side="left" v={0.78} />
                    <PanelLine slab={SLAB_VT} side="right" v={0.78} />
                    <Fastener slab={SLAB_VT} x={0} y={-SLAB_VT.half + 28} />
                    <Fastener slab={SLAB_VT} x={0} y={SLAB_VT.half - 28} />
                    <Fastener slab={SLAB_VT} x={-SLAB_VT.half + 28} y={0} />
                    <Fastener slab={SLAB_VT} x={SLAB_VT.half - 28} y={0} />
                  </Plate>

                  {/* Plate 3: Stage 04 Workflow Automation */}
                  <Plate index={3} progress={progressSpring}>
                    <SlabBody slab={SLABS_E[3]} />
                    <SlabTop slab={SLABS_E[3]} groove={10} />
                    <PanelLine slab={SLABS_E[3]} side="left" v={0.55} />
                    <PanelLine slab={SLABS_E[3]} side="right" v={0.55} />
                    <Fastener slab={SLABS_E[3]} x={-SLABS_E[3].half + 24} y={0} />
                    <Fastener slab={SLABS_E[3]} x={SLABS_E[3].half - 24} y={0} />
                  </Plate>

                  {/* Plate 4: Top Plate (Stage 05 Business Outcomes & WIZZO Emblem) */}
                  <Plate index={4} progress={progressSpring}>
                    <SlabBody slab={SLABS_E[4]} />
                    <SlabTop slab={SLABS_E[4]} groove={8} />
                    {/* WIZZO Brand Mark embedded into top plate */}
                    <CoreTopLogo x={CENTER_X} y={SLAB_QN.top} />
                  </Plate>
                </svg>

                {/* 3. Stage Connectors (Leader Lines + Traveling Signal Beads) */}
                <StageConnectors
                  progress={progressSpring}
                  hovered={hoveredIndex}
                />

                {/* 4. Desktop Floating Stage Cards */}
                <ul
                  aria-label="Workflow Architecture Stages"
                  className="pointer-events-none absolute inset-0 hidden list-none p-0 md:block"
                >
                  {STAGES.map((stage, idx) => (
                    <StageCard
                      key={stage.title}
                      index={idx}
                      progress={progressSpring}
                      open={isExploded}
                      lit={hoveredIndex === idx}
                      onHover={setHoveredIndex}
                    />
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MOBILE STAGE LIST: Clean Responsive Grid for Screen Widths < 768px */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-4 block md:hidden">
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-semibold text-ink">5-Layer Architecture Engine</h3>
            <span className="text-[11px] text-electric font-medium">Interactive Stages</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STAGES.map((stage, idx) => (
              <div
                key={stage.title}
                className={cn(
                  "n3-stage-card p-2.5",
                  idx === STAGES.length - 1 && "col-span-2",
                  stage.main && "border-electric/50 shadow-xs"
                )}
              >
                <StageCardBody index={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
