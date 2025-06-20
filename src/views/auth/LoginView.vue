<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
    <div class="w-full max-w-6xl mx-auto">
      <!-- Card Principal -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
        <div class="flex flex-col lg:flex-row min-h-[600px]">
          
          <!-- Formulário de Login -->
          <div class="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
            <div class="w-full max-w-md space-y-8 animate-fade-in">
              
              <!-- Header -->
              <div class="text-center space-y-4">
                <div class="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <img class="h-8 w-8" src="/public/logo-smart-wallet.svg" alt="Logo" />
                </div>
                <h1 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Bem-vindo de volta
                </h1>
                <p class="text-gray-600 text-lg">
                  Entre com suas credenciais para continuar
                </p>
              </div>

              <!-- Formulário -->
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-5">
                  <!-- Email -->
                  <div class="group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                      Email
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="pi pi-envelope text-gray-400 transition-colors group-focus-within:text-indigo-500"></i>
                      </div>
                      <InputText
                        v-model="form.email"
                        type="email"
                        class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all duration-300 text-gray-900 placeholder-gray-400"
                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-50': v$.email.$error }"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <small class="text-red-500 text-sm font-medium block mt-2 min-h-[20px]" v-if="v$.email.$error">
                      {{ v$.email.$errors[0].$message }}
                    </small>
                  </div>

                  <!-- Senha -->
                  <div class="group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                      Senha
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <i class="pi pi-lock text-gray-400 transition-colors group-focus-within:text-indigo-500"></i>
                      </div>
                      <Password
                        v-model="form.password"
                        :feedback="false"
                        toggleMask
                        class="w-full password-input"
                        :class="{ 'p-invalid': v$.password.$error }"
                        placeholder="••••••••"
                        :pt="{
                          input: {
                            class: 'w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all duration-300 text-gray-900 placeholder-gray-400'
                          }
                        }"
                      />
                    </div>
                    <small class="text-red-500 text-sm font-medium block mt-2 min-h-[20px]" v-if="v$.password.$error">
                      {{ v$.password.$errors[0].$message }}
                    </small>
                  </div>
                </div>

                <!-- Remember me & Forgot password -->
                <div class="flex items-center justify-between pt-2">
                  <div class="flex items-center group">
                    <Checkbox
                      v-model="rememberMe"
                      :binary="true"
                      class="mr-3 transition-transform duration-200 group-hover:scale-105"
                    />
                    <label class="text-sm font-medium text-gray-600 cursor-pointer">Lembrar-me</label>
                  </div>
                  <div class="text-sm">
                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline">
                      Esqueceu sua senha?
                    </a>
                  </div>
                </div>

                <!-- Botão Login -->
                <Button
                  type="submit"
                  :loading="loading"
                  class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] focus:scale-[0.98] border-none"
                  label="Entrar na conta"
                />

                <!-- Link para registro -->
                <p class="text-center text-gray-600 pt-4">
                  Não tem uma conta?
                  <router-link
                    to="/register"
                    class="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline ml-1"
                  >
                    Criar conta gratuita
                  </router-link>
                </p>
              </form>
            </div>
          </div>

          <!-- Seção Ilustrativa -->
          <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-12 items-center justify-center relative overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, white 2px, transparent 2px); background-size: 24px 24px;"></div>
            </div>
            
            <div class="relative z-10 text-center space-y-8">
              <div class="animate-float">
                <img
                  src="@/assets/img/login-illustration.svg"
                  alt="Login Illustration"
                  class="w-full max-w-sm mx-auto mb-8 drop-shadow-2xl"
                />
              </div>
              <div class="space-y-4">
                <h2 class="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Gerencie a carteira de seus clientes
                  <span class="block text-indigo-200">com inteligência</span>
                </h2>
                <p class="text-xl text-indigo-100 leading-relaxed max-w-md mx-auto">
                  A plataforma completa para transformar sua gestão de carteiras em uma vantagem competitiva.
                </p>
              </div>
              
              <!-- Feature highlights -->
              <div class="grid grid-cols-1 gap-4 mt-8 max-w-sm mx-auto">
                <div class="flex items-center space-x-3 text-indigo-100">
                  <div class="w-2 h-2 bg-indigo-300 rounded-full"></div>
                  <span class="text-sm">Dashboard em tempo real</span>
                </div>
                <div class="flex items-center space-x-3 text-indigo-100">
                  <div class="w-2 h-2 bg-indigo-300 rounded-full"></div>
                  <span class="text-sm">Pesquisa em tempo real dos ativos</span>
                </div>
                <div class="flex items-center space-x-3 text-indigo-100">
                  <div class="w-2 h-2 bg-indigo-300 rounded-full"></div>
                  <span class="text-sm">Segurança garantida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-gray-500 text-sm">
        © 2024 Smart Wallet. Todos os direitos reservados.
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

/* Custom Password Input Styling */
:deep(.password-input .p-password-input) {
  padding-left: 3rem !important;
  padding-right: 3rem !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
  border: 2px solid #e5e7eb !important;
  border-radius: 0.75rem !important;
  transition: all 0.3s ease !important;
}

:deep(.password-input .p-password-input:focus) {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
}

:deep(.password-input.p-invalid .p-password-input) {
  border-color: #f87171 !important;
}

:deep(.password-input.p-invalid .p-password-input:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
}

:deep(.password-input .p-password-toggle-icon) {
  color: #9ca3af !important;
  transition: color 0.2s ease !important;
}

:deep(.password-input .p-password-toggle-icon:hover) {
  color: #6366f1 !important;
}

/* Checkbox Styling */
:deep(.p-checkbox .p-checkbox-box) {
  border-radius: 0.375rem !important;
  border: 2px solid #d1d5db !important;
  transition: all 0.2s ease !important;
}

:deep(.p-checkbox .p-checkbox-box:hover) {
  border-color: #6366f1 !important;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #6366f1 !important;
  border-color: #6366f1 !important;
}
</style>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth/authStore';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);
const rememberMe = ref(false);

const form = ref({
  email: '',
  password: ''
});

const rules = {
  email: { required, email },
  password: { required }
};

const v$ = useVuelidate(rules, form);

const handleSubmit = async () => {
  loading.value = true;
  const login = await authStore.userLogin(form.value)

  if (login) {
    localStorage.setItem("token-auth", login.token);
    localStorage.setItem("user-role", login.user.role);

    if (login.user.role === "admin") {
      router.push({ path: "/admin/dashboard" });
    } else if (login.user.role === "CLIENT") {
      router.push({ path: "/cliente/dashboard" });
    }
  } else {
    error.value = true;
    setTimeout(() => {
      error.value = false;
    }, 3000);
  }
  loading.value = false;
};
</script>
