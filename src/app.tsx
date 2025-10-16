import { computed, effect, signal } from "@preact/signals";
import { colorPatch } from "./app.module.css";
import { joystickNormalized, knobs } from "./midi-signals";

const hexInputProps = {
  type: "range",
  min: "0",
  max: "255",
};

const red = signal(0);
const green = signal(0);
const blue = signal(0);

effect(() => {
  red.value = knobs[0].value * 2;
});
effect(() => {
  green.value = knobs[1].value * 2;
});
effect(() => {
  blue.value = knobs[2].value * 2;
});

const rgb = computed(() => `rgb(${red}, ${green}, ${blue})`);
const toHex = (value: number): string => value.toString(16).padStart(2, "0");
const hex = computed(() => {
  return `#${toHex(red.value)}${toHex(green.value)}${toHex(blue.value)}`;
});

function ColorPatch() {
  const toPx = (value: number): string => `${Math.round(value * 24)}px`;
  const { x, y } = joystickNormalized;
  return (
    <div
      class={colorPatch}
      style={{
        backgroundColor: rgb.value,
        transform: `translate(${toPx(x.value)}, ${toPx(y.value)})`,
      }}
    ></div>
  );
}

export function App() {
  console.log("App render");

  return (
    <>
      <h1>Aiguille du MIDI</h1>
      <input
        {...hexInputProps}
        name="red"
        value={red}
        onInput={(event) => {
          red.value = parseInt(event.currentTarget.value, 10);
        }}
      />
      <input
        {...hexInputProps}
        name="green"
        value={green}
        onInput={(event) => {
          green.value = parseInt(event.currentTarget.value, 10);
        }}
      />
      <input
        {...hexInputProps}
        name="blue"
        value={blue}
        onInput={(event) => {
          blue.value = parseInt(event.currentTarget.value, 10);
        }}
      />
      <div>{rgb}</div>
      <div>{hex}</div>
      <div>jx: {joystickNormalized.x}</div>
      <div>jy: {joystickNormalized.y}</div>
      <ColorPatch />
    </>
  );
}
