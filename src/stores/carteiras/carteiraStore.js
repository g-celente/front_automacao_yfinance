import { defineStore } from "pinia";
import api from "@/api/main.js";

export const carteiraStore = defineStore("carteira", () => {
    async function getCarteiras() {
        try {
            const response = await api.carteira.getCarteiras();
            console.log('Carteiras:', response.data);
            return response.data.portfolios;
        } catch (e) {
            console.error('Erro ao buscar carteiras:', e);
            throw e;
        }
    }

    async function createCarteira(carteiraData) {
        try {
            const response = await api.carteira.createCarteira(carteiraData);
            return response.data;
        } catch (e) {
            console.error('Erro ao criar carteira:', e);
            throw e;
        }
    }

    async function updateCarteira(carteiraId, carteiraData) {
        try {
            const response = await api.carteira.updateCarteira(carteiraId, carteiraData);
            return response.data;
        } catch (e) {
            console.error('Erro ao atualizar carteira:', e);
            throw e;
        }
    }

    async function deleteCarteira(carteiraId) {
        try {
            const response = await api.carteira.deleteCarteira(carteiraId);
            return response.data;
        } catch (e) {
            console.error('Erro ao deletar carteira:', e);
            throw e;
        }
    }

    async function getCarteiraById(carteiraId) {
        try {
            const response = await api.carteira.getCarteiraById(carteiraId);
            return response.data.carteira;
        } catch (e) {
            console.error('Erro ao buscar carteira por ID:', e);
            throw e;
        }
    }    async function getIndicadoresCarteira(carteiraId) {
        try {
            const response = await api.carteira.getIndicadoresCarteira(carteiraId);
            return response.data;
        } catch (e) {
            console.error('Erro ao buscar indicadores da carteira:', e);
            throw e;
        }
    }

    return {
        getCarteiras,
        createCarteira,
        updateCarteira,
        deleteCarteira,
        getCarteiraById,
        getIndicadoresCarteira
    };
})