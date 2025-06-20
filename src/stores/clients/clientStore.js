import { defineStore } from "pinia";
import api from "@/api/main.js";

export const clientStore = defineStore("client", () => {

    async function getClients() {
        try {
            const response = await api.client.getUsers();
            return response.data.clientes;
        } catch (e) {
            console.error('Erro ao buscar clientes:', e);
            throw e;
        }
    }

    async function createClient(clientData) {
        try {
            const response = await api.client.createUser(clientData);
            return response.data.client;
        } catch (e) {
            console.error('Erro ao criar cliente:', e);
            throw e;
        }
    }

    return {
        getClients,
        createClient
    };
});