import { type Signal, useComputed, useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { pajaro } from "./page-pajaro.module.css";

const viewBoxSize = 1000;
const stokeWidth = 12;

function Eye({
  eyeX,
  mouseX,
  mouseY,
}: {
  eyeX: number;
  mouseX: Signal<number>;
  mouseY: Signal<number>;
}) {
  const eyesY = 341;

  const eyeRadius = 115;
  const pupilRadius = stokeWidth / 2;
  const pupilMargin = 30;
  const maxPupilDistance = eyeRadius - stokeWidth - pupilRadius - pupilMargin;

  const pupilOffsetX = useComputed(() => mouseX.value - eyeX);
  const pupilOffsetY = useComputed(() => mouseY.value - eyesY);

  const distance = useComputed(() =>
    Math.sqrt(
      pupilOffsetX.value * pupilOffsetX.value +
        pupilOffsetY.value * pupilOffsetY.value,
    ),
  );

  const clampedDistance = useComputed(() =>
    Math.min(maxPupilDistance, distance.value),
  );

  const angle = useComputed(() =>
    Math.atan2(pupilOffsetY.value, pupilOffsetX.value),
  );

  const pupilX = useComputed(() => {
    return eyeX + clampedDistance.value * Math.cos(angle.value);
  });
  const pupilY = useComputed(() => {
    return eyesY + clampedDistance.value * Math.sin(angle.value);
  });

  return (
    <>
      <ellipse cx={eyeX} cy={eyesY} rx={eyeRadius} ry={eyeRadius} fill="#fff" />
      <circle cx={pupilX} cy={pupilY} r={pupilRadius} />
    </>
  );
}

export function Page() {
  document.title = "Aiguille du MIDI – Pajaro";

  const involvedness = useSignal(0);

  const mouseX = useSignal(0);
  const mouseY = useSignal(0);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      mouseX.value = ((event.clientX - rect.left) / rect.width) * viewBoxSize;
      mouseY.value = ((event.clientY - rect.top) / rect.height) * viewBoxSize;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

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
        ref={svgRef}
        class={pajaro}
        version="1.1"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>A cute bird</title>
        <g stroke="#000" stroke-width={stokeWidth}>
          <path
            d="m250 1e3c-139.52-1140.7 686.63-1171 473.66 0"
            fill="#d1c3b3"
          />
          <Eye eyeX={303} mouseX={mouseX} mouseY={mouseY} />
          <Eye eyeX={738} mouseX={mouseX} mouseY={mouseY} />
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
