<template>
  <aside :class="[
    'fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out',
    props.isCollapsed ? 'w-20' : 'w-64',
    props.isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]" class="bg-white border-r border-gray-100 shadow-lg">
    
    <!-- Header da Sidebar -->
    <div class="flex items-center justify-between p-4 h-16 border-b border-gray-100 bg-white">
      <router-link to="/" class="flex items-center">
        <span v-show="!props.isCollapsed" class="ml-3 text-lg font-bold transition-opacity duration-200 text-black">
          Smart Wallet
        </span>
      </router-link>
      <Button 
        @click="toggleCollapse" 
        icon="pi pi-bars"
        class="lg:flex bg-white hover:bg-gray-100 border-none p-2 text-black rounded-lg transition-all duration-200 shadow-sm hover:shadow-md" 
      />
    </div>

    <!-- Menu Items -->
    <div class="overflow-y-auto py-6 px-3 h-[calc(100vh-4rem-4rem)]">
      <nav class="space-y-2">
        <div v-for="(item, index) in menuItems" :key="index">
          <router-link 
            :to="item.to" 
            v-if="!item.requiresAdmin || (item.requiresAdmin && isAdmin)"
            class="group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative"
            :class="[
              { 'justify-center': props.isCollapsed },
              $route.path === item.to 
                ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <!-- Ícone -->
            <div class="flex items-center justify-center w-6 h-6">
              <i :class="[
                'pi',
                item.icon,
                'text-lg transition-all duration-200',
                $route.path === item.to 
                  ? 'text-indigo-600 transform scale-110' 
                  : 'text-gray-400 group-hover:text-gray-600'
              ]"></i>
            </div>
            
            <!-- Label -->
            <span 
              v-show="!props.isCollapsed" 
              :class="[
                'ml-3 transition-all duration-200',
                $route.path === item.to 
                  ? 'text-indigo-700 font-semibold' 
                  : 'text-gray-600 group-hover:text-gray-900'
              ]"
            >
              {{ item.label }}
            </span>
            
            <!-- Indicador ativo -->
            <div 
              v-if="$route.path === item.to && !props.isCollapsed"
              class="absolute right-3 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
            ></div>
          </router-link>
        </div>
      </nav>
      
      <!-- Divider -->
      <div class="my-6 border-t border-gray-200"></div>
      
      <!-- User Section -->
      <div v-if="!props.isCollapsed" class="px-3 py-4 bg-gray-50 rounded-xl">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">A</span>
          </div>
          <div class="ml-3 min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-900 truncate">{{ userData.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ userData.email }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
      <Button 
        @click="handleLogout" 
        :icon="props.isCollapsed ? 'pi pi-sign-out' : ''"
        :label="props.isCollapsed ? undefined : 'Sair'"
        class="w-full justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 border-none bg-transparent"
      />
    </div>
  </aside>

  <!-- Overlay para mobile -->
  <div v-if="props.isMobileOpen" 
    class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm lg:hidden z-30 transition-opacity duration-300"
    @click="emit('update:isMobileOpen', false)"
  ></div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/authStore';
import { adminStore } from '@/stores/admin/adminStore';
import { ref, onMounted } from 'vue';

const storeAdmin = adminStore();

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

//Importando o store de autenticação
const authStore = useAuthStore();

const emit = defineEmits(['update:isMobileOpen', 'update:isCollapsed']);

const router = useRouter();

const isAdmin = computed(() => localStorage.getItem('user-role') === 'admin');

const toggleCollapse = () => {
  emit('update:isCollapsed', !props.isCollapsed);
};

const userData = ref({
  name: '',
  email: '',
})

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
  await authStore.userLogout();

  // Clear local storage or any other state management
  localStorage.removeItem("token-auth");
  localStorage.removeItem("user-role");

  router.push({path: '/'});
};

const initFunction = async () => {

  const response = await storeAdmin.getUserById();

  if (response.success == true) {
    userData.value.name = response.user.name;
    userData.value.email = response.user.email;
  } else {
    console.error('Erro ao buscar dados do usuário:', response.message);
  }
}

onMounted(async () => {
  await initFunction();
});
</script>

<style>
/* Active link styling personalizado */
.router-link-active {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%) !important;
  color: #4338ca !important;
  border-left: 4px solid #4f46e5 !important;
  font-weight: 600 !important;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
}

.router-link-active i {
  color: #4f46e5 !important;
  transform: scale(1.1) !important;
}

/* Hover effects */
.group:hover:not(.router-link-active) {
  background: #f9fafb !important;
  transform: translateX(2px);
}

.group:hover:not(.router-link-active) i {
  color: #6b7280 !important;
  transform: scale(1.05);
}

/* Smooth transitions */
.group {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.group i {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile responsive adjustments */
@media (max-width: 1024px) {
  .router-link-active {
    border-left: none !important;
    border-bottom: 3px solid #4f46e5 !important;
  }
}
</style>
