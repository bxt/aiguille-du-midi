import { computed, signal } from "@preact/signals";

type NoteDirection = "off" | "on" | "aftertouch";

type NoteState = [NoteDirection, number];

const commandNames: Record<0x8 | 0x9 | 0xa, NoteDirection> = {
  // biome-ignore lint/complexity/useSimpleNumberKeys: Using hex for MIDI commands
  0x8: "off",
  // biome-ignore lint/complexity/useSimpleNumberKeys: Using hex for MIDI commands
  0x9: "on",
  // biome-ignore lint/complexity/useSimpleNumberKeys: Using hex for MIDI commands
  0xa: "aftertouch",
};

export const knobs = [signal(0), signal(0), signal(0), signal(0)];
export const knobsBank2 = [signal(0), signal(0), signal(0), signal(0)];
export const joystick = { x: signal(0), y: signal(0) };
export const joystickNormalized = {
  x: computed(() => joystick.x.value / 0x2000),
  y: computed(() => joystick.y.value / 0x7f),
};
const pads = Array.from({ length: 8 }, () => signal<NoteState>(["off", 0]));
const padsBank2 = Array.from({ length: 8 }, () =>
  signal<NoteState>(["off", 0]),
);
export const padsPressed = Array.from({ length: 8 }, (_, index) =>
  computed(() => pads[index].value[0] !== "off"),
);
export const padsVelocity = Array.from({ length: 8 }, (_, index) =>
  computed(() => pads[index].value[1]),
);

export const notes = signal<{ note: number; velocity: number }[]>([]);

function onMIDISuccess(midiAccess: MIDIAccess) {
  console.log("MIDI ready!");

  listInputsAndOutputs(midiAccess);
  startLoggingMIDIInput(midiAccess);
}

function onMIDIFailure(msg: string) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function listInputsAndOutputs(midiAccess: MIDIAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    console.log(
      `Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`,
    );
  }

  for (const entry of midiAccess.outputs) {
    const output = entry[1];
    console.log(
      `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`,
    );
  }
}

function printMIDIMessage(data: Uint8Array<ArrayBuffer>) {
  let str = `MIDI message [${data.length}]:`;
  for (const character of data) {
    str += ` 0x${character.toString(16).padStart(2, "0")}`;
  }
  console.log(str);
}

function onMIDIMessage(event: MIDIMessageEvent) {
  if (!event.data || event.data.length < 2) return;

  const command = event.data[0] >> 4;
  const channel = event.data[0] & 0xf;

  if (channel === 0 && command === 0xb) {
    const [_, controllerNumber, controllerValue] = event.data;
    if (controllerNumber === 1) {
      joystick.y.value = controllerValue;
    } else if (controllerNumber >= 0x46 && controllerNumber <= 0x49) {
      knobs[controllerNumber - 0x46].value = controllerValue;
    } else if (controllerNumber >= 0x4a && controllerNumber <= 0x4d) {
      knobsBank2[controllerNumber - 0x4a].value = controllerValue;
    } else {
      printMIDIMessage(event.data);
    }
  } else if (channel === 0 && command === 0xe) {
    const [_, lsb, msb] = event.data;
    const value = (msb << 7) + lsb;
    joystick.x.value = value - 0x2000;
  } else if (command === 0x9 || command === 0x8 || command === 0xa) {
    const [_, note, velocity] = event.data;

    if (channel === 9 && note >= 0x24 && note <= 0x2b) {
      pads[note - 0x24].value = [commandNames[command], velocity];
    } else if (channel === 9 && note >= 0x2c && note <= 0x33) {
      padsBank2[note - 0x2c].value = [commandNames[command], velocity];
    } else if (channel === 0) {
      if (velocity > 0) {
        if (notes.value.some((n) => n.note === note)) {
          notes.value = notes.value.map((n) =>
            n.note === note ? { note, velocity } : n,
          );
        } else {
          notes.value = [...notes.value, { note, velocity }];
        }
      } else {
        notes.value = notes.value.filter((n) => n.note !== note);
      }
    } else {
      printMIDIMessage(event.data);
    }
  } else {
    printMIDIMessage(event.data);
  }
}

function startLoggingMIDIInput(midiAccess: MIDIAccess) {
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMIDIMessage;
  });
}
