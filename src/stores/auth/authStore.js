import { defineStore } from "pinia";
import api from "@/api/main.js"; // Adjust the path as necessary
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  async function userLogin(payload) {
    try {
      const response = await api.auth.signIn(payload);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function registerUser(payload) {
    try {
      const response = await api.auth.signUp(payload);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async function userLogout() {
    try {
      const response = await api.auth.logout();
      return response.data;
    } catch (error) {}
  }

  async function recoverPassword(payload) {
    try {
      const response = await api.auth.recoverPassword(payload);

      return response.data;
    } catch (error) {}
  }

  return {
    userLogin,
    registerUser,
    userLogout,
  };
});