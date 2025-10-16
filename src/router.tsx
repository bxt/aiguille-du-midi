import { computed, effect, signal } from "@preact/signals";
import type { AnyComponent } from "preact";
import { page } from "./route-signals";

const pages = import.meta.glob("./page-*.tsx", { import: "Page" });
const fileName = computed(() => `./page-${page.value}.tsx`);

const loadedPages: Record<string, AnyComponent> = {};

const Loading = () => <p>Loading...</p>;

const pageComponent = signal<AnyComponent>(Loading);

effect(() => {
  const key = fileName.value;

  if (loadedPages[key]) {
    pageComponent.value = loadedPages[key];
  } else if (!pages[key]) {
    pageComponent.value = () => <p>Page not found: {key}</p>;
  } else {
    const timer = setTimeout(() => {
      pageComponent.value = Loading;
    }, 200);
    pages[key]().then((page) => {
      clearTimeout(timer);

      // @ts-expect-error Imports are not typed
      loadedPages[key] = page;
      pageComponent.value = loadedPages[key];
    });
    return () => {
      clearTimeout(timer);
    };
  }
});

export function Router() {
  return <pageComponent.value />;
}
