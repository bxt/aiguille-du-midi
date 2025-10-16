import { computed, signal } from "@preact/signals";

export const knobs = [signal(0), signal(0), signal(0), signal(0)];
export const knobsBank2 = [signal(0), signal(0), signal(0), signal(0)];
export const joystick = { x: signal(0), y: signal(0) };
export const joystickNormalized = {
  x: computed(() => joystick.x.value / 0x2000),
  y: computed(() => joystick.y.value / 0x7f),
};

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
        ` version:'${input.version}'`
    );
  }

  for (const entry of midiAccess.outputs) {
    const output = entry[1];
    console.log(
      `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`
    );
  }
}

function onMIDIMessage(event: MIDIMessageEvent) {
  if (!event.data || event.data.length < 2) return;

  let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
  for (const character of event.data) {
    str += `0x${character.toString(16)} `;
  }
  console.log(str);

  const command = event.data[0] >> 4;
  const channel = event.data[0] & 0xf;
  if (channel !== 0) return; // only listen to channel 1

  if (command === 0xb) {
    const [_, controllerNumber, controllerValue] = event.data;
    if (controllerNumber === 1) {
      joystick.y.value = controllerValue;
    }

    if (controllerNumber >= 0x46 && controllerNumber <= 0x49) {
      knobs[controllerNumber - 0x46].value = controllerValue;
    }
    if (controllerNumber >= 0x4a && controllerNumber <= 0x4d) {
      knobsBank2[controllerNumber - 0x4a].value = controllerValue;
    }
  } else if (command === 0xe) {
    const [_, lsb, msb] = event.data;
    const value = (msb << 7) + lsb;
    joystick.x.value = value - 0x2000;
  }
}

function startLoggingMIDIInput(midiAccess: MIDIAccess) {
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMIDIMessage;
  });
}
