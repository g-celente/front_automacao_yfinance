<script setup>
import { ref } from 'vue';
import BaseSidebar from "./sidebar/BaseSideBar.vue";

const isMobileOpen = ref(false);
const isCollapsed = ref(false);
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Botão do menu mobile -->
    <button
      @click="isMobileOpen = true"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors duration-200"
    >
      <i class="pi pi-bars text-gray-600"></i>
    </button>

    <!-- Sidebar -->
    <BaseSidebar
      v-model:isMobileOpen="isMobileOpen"
      v-model:isCollapsed="isCollapsed"
      class="sidebar"
    />

    <!-- Conteúdo principal -->
    <main
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[
        'lg:pl-20', // Largura mínima quando collapsed
        { 'lg:pl-64': !isCollapsed }, // Aumenta quando expandido
        'pl-0' // Sem padding no mobile
      ]"
    >
      <!-- Header fixo -->
      <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div class="px-6 py-4">
          <div class="flex items-center justify-end space-x-4">
            <button class="text-gray-500 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
              <i class="pi pi-bell text-xl"></i>
            </button>
            <button class="text-gray-500 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
              <i class="pi pi-user text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Área de conteúdo -->
      <div class="p-6">
        <div class="w-full">
          <router-view v-slot="{ Component }">
            <transition
              enter-active-class="transition-opacity duration-200 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-150 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Animações suaves */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>