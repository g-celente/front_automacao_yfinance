import { defineStore } from "pinia";
import { useToast } from 'primevue/usetoast';
import api from "@/api/main.js";

export const assetStore = defineStore("asset", () => {
    const toast = useToast();    async function searchAsset(searchData) {
        try {
            const payload = {
                ticker: searchData.ticker || '',
                periodo: searchData.periodo || '1y',
                ...searchData
            };

            const response = await api.asset.searchAsset(payload);
            // Retorna os dados estruturados para o componente

            return {
                historico: response.data.assets.historico,
                results: response.data.assets.results,
                success: true
            };
        } catch (e) {
            console.error('Erro na busca de ativos:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro na busca de ativos',
                life: 3000
            });
            throw e;
        }
    }    async function createAsset(assetData) {
        try {
            const response = await api.asset.createAsset(assetData);
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Ativo criado com sucesso',
                life: 3000
            });
            return response.data;
        } catch (e) {
            console.error('Erro ao criar ativo:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao criar ativo',
                life: 3000
            });
            throw e;
        }
    }

    return {
        searchAsset,
        createAsset
    };
});