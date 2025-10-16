import { computed, effect, signal } from "@preact/signals";
import {
  joystickNormalized,
  knobs,
  padsPressed,
  padsVelocity,
} from "./midi-signals";
import { colorPatch, pad, padPressed } from "./page-rgb-mixer.module.css";

const hexInputProps = {
  type: "range",
  min: "0",
  max: "255",
};

const red = signal(0);
const green = signal(0);
const blue = signal(0);

effect(() => {
  red.value = Math.max(knobs[0].value * 2, padsVelocity[0].value * 2);
});
effect(() => {
  green.value = Math.max(knobs[1].value * 2, padsVelocity[1].value * 2);
});
effect(() => {
  blue.value = Math.max(knobs[2].value * 2, padsVelocity[2].value * 2);
});

const rgb = computed(() => `rgb(${red}, ${green}, ${blue})`);
const toHex = (value: number): string => value.toString(16).padStart(2, "0");
const hex = computed(() => {
  return `#${toHex(red.value)}${toHex(green.value)}${toHex(blue.value)}`;
});

const joystickXFormatted = computed(() =>
  joystickNormalized.x.value.toFixed(3),
);
const joystickYFormatted = computed(() =>
  joystickNormalized.y.value.toFixed(3),
);

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

function Pad({ index }: { index: number }) {
  return (
    <div class={`${pad} ${padsPressed[index - 1].value ? padPressed : ""}`}>
      {index}
    </div>
  );
}

export function Page() {
  document.title = "Aiguille du MIDI – RGB mixer";

  return (
    <>
      <h1>RGB mixer</h1>
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
      <div>jx: {joystickXFormatted}</div>
      <div>jy: {joystickYFormatted}</div>
      <ColorPatch />
      <div>
        <Pad index={5} />
        <Pad index={6} />
        <Pad index={7} />
        <Pad index={8} />
      </div>
      <div>
        <Pad index={1} />
        <Pad index={2} />
        <Pad index={3} />
        <Pad index={4} />
      </div>
    </>
  );
}
