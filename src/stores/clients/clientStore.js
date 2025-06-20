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
            return response.data;
        } catch (e) {
            console.error('Erro ao criar cliente:', e);
            throw e;
        }
    }

    async function updateClient(clientId, clientData) {
        try {
            const response = await api.client.updateUser(clientId, clientData);
            return response.data;
        } catch (e) {
            console.error('Erro ao atualizar cliente:', e);
            throw e;
        }
    }

    async function deleteClient(clientId) {
        try {
            const response = await api.client.deleteClient(clientId);
            return response.data;
        } catch (e) {
            console.error('Erro ao deletar cliente:', e);
            throw e;
        }
    }

    async function getClientById(clientId) {
        try {
            const response = await api.client.getUserById(clientId);
            return response.data.cliente;
        } catch (e) {
            console.error('Erro ao buscar cliente por ID:', e);
            throw e;
        }
    }

    return {
        getClients,
        createClient,
        updateClient,
        deleteClient,
        getClientById
    };
});