import { Request, Response, NextFunction } from "express";

import { Client, MidiCcState } from "../types";

type GetMidiCcHandlerArgs = {
  getMidiCcState: () => MidiCcState;
  removeClient: (clientId: number) => void;
  addClient: (newClient: Client) => void;
};

export const getMidiCcHandler =
  ({ getMidiCcState, removeClient, addClient }: GetMidiCcHandlerArgs) =>
  (request: Request, response: Response, next: NextFunction) => {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    response.writeHead(200, headers);

    const data = `data: ${JSON.stringify(getMidiCcState())}\n\n`;
    response.write(data);

    const clientId = Date.now();

    const newClient = {
      id: clientId,
      response,
    };

    addClient(newClient);

    request.on("close", () => {
      removeClient(clientId);
    });
  };
