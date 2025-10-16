# Aiguille du MIDI

This repository contains some experiments I did with using a MIDI controller on a JavaScript web page to build cool things.

The pages are built using [vite](https://vite.dev) and [Preact](https://preactjs.com) making use of [signals](https://preactjs.com/guide/v10/signals/) a lot. We also use GitHub pages, TypeScript, Biome and CSS Modules.

> The [Aiguille du Midi](https://de.wikipedia.org/wiki/Aiguille_du_Midi) is a very cool-looking mountain in the French Alps. It happens to be the highest place I've ever been to in my life. Conveniently, the name also contains the letters MIDI, making it the perfect namesake for this repository. ⸺ bxt, Okt 2025

Right now there is just one single page which uses the MIDI controls as found on the AKAI MPK Mini Play MK3 to control some colors. It might also work with other MIDI controllers that have similar program assignments.

## Developing

Start by:

```sh
npm install
```

Then run any of the following:

```sh
npm run dev
npm run build
npm run preview
npm run fmt
npm run check
```