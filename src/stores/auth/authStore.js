import { defineStore } from "pinia";
import { useToast } from 'primevue/usetoast';
import api from "@/api/main.js"; // Adjust the path as necessary
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToast();  async function userLogin(payload) {
    try {
      const response = await api.auth.signIn(payload);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: response.message || 'Login realizado com sucesso',
        life: 3000
      });
      return response.data;
    } catch (error) {
      console.log(error);
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.response?.data?.message || error.message || 'Erro ao fazer login',
        life: 3000
      });
      throw error;
    }
  }
  async function registerUser(payload) {
    try {
      const response = await api.auth.signUp(payload);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: response.message || 'Usuário registrado com sucesso',
        life: 3000
      });
      return response.data;
    } catch (error) {
      console.log(error);
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.response?.data?.message || error.message || 'Erro ao registrar usuário',
        life: 3000
      });
      throw error;
    }
  }  async function userLogout() {
    try {
      const response = await api.auth.logout();
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: response.message || 'Logout realizado com sucesso',
        life: 3000
      });
      return response.data;
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.response?.data?.message || error.message || 'Erro ao fazer logout',
        life: 3000
      });
      throw error;
    }
  }
  async function recoverPassword(payload) {
    try {
      const response = await api.auth.recoverPassword(payload);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: response.message || 'Recuperação de senha enviada com sucesso',
        life: 3000
      });
      return response.data;
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.response?.data?.message || error.message || 'Erro ao recuperar senha',
        life: 3000
      });
      throw error;
    }
  }

  return {
    userLogin,
    registerUser,
    userLogout,
    recoverPassword,
  };
});