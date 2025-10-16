import { computed, signal } from "@preact/signals";

const DEFAULT_PAGE = "#home";

const hash = signal(window.location.hash || DEFAULT_PAGE);
window.addEventListener("hashchange", () => {
  hash.value = window.location.hash || DEFAULT_PAGE;
});

export const page = computed(() => hash.value.replace(/^#/, ""));
