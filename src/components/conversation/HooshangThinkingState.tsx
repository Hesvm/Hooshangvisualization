"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  usePresence,
  useReducedMotion,
} from "motion/react";
import styles from "./HooshangThinkingState.module.css";

/** Refined, non-elastic easing used across the whole thinking module. */
const EASE = [0.22, 0.61, 0.36, 1] as const;

const APPEAR_DELAY_MS = 520; // wait before showing, so quick beats never flash
const LOGO_HOLD_MS = 90; // brief hold on the real silhouette before morphing
const MORPH_IN_MS = 460; // silhouette → circle
const MIN_ACTIVE_MS = 5500; // real "thinking" needs to read as deliberate, not decorative
const MORPH_OUT_MS = 400; // circle → silhouette on exit
const SETTLE_MS = 280; // dots settle to 3 equal circles before the exit morph starts
const PHRASE_INTERVAL_MS = 2600;

// One dot's full shape-cycle: transition between shapes, then a brief hold.
const DOT_TRANSITION_S = 0.42;
const DOT_HOLD_MS = 300;
const DOT_LOOP_MS = (DOT_TRANSITION_S * 1000 + DOT_HOLD_MS) * 4;
// Stagger so the 3 dots are always a different shape from one another —
// a travelling wave, not a synchronized pulse.
const DOT_STAGGER = 1;

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/**
 * Real Hooshang silhouette (outer subpath only — the two eye holes from
 * `public/Hooshang pure logo.svg` are dropped so the thinking dots can be their
 * own animated layer), and a circle authored with the *identical* command
 * structure (M,C,V,C,H,C,V,C,Z) so the two `d` strings interpolate number-for-
 * number into one continuously morphing shape. viewBox is 0 0 23 21.
 */
const SILHOUETTE_D =
  "M11.0879 0C17.2111 0.000240171 22.1748 4.96461 22.1748 11.0879V16.7539C22.1748 19.0672 20.2996 20.9433 17.9863 20.9434H4.18848C1.87524 20.9433 0 19.0672 0 16.7539V11.0879C0 4.96446 4.96446 0 11.0879 0Z";
const CIRCLE_D =
  "M11.09 0C16.874 0 21.56 4.686 21.56 10.47V10.47C21.56 16.254 16.874 20.94 11.09 20.94H11.09C5.306 20.94 0.62 16.254 0.62 10.47V10.47C0.62 4.686 5.306 0 11.09 0Z";

const SHELL_FILL = "#8F94AC"; // the real logo's own fill — constant through the morph

function pathNumbers(d: string): number[] {
  return (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
}
const SIL_N = pathNumbers(SILHOUETTE_D);
const CIRC_N = pathNumbers(CIRCLE_D);

/** Build the interpolated silhouette↔circle `d` at progress p (0 = logo, 1 = circle). */
function buildD(p: number): string {
  let i = 0;
  const v = () => {
    const x = SIL_N[i] + (CIRC_N[i] - SIL_N[i]) * p;
    i += 1;
    return Math.round(x * 100) / 100;
  };
  return (
    `M${v()} ${v()}` +
    `C${v()} ${v()} ${v()} ${v()} ${v()} ${v()}` +
    `V${v()}` +
    `C${v()} ${v()} ${v()} ${v()} ${v()} ${v()}` +
    `H${v()}` +
    `C${v()} ${v()} ${v()} ${v()} ${v()} ${v()}` +
    `V${v()}` +
    `C${v()} ${v()} ${v()} ${v()} ${v()} ${v()}Z`
  );
}

// Dot lanes are fixed in viewBox units and never move — left/right sit exactly
// on the real logo's eye-hole centres (from the source SVG's own path data),
// the centre lane only ever appears once the shell is a circle. Only each
// dot's own width/height animate; x/y stay pinned to these lane centres.
const LANE = { left: 7.21484, center: 10.6157, right: 13.98895, y: 10.1562 };

// The real eye holes are ~4.31 units wide — dots rest at exactly that size so
// they read as seamless fills of the silhouette's cutouts.
const REST = { w: 4.31, h: 4.31 };

// Active "equalizer" shapes. Width is kept well under the 3.39-unit lane
// spacing (max 2.1) so adjacent dots can never touch, let alone overlap —
// only height changes freely to read as short/tall pills. rx is always
// width/2, which stays a true stadium cap in every state since h ≥ w always.
const SHAPE = {
  compact: { w: 1.6, h: 1.6 },
  normal: { w: 2.1, h: 2.1 },
  pillShort: { w: 1.6, h: 2.8 },
  pillTall: { w: 1.6, h: 4.0 },
} as const;
const DOT_SEQUENCE = [SHAPE.pillTall, SHAPE.compact, SHAPE.normal, SHAPE.pillShort] as const;

type HooshangThinkingStateProps = {
  /** One or more Persian status phrases, cycled in order while mounted. */
  messages: readonly string[];
  appearDelayMs?: number;
  cycleMs?: number;
};

/**
 * The branded "Hooshang is thinking" moment, driven by explicit visual states
 * (hidden → entering → active → settling → exiting) rather than a repeating loop:
 *
 *   1. wait {@link APPEAR_DELAY_MS} (no flash on fast beats)
 *   2. show the real Hooshang silhouette with 2 dots ({@link LOGO_HOLD_MS})
 *   3. morph the *single* shell path silhouette → circle; the centre dot grows
 *      in and the outer dots shrink into their equalizer sizing, together
 *   4. hold the circle for at least {@link MIN_ACTIVE_MS}, all 3 dots running a
 *      staggered shape-cycle (never moving position, only width/height)
 *   5. on exit: finish the in-flight shape tween, settle all 3 dots to equal
 *      circles, fade the centre dot out, then morph the circle back to the
 *      silhouette before the component is removed
 *
 * Exit is coordinated through `usePresence`, so the caller wraps this in an
 * `<AnimatePresence>` (see `ThinkingBeat`) and the return morph actually plays.
 */
export function HooshangThinkingState({
  messages,
  appearDelayMs = APPEAR_DELAY_MS,
  cycleMs = PHRASE_INTERVAL_MS,
}: HooshangThinkingStateProps) {
  const reduceMotion = useReducedMotion();
  const [isPresent, safeToRemove] = usePresence();
  const rootRef = useRef<HTMLDivElement>(null);

  const progress = useMotionValue(0); // 0 = silhouette, 1 = circle
  // motion.path does not sync a MotionValue `d` to the DOM reliably, so mirror
  // the interpolated path into state on every frame of the progress value.
  const [dString, setDString] = useState(() => buildD(0));
  useMotionValueEvent(progress, "change", (p) => setDString(buildD(p)));
  const containerOpacity = useMotionValue(0);
  const containerY = useMotionValue(6);

  const [mounted, setMounted] = useState(false); // container visible (past appear delay)
  const [active, setActive] = useState(false); // circle reached → dots cycle
  const [settling, setSettling] = useState(false); // exit: dots resting as equal circles
  const [phraseIndex, setPhraseIndex] = useState(0);
  const activeAtRef = useRef(0);
  const mountedRef = useRef(false);
  const activeRef = useRef(false);

  const activePhrase = messages[phraseIndex % messages.length] ?? "";

  // Resolves once the circle has actually been reached, so an exit that's
  // requested while still mid morph-in waits for the forward morph to finish
  // instead of reversing a half-played animation.
  const activeReadyRef = useRef<{ promise: Promise<void>; resolve: () => void } | null>(null);
  if (!activeReadyRef.current) {
    let resolve = () => {};
    const promise = new Promise<void>((r) => {
      resolve = r;
    });
    activeReadyRef.current = { promise, resolve };
  }

  // ---- Enter sequence (phase-keyed effects, Strict-Mode-safe) ---------------
  // "delay" → "logo" → "circle". Each step is its own timer/animate effect so
  // React 18 Strict Mode's mount-time double-invoke (run → cleanup → run) simply
  // restarts a fresh timer/animation instead of stranding a stopped one — which
  // is what froze the morph when it lived inside one long async function.
  const [vphase, setVPhase] = useState<"delay" | "logo" | "circle">("delay");

  useEffect(() => {
    const t = window.setTimeout(() => setVPhase(reduceMotion ? "circle" : "logo"), appearDelayMs);
    return () => window.clearTimeout(t);
  }, [reduceMotion, appearDelayMs]);

  // First time we leave "delay": reveal the container.
  useEffect(() => {
    if (vphase === "delay" || mountedRef.current) return;
    mountedRef.current = true;
    setMounted(true);
    animate(containerOpacity, 1, { duration: reduceMotion ? 0.15 : 0.28, ease: EASE });
    animate(containerY, 0, { duration: reduceMotion ? 0.15 : 0.34, ease: EASE });
    const raf = window.requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [vphase, reduceMotion, containerOpacity, containerY]);

  // Brief hold on the silhouette, then advance to the circle.
  useEffect(() => {
    if (vphase !== "logo") return;
    const t = window.setTimeout(() => setVPhase("circle"), LOGO_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [vphase]);

  // Drive the shell morph from the phase. Reduced motion keeps the silhouette.
  useEffect(() => {
    if (vphase === "delay") return;
    if (reduceMotion) {
      if (!activeRef.current) {
        activeRef.current = true;
        activeAtRef.current = performance.now();
        setActive(true);
        activeReadyRef.current?.resolve();
      }
      return;
    }
    const c = animate(progress, vphase === "circle" ? 1 : 0, { duration: MORPH_IN_MS / 1000, ease: EASE });
    if (vphase === "circle") {
      c.finished
        .then(() => {
          activeRef.current = true;
          activeAtRef.current = performance.now();
          setActive(true);
          activeReadyRef.current?.resolve();
        })
        .catch(() => {});
    }
    return () => c.stop();
  }, [vphase, reduceMotion, progress]);

  // ---- Exit sequence (coordinated via usePresence) --------------------------
  useEffect(() => {
    if (isPresent) return;
    let cancelled = false;

    const leave = async () => {
      // Fast finish before we ever showed: remove without a flash.
      if (!mountedRef.current) {
        safeToRemove();
        return;
      }
      // Never interrupt a forward morph in progress — let it reach the circle
      // first, then respect the minimum visible time from that point.
      await activeReadyRef.current?.promise;
      if (cancelled) return;

      // Enforce the minimum, but always land on a dot-loop boundary so a
      // beat that finishes early ends its *current* equalizer cycle cleanly
      // instead of being cut mid-shape.
      const elapsed = performance.now() - activeAtRef.current;
      const floor = Math.max(MIN_ACTIVE_MS, Math.ceil(elapsed / DOT_LOOP_MS) * DOT_LOOP_MS);
      const remaining = floor - elapsed;
      if (remaining > 0) await wait(remaining);
      if (cancelled) return;

      // Settle all 3 dots to equal circles before anything else moves.
      if (!reduceMotion) {
        setSettling(true);
        await wait(SETTLE_MS);
        if (cancelled) return;
      }

      // Centre dot fades out, outer dots return to resting size, shell morphs back.
      setActive(false);
      setSettling(false);
      activeRef.current = false;
      if (!reduceMotion) {
        const back = animate(progress, 0, { duration: MORPH_OUT_MS / 1000, ease: EASE });
        animate(containerOpacity, 0, { duration: MORPH_OUT_MS / 1000, ease: EASE, delay: 0.05 });
        await back.finished.catch(() => {});
      } else {
        animate(containerOpacity, 0, { duration: 0.15 });
        await wait(150);
      }
      if (cancelled) return;
      safeToRemove();
    };
    leave();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent]);

  // ---- Phrase cycling (isolated: never restarts the shell morph) ------------
  useEffect(() => {
    if (!mounted || messages.length < 2) return;
    const id = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % messages.length);
    }, cycleMs);
    return () => window.clearInterval(id);
  }, [mounted, messages.length, cycleMs]);

  return (
    <motion.div
      ref={rootRef}
      className={styles.wrap}
      role="status"
      aria-label={activePhrase || "در حال آماده‌سازی پاسخ"}
      style={{ opacity: containerOpacity, y: containerY }}
    >
      <div className={styles.inner}>
        <MorphingLogo d={dString} active={active} settling={settling} reduceMotion={!!reduceMotion} />

        <div className={styles.textSlot}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={phraseIndex % messages.length}
              className={`${styles.text} ${reduceMotion ? "" : styles.shimmer}`}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
              transition={{ duration: reduceMotion ? 0.15 : 0.28, ease: EASE }}
            >
              {activePhrase}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * One continuously visible shape (`<motion.path>` whose `d` is the interpolated
 * silhouette↔circle) plus a separate 3-dot group. No opacity crossfade of two
 * shells — the shell is a single morphing path.
 */
function MorphingLogo({
  d,
  active,
  settling,
  reduceMotion,
}: {
  d: string;
  active: boolean;
  settling: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div className={styles.logoSystem} aria-hidden>
      <svg className={styles.logoSvg} viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={d} fill={SHELL_FILL} />
        <ShellDot cx={LANE.left} startIndex={0} active={active} settling={settling} reduceMotion={reduceMotion} />
        <ShellDot
          cx={LANE.center}
          startIndex={1}
          isCenter
          active={active}
          settling={settling}
          reduceMotion={reduceMotion}
        />
        <ShellDot cx={LANE.right} startIndex={2} active={active} settling={settling} reduceMotion={reduceMotion} />
      </svg>
    </div>
  );
}

/**
 * A single white dot living in a fixed lane (`cx` never animates — only its
 * own width/height/opacity do). At rest it fills the real logo's eye hole
 * exactly; once active it runs a staggered 4-shape equalizer cycle (circle ↔
 * pill) that never approaches the neighbouring lane. `isCenter` additionally
 * fades the dot in/out, since that lane is empty while the shell is a logo.
 */
function ShellDot({
  cx,
  startIndex,
  active,
  settling,
  reduceMotion,
  isCenter = false,
}: {
  cx: number;
  startIndex: number;
  active: boolean;
  settling: boolean;
  reduceMotion: boolean;
  isCenter?: boolean;
}) {
  const width = useMotionValue(isCenter ? 0 : REST.w);
  const height = useMotionValue(isCenter ? 0 : REST.h);
  const opacity = useMotionValue(isCenter ? 0 : 1);
  const x = useTransform(width, (w) => cx - w / 2);
  const y = useTransform(height, (h) => LANE.y - h / 2);
  const rx = useTransform(width, (w) => w / 2);

  // Reduced motion: dots never change shape, only a gentle opacity pulse.
  if (reduceMotion) {
    return (
      <motion.rect
        fill="#ffffff"
        style={{ x, y, width, height, rx }}
        initial={{ opacity: isCenter ? 0 : 0.7 }}
        animate={{ opacity: isCenter ? 0 : [0.5, 0.9, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  // Centre dot's own fade — independent of the shape cycle below.
  useEffect(() => {
    if (!isCenter) return;
    const target = active ? 1 : 0;
    const c = animate(opacity, target, { duration: 0.32, ease: EASE });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCenter, active]);

  // Shape state machine: rest ↔ equalizer loop ↔ settled equal circle.
  useEffect(() => {
    let cancelled = false;

    const animateTo = (shape: { w: number; h: number }, durationS: number) => {
      const w = animate(width, shape.w, { duration: durationS, ease: EASE });
      const h = animate(height, shape.h, { duration: durationS, ease: EASE });
      return Promise.all([w.finished, h.finished]).catch(() => {});
    };

    const run = async () => {
      if (!active) {
        // Resting: outer dots fill their hole exactly; centre collapses to 0.
        await animateTo(isCenter ? { w: 0, h: 0 } : REST, MORPH_OUT_MS / 1000);
        return;
      }
      if (settling) {
        await animateTo(SHAPE.normal, SETTLE_MS / 1000);
        return;
      }
      // Entrance into the equalizer: first shape, staggered by lane.
      let idx = startIndex * DOT_STAGGER;
      await animateTo(DOT_SEQUENCE[idx % DOT_SEQUENCE.length], DOT_TRANSITION_S);
      if (cancelled) return;
      // Continuous staggered cycle until this effect is cancelled.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        await wait(DOT_HOLD_MS);
        if (cancelled) return;
        idx += 1;
        await animateTo(DOT_SEQUENCE[idx % DOT_SEQUENCE.length], DOT_TRANSITION_S);
        if (cancelled) return;
      }
    };
    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, settling]);

  return <motion.rect fill="#ffffff" style={{ x, y, width, height, rx, opacity }} />;
}

/**
 * Wraps a thinking beat in `<AnimatePresence>` so `HooshangThinkingState` can
 * play its circle→silhouette exit morph before it is removed. Callers render
 * `<ThinkingBeat show={…} messages={…} />` instead of a bare conditional.
 */
export function ThinkingBeat({
  show,
  messages,
  cycleMs,
}: {
  show: boolean;
  messages: readonly string[];
  cycleMs?: number;
}) {
  return <AnimatePresence>{show && <HooshangThinkingState messages={messages} cycleMs={cycleMs} />}</AnimatePresence>;
}
