<template>
  <div class="min-h-screen bg-gray-50 p-6 transition-all duration-300 ease-in-out" v-if="!loading">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Usuários</h1>
        <p class="text-sm text-gray-500">Gerencie todos os usuários do sistema</p>
      </div>

      <div class="flex items-center gap-3">
        <Button icon="pi pi-refresh" text rounded
          class="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          @click="initFunction"
          aria-label="Atualizar" />
        <Button label="Novo Usuário" icon="pi pi-plus" @click="showDialog"
          class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 px-6 py-2.5 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <i class="pi pi-users text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total de Usuários</p>
            <p class="text-2xl font-bold text-gray-900">{{ users.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <i class="pi pi-check-circle text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Usuários Ativos</p>
            <p class="text-2xl font-bold text-gray-900">{{users.filter(u => u.status === 'Ativo').length}}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-lg">
            <i class="pi pi-clock text-yellow-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pendentes</p>
            <p class="text-2xl font-bold text-gray-900">{{users.filter(u => u.status === 'Pendente').length}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex-1">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-gray-400" />
            <InputText v-model="searchQuery" placeholder="Buscar usuários por nome ou email..."
              class="w-full pl-10 pr-4 py-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500" />
          </span>
        </div>
        <div class="flex items-center gap-3">
          <Dropdown v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value"
            placeholder="Filtrar por status" class="min-w-[180px]" />
          <Button icon="pi pi-filter-slash" text @click="clearFilters"
            class="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
            v-tooltip="'Limpar filtros'" />
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <DataTable :value="filteredUsers" :paginator="true" :rows="10" stripedRows :rowHover="true"
        responsiveLayout="stack" breakpoint="768px"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários" class="modern-datatable">
        <!-- Avatar e Nome -->
        <Column field="name" header="Usuário" sortable style="min-width: 280px">
          <template #body="slotProps">
            <div class="flex items-center py-2 transition-all duration-200 hover:bg-gray-50 rounded-lg px-2 -mx-2">
              <div class="relative">
                <div
                  class="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg">
                  <span class="text-white font-semibold text-lg">
                    {{ slotProps.data.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-semibold text-gray-900 text-base">
                  {{ slotProps.data.name }}
                </div>
                <div class="text-sm text-gray-500 truncate">
                  {{ slotProps.data.email }}
                </div>
              </div>
            </div>
          </template>
        </Column>
        <Column field="telefone" header="Telefone" sortable style="min-width: 140px">
          <template #body="slotProps">
            <div class="font-mono text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-md">
              {{ slotProps.data.telefone }}
            </div>
          </template>
        </Column>

        <!-- CPF -->
        <Column field="cpf" header="CPF" sortable style="min-width: 140px">
          <template #body="slotProps">
            <div class="font-mono text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-md">
              {{ slotProps.data.cpf }}
            </div>
          </template>
        </Column>

        <!-- Status -->
        <Column field="status" header="Status" sortable style="min-width: 120px">
          <template #body="slotProps">
            <span :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 transform hover:scale-105',
              {
                'bg-green-100 text-green-800 border border-green-200': slotProps.data.status === 'Ativo',
                'bg-red-100 text-red-800 border border-red-200': slotProps.data.status === 'Inativo',
                'bg-yellow-100 text-yellow-800 border border-yellow-200': slotProps.data.status === 'Pendente'
              }
            ]">
              <span class="w-2 h-2 rounded-full mr-2" :class="{
                'bg-green-500': slotProps.data.status === 'Ativo',
                'bg-red-500': slotProps.data.status === 'Inativo',
                'bg-yellow-500': slotProps.data.status === 'Pendente'
              }"></span>
              {{ slotProps.data.status }}
            </span>
          </template>
        </Column>

        <!-- Ações -->
        <Column style="width: 120px">
          <template #header>
            <span class="text-center w-full block">Ações</span>
          </template>
          <template #body="slotProps">
            <div class="flex items-center justify-center gap-2">
              <Button icon="pi pi-pencil" text rounded size="small"
                class="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 transform hover:scale-110"
                v-tooltip="'Editar usuário'" @click="editModal(slotProps.data.id)" />
              <Button icon="pi pi-trash" text rounded size="small"
                class="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                v-tooltip="'Excluir usuário'" @click="deleteClient(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal de Novo Usuário -->
    <Dialog v-model:visible="visible" modal header="Novo Usuário" :style="{ width: '500px' }"
      class="p-fluid modern-dialog">
      <div class="space-y-6 mt-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="field">
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo *
            </label>
            <InputText id="name" v-model="newUser.nome" required autofocus
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Digite o nome completo" />
          </div>
          <div class="field">
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <InputText id="email" v-model="newUser.email" required type="email"
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="usuario@exemplo.com" />
          </div>
          <div class="field">
            <label for="telefone" class="block text-sm font-semibold text-gray-700 mb-2">
              Telefone *
            </label>
            <InputText id="telefone" v-model="newUser.telefone" required
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="(41) 9 9649-1619" />
          </div>
          <div class="field">
            <label for="cpf" class="block text-sm font-semibold text-gray-700 mb-2">
              CPF *
            </label>
            <InputText id="cpf" v-model="newUser.cpf" required
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="000.000.000-00" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 pt-4">
          <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"
            class="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200" />
          <Button label="Criar Usuário" icon="pi pi-check" @click="createUser"
            class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" />
        </div>
      </template>
    </Dialog>

    <Dialog v-model:visible="editVisible" modal header="Atualizar Usuário" :style="{ width: '500px' }"
      class="p-fluid modern-dialog">
      <div class="space-y-6 mt-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="field">
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo *
            </label>
            <InputText id="name" v-model="editPayload.name" required autofocus
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Digite o nome completo" />
          </div>
          <div class="field">
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <InputText id="email" v-model="editPayload.email" required type="email"
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="usuario@exemplo.com" />
          </div>
          <div class="field">
            <label for="telefone" class="block text-sm font-semibold text-gray-700 mb-2">
              Telefone *
            </label>
            <InputText id="telefone" v-model="editPayload.telefone" required
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="(41) 9 9649-1619" />
          </div>
          <div class="field">
            <label for="cpf" class="block text-sm font-semibold text-gray-700 mb-2">
              CPF *
            </label>
            <InputText id="cpf" v-model="editPayload.cpf" required
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="000.000.000-00" />
          </div>
          <div class="field">
            <label for="status" class="block text-sm font-semibold text-gray-700 mb-2">
              Status do Cliente *
            </label>
            <InputText id="cpf" v-model="editPayload.status" required
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="000.000.000-00" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 pt-4">
          <Button label="Salvar Alterações" icon="pi pi-check" @click="updateUser"
            class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" />
        </div>
      </template>
    </Dialog>
    <BaseAlertError v-if="error" :text="textError" />
    <BaseAlertSuccess v-if="success" :text="textSuccess" />
  </div>
  <div v-else class="loading">
    <BaseLoading class="loading-icon" />
  </div>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseAlertError from '@/components/alert/BaseAlertError.vue';
import BaseAlertSuccess from '@/components/alert/BaseAlertSuccess.vue';

//Importação de stores
import { clientStore } from '@/stores/clients/clientStore';

const clientAdmStore = clientStore();

const searchQuery = ref('');
const statusFilter = ref('');
const visible = ref(false);
const editVisible = ref(false);
const loading = ref(false);

//Importação de Erros
const error = ref(false);
const success = ref(false);
const textError = ref(null);
const textSuccess = ref(null);

const users = ref([]);
const client = ref(null);
const editPayload = ref({
  id: null,
  name: '',
  email: '',
  cpf: '',
  telefone: '',
  status: ''
});

const newUser = ref({
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
});

const getUsers = async () => {
  try {
    const response = await clientAdmStore.getClients();
    users.value = response;
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
  }
};

const initFunction = async () => {
  loading.value = true;
  await getUsers();
  console.log('Usuários carregados:', users.value);
  loading.value = false;
};

const statusOptions = [
  { label: 'Todos os Status', value: '' },
  { label: 'Ativo', value: 'Ativo' },
  { label: 'Inativo', value: 'Inativo' },
  { label: 'Pendente', value: 'Pendente' }
];

const filteredUsers = computed(() => {
  let filtered = users.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value);
  }

  return filtered;
});

const showDialog = () => {
  visible.value = true;
};

const getClientById = (userId) => {
  
  const response = clientAdmStore.getClientById(userId);
  if (response.success == true) {
    user.value = response.data;
  } else {
    error.value = true;
    textError.value = response.message || 'Erro ao buscar usuário';
    setTimeout(() => {
      error.value = false;
    }, 3000);
  }

};

const createUser = async () => {

  const response = await clientAdmStore.createClient(newUser.value);

  if (response.success == true) {
    visible.value = false;
    loading.value = true;
    await getUsers()
    loading.value = false;
    success.value = true;
    textSuccess.value = response.message || 'Usuário criado com sucesso';
    setTimeout(() => {
      success.value = false;
    }, 3000);
  }

  error.value = true;
  textError.value = response.message || 'Erro ao criar usuário';
  setTimeout(() => {
    error.value = false;
  }, 3000);
};

const editModal = (userId) => {
  const user = users.value.find(u => u.id === userId);
  if (user) {
    editPayload.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      telefone: user.telefone,
      cpf: user.cpf,
      status: user.status
    };
    editVisible.value = true;
  } else {
    error.value = true;
    textError.value = "Usuário não encontrado para edição.";
    setTimeout(() => error.value = false, 3000);
  }
};

const updateUser = async () => {
  const response = await clientAdmStore.updateClient(editPayload.value.id, editPayload.value); // implementar na store

  if (response.success) {
    editVisible.value = false;
    loading.value = true;
    await getUsers();
    loading.value = false;
    success.value = true;
    textSuccess.value = response.message || 'Usuário atualizado com sucesso';
    setTimeout(() => success.value = false, 3000);
  } else {
    error.value = true;
    textError.value = response.message || 'Erro ao atualizar usuário';
    setTimeout(() => error.value = false, 3000);
  }
};


const deleteClient = async (userId) => {

  const response = await clientAdmStore.deleteClient(userId);

  if (response.success == true) {
    loading.value = true;
    await getUsers();
    loading.value = false;
    success.value = true;
    textSuccess.value = response.message || 'Usuário excluído com sucesso';
    setTimeout(() => {
      success.value = false;
    }, 3000);
  }

  error.value = true;
  textError.value = response.message || 'Erro ao excluir usuário';
  setTimeout(() => {
    error.value = false;
  }, 3000);
};

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
};

onMounted(async () => {
  await initFunction();
});
</script>

<style>
/* DataTable Customization */
:deep(.modern-datatable .p-datatable-header) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.modern-datatable .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  border-color: #e5e7eb;
  padding: 1rem;
  font-size: 0.875rem;
}

:deep(.modern-datatable .p-datatable-tbody > tr) {
  transition: all 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

:deep(.modern-datatable .p-datatable-tbody > tr:hover) {
  background: #f9fafb;
  transform: translateY(-1px);
}

:deep(.modern-datatable .p-datatable-tbody > tr > td) {
  padding: 1.25rem 1rem;
  border-color: #f3f4f6;
}

/* Paginator Styling */
:deep(.p-paginator) {
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  margin: 0 0.125rem;
  border-radius: 0.5rem;
  min-width: 2.5rem;
  height: 2.5rem;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  background: white;
  transition: all 0.2s ease;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page:hover) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

/* Dialog Styling */
:deep(.modern-dialog .p-dialog) {
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

:deep(.modern-dialog .p-dialog-header) {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 1rem 1rem 0 0;
  padding: 1.5rem;
}

:deep(.modern-dialog .p-dialog-content) {
  background: white;
  padding: 1.5rem;
}

:deep(.modern-dialog .p-dialog-footer) {
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 1rem 1rem;
  padding: 1.5rem;
}

/* Input Styling */
:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* Tooltip Styling */
:deep(.p-tooltip .p-tooltip-text) {
  background: #1f2937;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
}
</style>
