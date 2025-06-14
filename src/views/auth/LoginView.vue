<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- Formulário de Login -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center space-y-6">
          <img class="h-12 w-auto mx-auto" src="@/assets/logo.svg" alt="Logo" />
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">
            Faça seu login
          </h1>
          <p class="text-base text-gray-500">
            Entre com suas credenciais para acessar sua conta
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
          <div class="space-y-4">
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
                :feedback="false"
                toggleMask
                class="w-full"
                :class="{ 'p-invalid': v$.password.$error }"
                placeholder="••••••••"
              />
              <small class="p-error block mt-1" v-if="v$.password.$error">
                {{ v$.password.$errors[0].$message }}
              </small>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Checkbox
                v-model="rememberMe"
                :binary="true"
                class="mr-2"
              />
              <label class="text-sm text-gray-600">Lembrar-me</label>
            </div>
            <div class="text-sm">
              <a href="#" class="text-primary-600 hover:text-primary-500">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            :loading="loading"
            class="w-full p-button-primary"
            label="Entrar"
          />

          <p class="text-center text-sm text-gray-600">
            Não tem uma conta?
            <router-link
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Registre-se
            </router-link>
          </p>
        </form>
      </div>
    </div>

    <!-- Seção da Ilustração -->
    <div class="hidden md:flex w-1/2 bg-primary-600 p-8 items-center justify-center">
      <div class="max-w-md text-center">
        <img
          src="@/assets/img/login-illustration.svg"
          alt="Login Illustration"
          class="w-full max-w-sm mx-auto mb-8 animate-float"
        />
        <h2 class="text-2xl font-bold text-white mb-4">
          A melhor experiência de login
        </h2>
        <p class="text-primary-100">
          que você já teve na sua vida.
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
