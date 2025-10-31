import { effect, type Signal, signal } from "@preact/signals";
import { knobs } from "./midi-signals";

const waveforms = [
  "sine",
  "triangle",
  "square",
  "sawtooth",
] as const satisfies OscillatorType[];

const waveform: Signal<(typeof waveforms)[number]> = signal("sine");

effect(() => {
  waveform.value =
    waveforms[Math.floor((knobs[1].value / 127) * waveforms.length)];
});

const audioContext = new AudioContext();

const oscillator = new OscillatorNode(audioContext, { type: waveform.value });
const oscillator2 = new OscillatorNode(audioContext, {
  type: waveform.value,
  frequency: 220,
});
const gainNode = new GainNode(audioContext, { gain: 1 });
oscillator.connect(gainNode).connect(audioContext.destination);
oscillator2.connect(gainNode);

effect(() => {
  gainNode.gain.linearRampToValueAtTime(
    knobs[0].value / 127,
    audioContext.currentTime + 0.01
  );
});

effect(() => {
  oscillator.type = waveform.value;
});

export function Page() {
  document.title = "Aiguille du MIDI – Keyboard";

  return (
    <>
      <h1>Keyboard</h1>
      <button
        onClick={() => {
          console.log("Enabling audio", audioContext.state);
          if (audioContext.state === "suspended") {
            audioContext.resume();
            oscillator.start();
          }
        }}
        type="button"
      >
        Enable Audio
      </button>
      <label>
        Gain
        <input
          type="range"
          min="0"
          max="127"
          name="gain"
          value={knobs[0]}
          onInput={(event) => {
            knobs[0].value = parseInt(event.currentTarget.value, 10);
          }}
        />
      </label>
      <label>
        Waveform
        <select
          name="waveform"
          value={waveform}
          onInput={(event) => {
            waveform.value = event.currentTarget
              .value as (typeof waveforms)[number];
          }}
        >
          {waveforms.map((type) => (
            <option value={type}>{type}</option>
          ))}
        </select>
      </label>
    </>
  );
}
