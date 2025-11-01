import { useSignal } from "@preact/signals";
import { pajaro } from "./page-pajaro.module.css";

export function Page() {
  document.title = "Aiguille du MIDI – Pajaro";

  const involvedness = useSignal(0);

  return (
    <>
      <h1>Pajaro</h1>
      <label>
        Involvedness
        <input
          type="range"
          min="0"
          max="100"
          name="involvedness"
          value={involvedness}
          onInput={(event) => {
            involvedness.value = parseInt(event.currentTarget.value, 10);
          }}
        />
      </label>
      <svg
        class={pajaro}
        version="1.1"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>A cute bird</title>
        <g stroke="#000" stroke-width="12">
          <path
            d="m250 1e3c-139.52-1140.7 686.63-1171 473.66 0"
            fill="#d1c3b3"
          />
          <g fill="#fff">
            <ellipse cx="303.6" cy="340.95" rx="114.45" ry="117.52" />
            <ellipse cx="738.56" cy="340.95" rx="114.45" ry="117.52" />
            <circle cx="354.76" cy="385.29" r="6.4516" />
            <circle cx="687.02" cy="385.29" r="6.4516" />
          </g>
          <g>
            <path
              d="m528.01 182.46c40.42-28.566 44.686-78.73 12.798-150.49 60.988 61.414 71.36 121.92 31.117 181.53"
              fill="#7209ff"
            />
            <path
              d="m490.08 182.46c40.42-28.566 44.686-78.73 12.798-150.49 60.988 61.414 71.36 121.92 31.117 181.53"
              fill="#f409ff"
            />
            <path
              d="m450.05 172.29c40.42-28.566 55.532-58.393 23.645-130.15 60.988 61.414 60.514 101.59 20.271 161.19"
              fill="#ff8409"
            />
          </g>
          <path
            d="m702.21 165.03c67.102-20.719 117.69-4.3248 151.75 49.183"
            fill="none"
          />
          <path
            d="m301.58 171.08c-81.269-6.3692-127.84 19.285-139.73 76.964"
            fill="none"
          />
          <path d="m452.55 500.62 37.069 354.84 90.736-343.72" fill="#ffb109" />
        </g>
      </svg>
    </>
  );
}
