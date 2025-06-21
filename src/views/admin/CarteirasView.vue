<template>
  <div class="min-h-screen bg-gray-50 p-6 transition-all duration-300 ease-in-out" v-if="!loading">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Carteiras</h1>
        <p class="text-sm text-gray-500">Gerencie todos as carteiras do sistema</p>
      </div>

      <div class="flex items-center gap-3">
        <Button icon="pi pi-refresh" text rounded
          class="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          @click="initFunction"
          aria-label="Atualizar" />        <Button label="Nova Carteira" icon="pi pi-plus" @click="showDialog"
          class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 px-6 py-2.5 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <i class="pi pi-briefcase text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total de Carteiras</p>
            <p class="text-2xl font-bold text-gray-900">{{ carteiras.length }}</p>
          </div>
        </div>
      </div>
      <!--
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <i class="pi pi-chart-pie text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total de Ativos</p>
            <p class="text-2xl font-bold text-gray-900">{{ getTotalAtivos() }}</p>
          </div>
        </div>
      </div> -->
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <i class="pi pi-users text-purple-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Clientes com Carteiras</p>
            <p class="text-2xl font-bold text-gray-900">{{ getClientesUnicos() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex-1">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-gray-400" />            <InputText v-model="searchQuery" placeholder="Buscar carteiras por nome ou cliente..."
              class="w-full pl-10 pr-4 py-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500" />
          </span>
        </div>        <div class="flex items-center gap-3">
          <Dropdown v-model="clienteFilter" :options="clienteOptions" optionLabel="label" optionValue="value"
            placeholder="Filtrar por cliente" class="min-w-[180px]" />
          <Button icon="pi pi-filter-slash" text @click="clearFilters"
            class="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
            v-tooltip="'Limpar filtros'" />
        </div>
      </div>
    </div>    <!-- Carteiras Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <DataTable :value="filteredCarteiras" :paginator="true" :rows="10" stripedRows :rowHover="true"
        responsiveLayout="stack" breakpoint="768px"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} carteiras" class="modern-datatable">
        
        <!-- Nome da Carteira -->
        <Column field="nome" header="Carteira" sortable style="min-width: 200px">
          <template #body="slotProps">
            <div class="flex items-center py-2 transition-all duration-200 hover:bg-gray-50 rounded-lg px-2 -mx-2">
              <div class="relative">
                <div
                  class="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg">
                  <span class="text-white font-semibold text-lg">
                    {{ slotProps.data.nome.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-semibold text-gray-900 text-base">
                  {{ slotProps.data.nome }}
                </div>
                <div class="text-sm text-gray-500 truncate">
                  {{ slotProps.data.descricao }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <!-- Cliente -->
        <Column field="cliente_nome" header="Cliente" sortable style="min-width: 180px">
          <template #body="slotProps">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i class="pi pi-user text-blue-600 text-sm"></i>
              </div>
              <div>
                <div class="font-medium text-gray-900 text-sm">
                  {{ slotProps.data.cliente_nome }}
                </div>
                <div class="text-xs text-gray-500">
                  ID: {{ slotProps.data.cliente_id }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <!-- Quantidade de Ativos -->
        <Column field="quantidade_ativos" header="Ativos" sortable style="min-width: 120px">
          <template #body="slotProps">
            <div class="text-center">
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <i class="pi pi-chart-line mr-1"></i>
                {{ slotProps.data.quantidade_ativos }}
              </div>
            </div>
          </template>
        </Column>

        <!-- Data de Criação -->
        <Column field="created_at" header="Criado em" sortable style="min-width: 140px">
          <template #body="slotProps">
            <div class="text-sm text-gray-600">
              {{ formatDate(slotProps.data.created_at) }}
            </div>
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
                v-tooltip="'Editar carteira'" @click="editModal(slotProps.data.id)" />
              <Button icon="pi pi-trash" text rounded size="small"
                class="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                v-tooltip="'Excluir carteira'" @click="deleteCarteira(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>    <!-- Modal de Nova Carteira -->
    <Dialog v-model:visible="visible" modal header="Nova Carteira" :style="{ width: '500px' }"
      class="p-fluid modern-dialog">
      <div class="space-y-6 mt-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="field">
            <label for="nome" class="block text-sm font-semibold text-gray-700 mb-2">
              Nome da Carteira *
            </label>
            <InputText id="nome" v-model="newCarteira.nome" required autofocus
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Digite o nome da carteira" />
          </div>
          <div class="field">
            <label for="descricao" class="block text-sm font-semibold text-gray-700 mb-2">
              Descrição *
            </label>
            <InputText id="descricao" v-model="newCarteira.descricao" required
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Descrição da carteira" />
          </div>
          <div class="field">
            <label for="cliente" class="block text-sm font-semibold text-gray-700 mb-2">
              Cliente *
            </label>
            <Dropdown id="cliente" v-model="newCarteira.cliente_id" :options="clientes" optionLabel="name" optionValue="id"
              placeholder="Selecione o cliente"
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 pt-4">
          <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"
            class="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200" />
          <Button label="Criar Carteira" icon="pi pi-check" @click="createCarteira"
            class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" />
        </div>
      </template>
    </Dialog>    <Dialog v-model:visible="editVisible" modal header="Atualizar Carteira" :style="{ width: '500px' }"
      class="p-fluid modern-dialog">
      <div class="space-y-6 mt-4">
        <div class="grid grid-cols-1 gap-4">
          <div class="field">
            <label for="nome" class="block text-sm font-semibold text-gray-700 mb-2">
              Nome da Carteira *
            </label>
            <InputText id="nome" v-model="editPayload.nome" required autofocus
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Digite o nome da carteira" />
          </div>
          <div class="field">
            <label for="descricao" class="block text-sm font-semibold text-gray-700 mb-2">
              Descrição *
            </label>
            <InputText id="descricao" v-model="editPayload.descricao" required
              class="w-full p-3 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Descrição da carteira" />
          </div>
          <div class="field">
            <label for="cliente" class="block text-sm font-semibold text-gray-700 mb-2">
              Cliente
            </label>
            <InputText id="cliente" v-model="editPayload.cliente_nome" disabled
              class="w-full p-3 border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              placeholder="Cliente não pode ser alterado" />
          </div>
          <div class="field">
            <label for="ativos" class="block text-sm font-semibold text-gray-700 mb-2">
              Quantidade de Ativos
            </label>
            <InputText id="ativos" v-model="editPayload.quantidade_ativos" disabled
              class="w-full p-3 border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 pt-4">
          <Button label="Cancelar" icon="pi pi-times" text @click="hideEditDialog"
            class="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200" />
          <Button label="Salvar Alterações" icon="pi pi-check" @click="updateCarteira"
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
import { carteiraStore } from '@/stores/carteiras/carteiraStore';
import { clientStore } from '@/stores/clients/clientStore';

const carteirasStore = carteiraStore();
const clientsStore = clientStore();

const searchQuery = ref('');
const clienteFilter = ref('');
const visible = ref(false);
const editVisible = ref(false);
const loading = ref(false);

//Importação de Erros
const error = ref(false);
const success = ref(false);
const textError = ref(null);
const textSuccess = ref(null);

const carteiras = ref([]);
const clientes = ref([]);
const clienteOptions = ref([]);

const editPayload = ref({
  id: null,
  nome: '',
  descricao: '',
  cliente_id: '',
  cliente_nome: '',
  quantidade_ativos: 0
});

const newCarteira = ref({
  nome: '',
  descricao: '',
  cliente_id: ''
});

const getCarteiras = async () => {
  try {
    const response = await carteirasStore.getCarteiras();
    carteiras.value = response;
    console.log('Carteiras carregadas2:', carteiras.value);
  } catch (error) {
    console.error('Erro ao carregar carteiras:', error);
    textError.value = 'Erro ao carregar carteiras';
    error.value = true;
    setTimeout(() => error.value = false, 3000);
  }
};

const getClientes = async () => {
  try {
    const response = await clientsStore.getClients();
    clientes.value = response;
    
    // Criar opções para o dropdown de filtro
    clienteOptions.value = [
      { label: 'Todos os Clientes', value: '' },
      ...response.map(cliente => ({
        label: cliente.name,
        value: cliente.id
      }))
    ];
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
  }
};

const initFunction = async () => {
  loading.value = true;
  await getCarteiras();
  await getClientes();
  console.log('Carteiras carregadas:', carteiras.value);
  loading.value = false;
};

const filteredCarteiras = computed(() => {
  let filtered = carteiras.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(carteira =>
      carteira.nome.toLowerCase().includes(query) ||
      carteira.cliente_nome.toLowerCase().includes(query) ||
      carteira.descricao.toLowerCase().includes(query)
    );
  }

  if (clienteFilter.value) {
    filtered = filtered.filter(carteira => carteira.cliente_id === clienteFilter.value);
  }

  return filtered;
});


const getClientesUnicos = () => {
  const clientesUnicos = new Set(carteiras.value.map(carteira => carteira.cliente_id));
  return clientesUnicos.size;
};

// Função para formatar data
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const showDialog = () => {
  // Resetar formulário
  newCarteira.value = {
    nome: '',
    descricao: '',
    cliente_id: ''
  };
  visible.value = true;
};

const hideDialog = () => {
  visible.value = false;
};

const createCarteira = async () => {
  try {
    const response = await carteirasStore.createCarteira(newCarteira.value);

    if (response.success) {
      visible.value = false;
      loading.value = true;
      await getCarteiras();
      loading.value = false;
      success.value = true;
      textSuccess.value = response.message || 'Carteira criada com sucesso';
      setTimeout(() => success.value = false, 3000);
    } else {
      error.value = true;
      textError.value = response.message || 'Erro ao criar carteira';
      setTimeout(() => error.value = false, 3000);
    }
  } catch (err) {
    error.value = true;
    textError.value = 'Erro ao criar carteira';
    setTimeout(() => error.value = false, 3000);
  }
};

const editModal = (carteiraId) => {
  const carteira = carteiras.value.find(c => c.id === carteiraId);
  if (carteira) {
    editPayload.value = {
      id: carteira.id,
      nome: carteira.nome,
      descricao: carteira.descricao,
      cliente_id: carteira.cliente_id,
      cliente_nome: carteira.cliente_nome,
      quantidade_ativos: carteira.quantidade_ativos
    };
    editVisible.value = true;
  } else {
    error.value = true;
    textError.value = "Carteira não encontrada para edição.";
    setTimeout(() => error.value = false, 3000);
  }
};

const hideEditDialog = () => {
  editVisible.value = false;
};

const updateCarteira = async () => {
  try {
    const payload = {
      nome: editPayload.value.nome,
      descricao: editPayload.value.descricao,
      cliente_id: editPayload.value.cliente_id
    };

    const response = await carteirasStore.updateCarteira(editPayload.value.id, payload);

    if (response.success) {
      editVisible.value = false;
      loading.value = true;
      await getCarteiras();
      loading.value = false;
      success.value = true;
      textSuccess.value = response.message || 'Carteira atualizada com sucesso';
      setTimeout(() => success.value = false, 3000);
    } else {
      error.value = true;
      textError.value = response.message || 'Erro ao atualizar carteira';
      setTimeout(() => error.value = false, 3000);
    }
  } catch (err) {
    error.value = true;
    textError.value = 'Erro ao atualizar carteira';
    setTimeout(() => error.value = false, 3000);
  }
};

const deleteCarteira = async (carteiraId) => {
  if (confirm('Tem certeza que deseja excluir esta carteira?')) {
    try {
      const response = await carteirasStore.deleteCarteira(carteiraId);

      if (response.success) {
        loading.value = true;
        await getCarteiras();
        loading.value = false;
        success.value = true;
        textSuccess.value = response.message || 'Carteira excluída com sucesso';
        setTimeout(() => success.value = false, 3000);
      } else {
        error.value = true;
        textError.value = response.message || 'Erro ao excluir carteira';
        setTimeout(() => error.value = false, 3000);
      }
    } catch (err) {
      error.value = true;
      textError.value = 'Erro ao excluir carteira';
      setTimeout(() => error.value = false, 3000);
    }
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  clienteFilter.value = '';
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
