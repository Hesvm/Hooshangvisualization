"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, usePresence, useReducedMotion } from "motion/react";
import styles from "./HooshangThinkingState.module.css";

/** Refined, non-elastic easing used across the whole thinking module. */
const EASE = [0.22, 0.61, 0.36, 1] as const;

const APPEAR_DELAY_MS = 400; // wait before showing, so quick beats never flash
const LOGO_HOLD_MS = 120; // brief hold on the real silhouette before morphing
const MORPH_IN_MS = 280; // silhouette → circle
const MIN_ACTIVE_MS = 1000; // keep the circle up at least this long once reached
const MORPH_OUT_MS = 240; // circle → silhouette on exit
const PHRASE_INTERVAL_MS = 2200;

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

// Dot centres in viewBox units. Left/right sit on the real logo's eye positions;
// the centre only appears in the circular state.
const DOT_R = 2;
const DOTS = {
  left: 7.21,
  center: 10.6,
  right: 13.99,
  y: 10.16,
};

// [THINK-INV] TEMPORARY investigation instrumentation — remove after report.
let INV_INSTANCE = 0;

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

type HooshangThinkingStateProps = {
  /** One or more Persian status phrases, cycled in order while mounted. */
  messages: readonly string[];
  appearDelayMs?: number;
  cycleMs?: number;
};

/**
 * The branded "Hooshang is thinking" moment, driven by explicit visual states
 * (hidden → entering → active → exiting) rather than a repeating loop:
 *
 *   1. wait {@link APPEAR_DELAY_MS} (no flash on fast beats)
 *   2. show the real Hooshang silhouette with 2 dots ({@link LOGO_HOLD_MS})
 *   3. morph the *single* shell path silhouette → circle, centre dot fades in
 *   4. hold the circle with 3 pulsing dots for the whole processing duration
 *   5. on exit (the beat unmounts), enforce {@link MIN_ACTIVE_MS}, then morph the
 *      circle back to the silhouette before the component is removed
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
  const [active, setActive] = useState(false); // circle reached → dots pulse
  const [phraseIndex, setPhraseIndex] = useState(0);
  const activeAtRef = useRef(0);
  const mountedRef = useRef(false);
  const activeRef = useRef(false);

  const activePhrase = messages[phraseIndex % messages.length] ?? "";

  const invIdRef = useRef(0);
  if (invIdRef.current === 0) invIdRef.current = ++INV_INSTANCE;

  // ---- Enter sequence (phase-keyed effects, Strict-Mode-safe) ---------------
  // "delay" → "logo" → "circle". Each step is its own timer/animate effect so
  // React 18 Strict Mode's mount-time double-invoke (run → cleanup → run) simply
  // restarts a fresh timer/animation instead of stranding a stopped one — which
  // is what froze the morph when it lived inside one long async function.
  const [vphase, setVPhase] = useState<"delay" | "logo" | "circle">("delay");

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(`[THINK-INV] MOUNT #${invIdRef.current} msg="${messages[0]}" reduceMotion=${reduceMotion}`);
    const t = window.setTimeout(() => setVPhase(reduceMotion ? "circle" : "logo"), appearDelayMs);
    return () => {
      window.clearTimeout(t);
      // eslint-disable-next-line no-console
      console.log(`[THINK-INV] UNMOUNT #${invIdRef.current}`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, appearDelayMs]);

  // First time we leave "delay": reveal the container.
  useEffect(() => {
    if (vphase === "delay" || mountedRef.current) return;
    mountedRef.current = true;
    setMounted(true);
    // eslint-disable-next-line no-console
    console.log(`[THINK-INV] SHOWN #${invIdRef.current}`);
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
      }
      return;
    }
    const c = animate(progress, vphase === "circle" ? 1 : 0, { duration: MORPH_IN_MS / 1000, ease: EASE });
    if (vphase === "circle") {
      // eslint-disable-next-line no-console
      console.log(`[THINK-INV] MORPH-IN start #${invIdRef.current}`);
      c.finished
        .then(() => {
          activeRef.current = true;
          activeAtRef.current = performance.now();
          setActive(true);
          // eslint-disable-next-line no-console
          console.log(`[THINK-INV] ACTIVE (circle held) #${invIdRef.current}`);
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
      // Respect the minimum visible time once the circle has been reached.
      if (activeRef.current) {
        const elapsed = performance.now() - activeAtRef.current;
        if (elapsed < MIN_ACTIVE_MS) await wait(MIN_ACTIVE_MS - elapsed);
      }
      if (cancelled) return;
      setActive(false);
      activeRef.current = false;
      // eslint-disable-next-line no-console
      console.log(`[THINK-INV] EXIT morph-out #${invIdRef.current}`);
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
        <MorphingLogo d={dString} active={active} reduceMotion={!!reduceMotion} />

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
  reduceMotion,
}: {
  d: string;
  active: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div className={styles.logoSystem} aria-hidden>
      <svg className={styles.logoSvg} viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={d} fill={SHELL_FILL} />
        <ShellDot cx={DOTS.left} appear active={active} reduceMotion={reduceMotion} delay={0} />
        <ShellDot cx={DOTS.center} appear={active} isCenter active={active} reduceMotion={reduceMotion} delay={0.14} />
        <ShellDot cx={DOTS.right} appear active={active} reduceMotion={reduceMotion} delay={0.28} />
      </svg>
    </div>
  );
}

/** A single white dot inside the shell. `appear` controls its resting visibility;
 * `active` runs the soft sequential pulse. */
function ShellDot({
  cx,
  appear,
  active,
  reduceMotion,
  delay,
  isCenter = false,
}: {
  cx: number;
  appear: boolean;
  active: boolean;
  reduceMotion: boolean;
  delay: number;
  isCenter?: boolean;
}) {
  const dotStyle = { transformBox: "fill-box", transformOrigin: "center" } as const;

  if (reduceMotion) {
    return (
      <motion.circle
        cx={cx}
        cy={DOTS.y}
        r={DOT_R}
        fill="#ffffff"
        style={dotStyle}
        initial={{ opacity: isCenter ? 0 : 0.7 }}
        animate={{ opacity: isCenter ? 0 : [0.5, 0.9, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay }}
      />
    );
  }

  return (
    <motion.circle
      cx={cx}
      cy={DOTS.y}
      r={DOT_R}
      fill="#ffffff"
      style={dotStyle}
      initial={{ opacity: appear ? 1 : 0, scale: 1 }}
      animate={
        active
          ? { opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }
          : { opacity: appear ? 1 : 0, scale: 1 }
      }
      transition={
        active
          ? { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay }
          : { duration: 0.22, ease: EASE }
      }
    />
  );
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
  return (
    <AnimatePresence>
      {show && <HooshangThinkingState messages={messages} cycleMs={cycleMs} />}
    </AnimatePresence>
  );
}
