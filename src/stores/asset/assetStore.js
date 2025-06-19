import { defineStore } from "pinia";
import api from "@/api/main.js";

export const assetStore = defineStore("asset", () => {

    async function searchAsset(searchData) {
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
            throw e;
        }
    }

    return {
        searchAsset
    };
});