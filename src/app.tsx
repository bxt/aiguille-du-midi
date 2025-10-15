import { computed, signal } from "@preact/signals";
import { colorPatch } from "./app.module.css";

const hexInputProps = {
  type: "range",
  min: "0",
  max: "255",
};

const red = signal(0);
const green = signal(0);
const blue = signal(0);

const rgb = computed(() => `rgb(${red}, ${green}, ${blue})`);
const toHex = (value: number): string => value.toString(16).padStart(2, "0");
const hex = computed(() => {
  return `#${toHex(red.value)}${toHex(green.value)}${toHex(blue.value)}`;
});

function ColorPatch() {
  return <div class={colorPatch} style={{ backgroundColor: rgb.value }}></div>;
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
      <ColorPatch />
    </>
  );
}
