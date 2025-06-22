import { defineStore } from "pinia";
import { useToast } from 'primevue/usetoast';
import api from "@/api/main.js";

export const clientStore = defineStore("client", () => {
    const toast = useToast();    async function getClients() {
        try {
            const response = await api.client.getUsers();
            return response.data.clientes;
        } catch (e) {
            console.error('Erro ao buscar clientes:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao carregar clientes',
                life: 3000
            });
            throw e;
        }
    }    async function createClient(clientData) {
        try {
            const response = await api.client.createUser(clientData);
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Cliente criado com sucesso',
                life: 3000
            });
            return response.data;
        } catch (e) {
            console.error('Erro ao criar cliente:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao criar cliente',
                life: 3000
            });
            throw e;
        }
    }    async function updateClient(clientId, clientData) {
        try {
            const response = await api.client.updateUser(clientId, clientData);
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Cliente atualizado com sucesso',
                life: 3000
            });
            return response.data;
        } catch (e) {
            console.error('Erro ao atualizar cliente:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao atualizar cliente',
                life: 3000
            });
            throw e;
        }
    }    async function deleteClient(clientId) {
        try {
            const response = await api.client.deleteClient(clientId);
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Cliente deletado com sucesso',
                life: 3000
            });
            return response.data;
        } catch (e) {
            console.error('Erro ao deletar cliente:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao deletar cliente',
                life: 3000
            });
            throw e;
        }
    }    async function getClientById(clientId) {
        try {
            const response = await api.client.getUserById(clientId);
            return response.data.cliente;
        } catch (e) {
            console.error('Erro ao buscar cliente por ID:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao carregar cliente',
                life: 3000
            });
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