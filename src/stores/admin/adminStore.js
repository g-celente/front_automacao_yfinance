import { defineStore } from "pinia";
import api from "@/api/main.js";

export const adminStore = defineStore("admin", () => {
    async function getUserById() {
        try {
            const response = await api.admin.getUserById();
            return response.data;
        } catch (e) {
            console.error('Erro ao buscar dashboard do admin:', e);
            throw e;
        }
    }

    return {
        getUserById,
    };
});