import { Client } from "../types";

let clients: Client[] = [];

export const getClients = (): Client[] => clients; // !

export const addClient = (newClient: Client) => {
  clients.push(newClient);
  console.log(`${newClient.id} connected`);
};

export const removeClient = (clientId: number) => {
	clients = clients.filter((client) => client.id !== clientId)
	console.log(`${clientId} disconnected`);
}
