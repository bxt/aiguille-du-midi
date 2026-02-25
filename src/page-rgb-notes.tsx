import { computed, effect, signal } from "@preact/signals";
import { notes } from "./midi-signals";
import { colorPatch } from "./page-rgb-mixer.module.css";

type Rgb = [number, number, number];

const rgb = signal<Rgb>([0, 0, 0]);

function colorFromNote(n: { note: number; velocity: number }): Rgb {
  const { note, velocity } = n;
  const hue = (note % 12) / 2;
  const hueInt = Math.floor(hue);
  const value = Math.min(velocity * 2, 255);
  const hi = hueInt % 6;
  const f = hue - hueInt;

  const v = value;
  const q = value * (1 - f);
  const t = value * f;

  const r = [v, q, 0, 0, t, v][hi];
  const g = [t, v, v, q, 0, 0][hi];
  const b = [0, 0, t, v, v, q][hi];

  return [r, g, b];
}

effect(() => {
  const rgbRaw: Rgb = notes.value.reduce(
    (acc, note) => {
      const [r, g, b] = colorFromNote(note);
      return [acc[0] + r, acc[1] + g, acc[2] + b];
    },
    [0, 0, 0],
  );
  rgb.value = rgbRaw.map((c) => Math.floor(Math.min(c, 255))) as Rgb;
});

const rgbString = computed(
  () => `rgb(${rgb.value[0]}, ${rgb.value[1]}, ${rgb.value[2]})`,
);
const toHex = (value: number): string => value.toString(16).padStart(2, "0");
const hex = computed(() => {
  return `#${toHex(rgb.value[0])}${toHex(rgb.value[1])}${toHex(rgb.value[2])}`;
});

function ColorPatch() {
  return (
    <div class={colorPatch} style={{ backgroundColor: rgbString.value }}></div>
  );
}

function Notes() {
  return <pre>{JSON.stringify(notes.value)}</pre>;
}

export function Page() {
  document.title = "Aiguille du MIDI – RGB notes";

  return (
    <>
      <h1>RGB notes</h1>
      <div>{rgbString}</div>
      <div>{hex}</div>
      <ColorPatch />
      <Notes />
    </>
  );
}
