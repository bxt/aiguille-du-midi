import { computed } from "@preact/signals";
import {
  backButton,
  backButtonCollapsed,
  content,
  header,
} from "./app.module.css";
import { page } from "./route-signals.ts";
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

const backClassName = computed(() => {
  return `${backButton} ${page.value === "home" ? backButtonCollapsed : ""}`;
});

export function App() {
  return (
    <>
      <div class={header}>
        <div>
          <a href="#home">
            <span class={backClassName}>&lt;</span>Aiguille du MIDI
          </a>
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
