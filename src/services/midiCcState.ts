import { MidiCcState } from "../types";

let midiCcState: MidiCcState = {};

export const getMidiCcState = () => midiCcState; // !

export const setMidiCcState = (newState: MidiCcState) => {
  midiCcState = newState;
};
