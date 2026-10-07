/**
 * Motion tokens. Every animated component pulls its physics from here so the whole site
 * moves with one "feel", tuned to match iOS system springs (quick to respond, settles
 * without visible bounce).
 */
export const spring = {
  /** Taps, toggles, badges: responds immediately. */
  snappy: { type: 'spring', stiffness: 520, damping: 34, mass: 0.8 },
  /** Panels, sheets, menus. */
  smooth: { type: 'spring', stiffness: 340, damping: 34, mass: 1 },
  /** Large surfaces. */
  gentle: { type: 'spring', stiffness: 240, damping: 30, mass: 1 },
  /** Dynamic Island morph: a touch of overshoot, like the real thing. */
  island: { type: 'spring', stiffness: 420, damping: 28, mass: 0.9 },
};

export const ease = {
  /** iOS "ease out" curve for fades and reveals. */
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
};
