import { clamp } from "lodash";
import { Request, Response, NextFunction } from "express";
import { Output, ControlChange } from "easymidi";

import { MIDI_CC_VALUE_MAX, MIDI_CC_VALUE_MIN } from "../constants";
import { Client, MidiCcState } from "../types";
import { defaultTo64IfUndefined } from "../utils";

type PostMidiCcHandlerArgs = {
  getMidiCcState: () => MidiCcState;
  setMidiCcState: (newState: MidiCcState) => void;
  getClients: () => Client[]
  midiOutput: Output;
};

export const postMidiCcHandler = ({
  getMidiCcState,
  setMidiCcState,
  getClients,
  midiOutput,
}: PostMidiCcHandlerArgs) =>
  async function (request: Request, response: Response, next: NextFunction) {
    const offsets = request.body;
    if (offsets.length < 1) return;

    const midiCcState = getMidiCcState();

    const newMidiCcValues: MidiCcState = offsets.reduce(
      (acc: MidiCcState, { number, by }: { number: number; by: number }) => {
        return {
          ...acc,
          [number]: clamp(
            defaultTo64IfUndefined(midiCcState[number]) + by,
            MIDI_CC_VALUE_MIN,
            MIDI_CC_VALUE_MAX
          ),
        };
      },
      {}
    );

    Object.entries(newMidiCcValues).forEach(([controller, value]) => {
      if (typeof value !== "string") return;
      const controlChange: ControlChange = {
        controller: parseInt(controller), // !
        value,
        channel: 1,
      };
      midiOutput.send("cc", controlChange);
    });

    setMidiCcState({
      ...midiCcState,
      ...newMidiCcValues,
    });

    response.json({ result: "ok" });

    const clients = getClients();

    clients.forEach((client) =>
      client.response.write(`data: ${JSON.stringify(midiCcState)}\n\n`)
    );
  };
