<template>
  <aside :class="[
    'fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out',
    isCollapsed ? 'w-20' : 'w-64',
    isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]" class="bg-white border-r border-gray-100 shadow-sm">
    <div class="flex items-center justify-between p-4 h-16 border-b border-gray-100">
      <router-link to="/" class="flex items-center">
        <span v-show="!isCollapsed" class="ml-3 text-lg font-semibold text-gray-900 transition-opacity duration-200">
          Stock Manager
        </span>
      </router-link>
      <Button @click="toggleCollapse" icon="pi pi-bars"
        class="lg:flex bg-transparent hover:bg-transparent shadow-none border-none p-2 text-black rounded-none" />
    </div>

    <div class="overflow-y-auto py-4 px-3 h-[calc(100vh-4rem-4rem)]">
      <ul class="space-y-2">
        <li v-for="(item, index) in menuItems" :key="index">
          <router-link :to="item.to" v-if="!item.requiresAdmin || (item.requiresAdmin && isAdmin)"
            class="flex items-center p-3 text-gray-600 rounded-lg hover:bg-indigo-50 group transition-all duration-200"
            :class="{ 'justify-center': isCollapsed }">
            <span :class="[
              'pi',
              item.icon,
              'text-lg transition-colors duration-200 group-hover:text-indigo-600',
              { 'text-indigo-600': $route.path === item.to }
            ]"></span>
            <span v-show="!isCollapsed" :class="[
              'ml-3 whitespace-nowrap transition-colors duration-200 group-hover:text-indigo-600',
              { 'text-indigo-600 font-medium': $route.path === item.to }
            ]">
              {{ item.label }}
            </span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
      <Button @click="handleLogout" :icon="isCollapsed ? 'pi pi-sign-out' : ''"
        :label="isCollapsed ? undefined : 'Sair'" text
        class="w-full justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200" />
    </div>
  </aside>

  <!-- Overlay para mobile -->
  <div v-if="isMobileOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm lg:hidden z-30"
    @click="emit('update:isMobileOpen', false)"></div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import logo from '@/assets/logo.svg';

const props = defineProps({
  isMobileOpen: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:isMobileOpen', 'update:isCollapsed']);

const router = useRouter();

const isAdmin = computed(() => localStorage.getItem('user-role') === 'admin');

console.log(isAdmin.value)

const toggleCollapse = () => {
  emit('update:isCollapsed', !props.isCollapsed);
};

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi-home',
    to: '/admin/dashboard',
  },
  {
    label: 'Usuários',
    icon: 'pi-users',
    to: '/admin/users',
    requiresAdmin: true
  },
  {
    label: 'Carteira',
    icon: 'pi-wallet',
    to: '/carteira',
  }
];

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style>
.router-link-active {
  background-color: rgb(238 242 255);
}

.router-link-active span {
  color: rgb(79 70 229);
  font-weight: 500;
}
</style>
