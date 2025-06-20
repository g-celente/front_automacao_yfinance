<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-6xl mx-auto">
      <!-- Card Principal -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
        <div class="flex flex-col lg:flex-row-reverse min-h-[700px]">
          
          <!-- Formulário de Registro -->
          <div class="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
            <div class="w-full max-w-md space-y-8 animate-fade-in">
              
              <!-- Header -->
              <div class="text-center space-y-4">
                <div class="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <img class="h-8 w-8" src="@/assets/logo.svg" alt="Logo" />
                </div>
                <h1 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Crie sua conta
                </h1>
                <p class="text-gray-600 text-lg">
                  Comece sua jornada conosco gratuitamente
                </p>
              </div>

              <!-- Formulário -->
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-5">
                  <!-- Nome -->
                  <div class="group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-emerald-600">
                      Nome completo
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="pi pi-user text-gray-400 transition-colors group-focus-within:text-emerald-500"></i>
                      </div>
                      <InputText
                        v-model="form.name"
                        type="text"
                        class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-300 text-gray-900 placeholder-gray-400"
                        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-50': v$.name.$error }"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <small class="text-red-500 text-sm font-medium block mt-2 min-h-[20px]" v-if="v$.name.$error">
                      {{ v$.name.$errors[0].$message }}
                    </small>
                  </div>

                  <!-- Email -->
                  <div class="group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-emerald-600">
                      Email
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="pi pi-envelope text-gray-400 transition-colors group-focus-within:text-emerald-500"></i>
                      </div>
                      <InputText
                        v-model="form.email"
                        type="email"
                        class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-300 text-gray-900 placeholder-gray-400"
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
                    <label class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-emerald-600">
                      Senha
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <i class="pi pi-lock text-gray-400 transition-colors group-focus-within:text-emerald-500"></i>
                      </div>
                      <Password
                        v-model="form.password"
                        :feedback="true"
                        toggleMask
                        class="w-full password-input"
                        :class="{ 'p-invalid': v$.password.$error }"
                        placeholder="••••••••"
                        :pt="{
                          input: {
                            class: 'w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-300 text-gray-900 placeholder-gray-400'
                          }
                        }"
                      />
                    </div>
                    <small class="text-red-500 text-sm font-medium block mt-2 min-h-[20px]" v-if="v$.password.$error">
                      {{ v$.password.$errors[0].$message }}
                    </small>
                  </div>

                  <!-- Confirmar Senha -->
                  <div class="group">
                    <label class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-emerald-600">
                      Confirme sua senha
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <i class="pi pi-shield text-gray-400 transition-colors group-focus-within:text-emerald-500"></i>
                      </div>
                      <Password
                        v-model="form.confirmPassword"
                        :feedback="false"
                        toggleMask
                        class="w-full password-input"
                        :class="{ 'p-invalid': v$.confirmPassword.$error }"
                        placeholder="••••••••"
                        :pt="{
                          input: {
                            class: 'w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all duration-300 text-gray-900 placeholder-gray-400'
                          }
                        }"
                      />
                    </div>
                    <small class="text-red-500 text-sm font-medium block mt-2 min-h-[20px]" v-if="v$.confirmPassword.$error">
                      {{ v$.confirmPassword.$errors[0].$message }}
                    </small>
                  </div>
                </div>

                <!-- Botão Registro -->
                <Button
                  type="submit"
                  :loading="loading"
                  class="w-full py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] focus:scale-[0.98] border-none"
                  label="Criar conta gratuita"
                />

                <!-- Link para login -->
                <p class="text-center text-gray-600 pt-4">
                  Já tem uma conta?
                  <router-link
                    to="/"
                    class="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors duration-200 hover:underline ml-1"
                  >
                    Fazer login
                  </router-link>
                </p>
              </form>
            </div>
          </div>

          <!-- Seção Ilustrativa -->
          <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-600 via-blue-600 to-emerald-700 p-12 items-center justify-center relative overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, white 2px, transparent 2px); background-size: 24px 24px;"></div>
            </div>
            
            <div class="relative z-10 text-center space-y-8">
              <div class="animate-float">
                <img
                  src="@/assets/img/register-illustration.svg"
                  alt="Register Illustration"
                  class="w-full max-w-sm mx-auto mb-8 drop-shadow-2xl"
                />
              </div>
              <div class="space-y-4">
                <h2 class="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Comece sua jornada
                  <span class="block text-emerald-200">hoje mesmo</span>
                </h2>
                <p class="text-xl text-emerald-100 leading-relaxed max-w-md mx-auto">
                  Junte-se a milhares de assessores que já transformaram sua gestão de carteiras.
                </p>
              </div>
              
              <!-- Benefits -->
              <div class="grid grid-cols-1 gap-4 mt-8 max-w-sm mx-auto">
                <div class="flex items-center space-x-3 text-emerald-100">
                  <div class="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <i class="pi pi-check text-emerald-300 text-sm"></i>
                  </div>
                  <span class="text-sm">Configuração em 5 minutos</span>
                </div>
                <div class="flex items-center space-x-3 text-emerald-100">
                  <div class="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <i class="pi pi-check text-emerald-300 text-sm"></i>
                  </div>
                  <span class="text-sm">Suporte 24/7 incluso</span>
                </div>
                <div class="flex items-center space-x-3 text-emerald-100">
                  <div class="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <i class="pi pi-check text-emerald-300 text-sm"></i>
                  </div>
                  <span class="text-sm">Sem compromisso</span>
                </div>
              </div>

              <!-- Trust indicators -->
              <div class="pt-8 border-t border-emerald-500/20">
                <p class="text-emerald-200 text-sm mb-4">Já confiado por</p>
                <div class="flex justify-center items-center space-x-6 text-emerald-300">
                  <span class="text-2xl font-bold">500+</span>
                  <span class="text-sm">assessores</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-gray-500 text-sm">
        © 2024 Stock Manager. Todos os direitos reservados.
      </div>
    </div>
    <BaseAlertError v-if="error" :message="textError" />
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
  border-color: #10b981 !important;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
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
  color: #10b981 !important;
}

/* Password Strength Meter */
:deep(.p-password-meter) {
  margin-top: 0.5rem !important;
}

:deep(.p-password-strength) {
  height: 4px !important;
  border-radius: 2px !important;
}
</style>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth/authStore';
import { useToast } from 'primevue/usetoast';
import BaseAlertError from '@/components/alert/BaseAlertError.vue';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);
const error = ref(null);
const textError = ref('');

const form = ref({
  name: '',
  email: '',
  password: '',
});

const rules = {
  name: { required },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  confirmPassword: { required }
};

const v$ = useVuelidate(rules, form);

async function handleSubmit() {
  loading.value = true;
  const isValid = await v$.value.$validate();
  
  if (!isValid) {
    loading.value = false;
    return;
  }

  try {
    const response = await authStore.registerUser(form.value);

    if (response.success == true) {
      router.push('/');
    }

    error.value = true
    textError.value = response.message || 'Cadastro realizado com sucesso!';
    setTimeout(() => {
      error.value = false;
      textError.value = '';
    }, 3000);

  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro ao realizar cadastro',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
}
</script>
