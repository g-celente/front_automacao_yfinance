<template>
  <div class="min-h-screen flex flex-col md:flex-row-reverse">
    <!-- Formulário de Registro -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center space-y-6">
          <img class="h-12 w-auto mx-auto" src="@/assets/logo.svg" alt="Logo" />
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">
            Crie sua conta
          </h1>
          <p class="text-base text-gray-500">
            Junte-se a nós e comece a gerenciar seu estoque
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <InputText
                v-model="form.name"
                type="text"
                class="w-full"
                :class="{ 'p-invalid': v$.name.$error }"
                placeholder="Seu nome"
              />
              <small class="p-error block mt-1" v-if="v$.name.$error">
                {{ v$.name.$errors[0].$message }}
              </small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <InputText
                v-model="form.email"
                type="email"
                class="w-full"
                :class="{ 'p-invalid': v$.email.$error }"
                placeholder="seu@email.com"
              />
              <small class="p-error block mt-1" v-if="v$.email.$error">
                {{ v$.email.$errors[0].$message }}
              </small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <Password
                v-model="form.password"
                :feedback="true"
                toggleMask
                class="w-full"
                :class="{ 'p-invalid': v$.password.$error }"
                placeholder="••••••••"
              />
              <small class="p-error block mt-1" v-if="v$.password.$error">
                {{ v$.password.$errors[0].$message }}
              </small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Confirme sua senha
              </label>
              <Password
                v-model="form.confirmPassword"
                :feedback="false"
                toggleMask
                class="w-full"
                :class="{ 'p-invalid': v$.confirmPassword.$error }"
                placeholder="••••••••"
              />
              <small class="p-error block mt-1" v-if="v$.confirmPassword.$error">
                {{ v$.confirmPassword.$errors[0].$message }}
              </small>
            </div>
          </div>

          <Button
            type="submit"
            :loading="loading"
            class="w-full p-button-primary"
            label="Criar conta"
          />

          <p class="text-center text-sm text-gray-600">
            Já tem uma conta?
            <router-link
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Faça login
            </router-link>
          </p>
        </form>
      </div>
    </div>

    <!-- Seção da Ilustração -->
    <div class="hidden md:flex w-1/2 bg-primary-600 p-8 items-center justify-center">
      <div class="max-w-md text-center">
        <img
          src="@/assets/img/register-illustration.svg"
          alt="Register Illustration"
          class="w-full max-w-sm mx-auto mb-8 animate-float"
        />
        <h2 class="text-2xl font-bold text-white mb-4">
          Comece sua jornada agora
        </h2>
        <p class="text-primary-100">
          Gerencie seu estoque de forma eficiente e inteligente
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth/authStore';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const rules = {
  name: { required },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  confirmPassword: { required, sameAs: sameAs(form.password) }
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
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: 'OPERATOR'
    });
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Cadastro realizado com sucesso!',
      life: 3000
    });
    router.push('/');
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
