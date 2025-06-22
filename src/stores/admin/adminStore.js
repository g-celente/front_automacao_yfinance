import { defineStore } from "pinia";
import { useToast } from 'primevue/usetoast';
import api from "@/api/main.js";

export const adminStore = defineStore("admin", () => {
    const toast = useToast();
    
    async function getUserById() {
        try {
            const response = await api.admin.getUserById();
            return response.data;
        } catch (e) {
            console.error('Erro ao buscar dashboard do admin:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao carregar dados do administrador',
                life: 3000
            });
            throw e;
        }
    }

    return {
        getUserById,
    };
});