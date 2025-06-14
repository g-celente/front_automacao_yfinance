<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-40 h-screen transition-transform duration-300',
        isCollapsed ? 'w-20' : 'w-64',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      class="bg-white border-r border-gray-200"
    >
      <div class="flex items-center justify-between p-4 h-16">
        <router-link to="/" class="flex items-center space-x-3">
          <img src="@/assets/logo.svg" class="h-8 w-8" alt="Logo" />
          <span v-show="!isCollapsed" class="text-xl font-semibold">Cliente</span>
        </router-link>
        <Button
          @click="toggleSidebar"
          icon="pi pi-angle-left"
          :class="{ 'rotate-180': isCollapsed }"
          text
          rounded
          class="hidden lg:flex transition-transform"
        />
      </div>

      <div class="overflow-y-auto py-5 px-3">
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.to">
            <router-link
              :to="item.to"
              class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              :class="{ 'justify-center': isCollapsed }"
            >
              <i :class="['pi', item.icon, 'text-lg']"></i>
              <span
                v-if="!isCollapsed"
                class="ml-3"
              >{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Main Content -->
    <div
      :class="[
        'transition-all duration-300',
        isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      ]"
    >
      <!-- Top Navbar -->
      <nav class="bg-white border-b border-gray-200 fixed z-30 w-full">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Button
                @click="toggleMobileMenu"
                icon="pi pi-bars"
                text
                rounded
                class="lg:hidden"
              />
              <h1 class="text-xl font-semibold ml-2">Área do Cliente</h1>
            </div>
            <div class="flex items-center gap-2">
              <span class="hidden md:inline-block text-sm text-gray-600">
                Bem-vindo(a), {{ authStore.user?.name }}
              </span>
              <Menu
                ref="menu"
                :model="userMenuItems"
                :popup="true"
              />
              <Button
                @click="toggleUserMenu"
                class="p-button-text"
                icon="pi pi-user"
              />
            </div>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <main class="p-4 lg:p-6 mt-16">
        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/authStore';
import Menu from 'primevue/menu';

const router = useRouter();
const authStore = useAuthStore();
const menu = ref();

const isCollapsed = ref(false);
const isMobileMenuOpen = ref(false);

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi-home',
    to: '/cliente/dashboard'
  },
  {
    label: 'Carteira',
    icon: 'pi-wallet',
    to: '/cliente/carteira'
  },
  {
    label: 'Histórico',
    icon: 'pi-history',
    to: '/cliente/historico'
  }
];

const userMenuItems = [
  {
    label: 'Meu Perfil',
    icon: 'pi pi-user',
    command: () => router.push('/cliente/profile')
  },
  {
    label: 'Preferências',
    icon: 'pi pi-cog',
    command: () => router.push('/cliente/settings')
  },
  {
    separator: true
  },
  {
    label: 'Sair',
    icon: 'pi pi-sign-out',
    command: () => handleLogout()
  }
];

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function toggleUserMenu(event) {
  menu.value.toggle(event);
}

async function handleLogout() {
  await authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.router-link-active {
  @apply bg-primary-50 text-primary-600;
}

.router-link-active i {
  @apply text-primary-600;
}
</style>
