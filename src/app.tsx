import { content, header } from "./app.module.css";
import { Router } from "./router.tsx";

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

export function App() {
  return (
    <>
      <div class={header}>
        <div>
          <a href="#home">Aiguille du MIDI</a>
        </div>
        <div>
          <a href="https://github.com/bxt/aiguille-du-midi">GitHub</a>
          <button onClick={toggleFullScreen} type="button">
            Fullscreen
          </button>
        </div>
      </div>
      <div class={content}>
        <Router />
      </div>
    </>
  );
}
