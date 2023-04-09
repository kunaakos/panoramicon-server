import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Output } from "easymidi";

import { PORT } from "./constants";

import { getStatusHandler } from "./middleware/getStatus";
import { getMidiCcHandler } from "./middleware/getMidiCc";
import { postMidiCcHandler } from "./middleware/postMidiCc";

import { getMidiCcState, setMidiCcState } from "./services/midiCcState";
import { getClients, removeClient, addClient } from "./services/client";

// console.log(easymidi.getOutputs());
var midiOutput = new Output("panoramicon-test", true);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/status", getStatusHandler({ getClients }));
app.get(
  "/midicc",
  getMidiCcHandler({ getMidiCcState, removeClient, addClient })
);
app.post(
  "/midicc",
  postMidiCcHandler({ getMidiCcState, setMidiCcState, getClients, midiOutput })
);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
