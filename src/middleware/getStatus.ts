import { Request, Response, NextFunction } from "express";

import { Client } from "../types";

type GetStatusHandlerArgs = {
  getClients: () => Client[];
};

export const getStatusHandler =
  ({ getClients }: GetStatusHandlerArgs) =>
  (request: Request, response: Response) => {
    const clients = getClients();
    response.json({ clients: clients.length });
  };
