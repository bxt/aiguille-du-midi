import type { TargetedEvent } from "preact";
import { useCallback, useState } from "preact/hooks";
import { colorPatch } from "./app.module.css";

const hexInputProps = {
  type: "range",
  min: "0",
  max: "255",
};

export function App() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  const onRedChange = useCallback(
    (event: TargetedEvent<HTMLInputElement>) =>
      setRed(parseInt(event.currentTarget.value, 10)),
    []
  );

  const onGreenChange = useCallback(
    (event: TargetedEvent<HTMLInputElement>) =>
      setGreen(parseInt(event.currentTarget.value, 10)),
    []
  );

  const onBlueChange = useCallback(
    (event: TargetedEvent<HTMLInputElement>) =>
      setBlue(parseInt(event.currentTarget.value, 10)),
    []
  );

  return (
    <>
      <h1>Aiguille du MIDI</h1>
      <input {...hexInputProps} name="red" value={red} onInput={onRedChange} />
      <input
        {...hexInputProps}
        name="green"
        value={green}
        onInput={onGreenChange}
      />
      <input
        {...hexInputProps}
        name="blue"
        value={blue}
        onInput={onBlueChange}
      />
      <div>
        rgb({red}, {green}, {blue})
      </div>
      <div>
        #{red.toString(16).padStart(2, "0")}
        {green.toString(16).padStart(2, "0")}
        {blue.toString(16).padStart(2, "0")}
      </div>
      <div
        class={colorPatch}
        style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
      ></div>
    </>
  );
}
