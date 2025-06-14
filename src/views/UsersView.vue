<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Usuários</h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ filteredUsers.length }} usuários registrados
        </p>
      </div>
      
      <Button
        label="Novo Usuário"
        icon="pi pi-plus"
        @click="showDialog"
        class="p-button-primary"
      />
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          placeholder="Buscar usuários..."
          class="w-full"
        />
      </span>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <DataTable
        :value="filteredUsers"
        :paginator="true"
        :rows="10"
        stripedRows
        class="p-datatable-sm"
        responsiveLayout="stack"
        :rowHover="true"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários"
      >
        <!-- Nome e Avatar -->
        <Column field="name" header="Nome" style="min-width: 250px">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <Avatar
                :label="slotProps.data.avatar"
                shape="circle"
                class="bg-indigo-100 text-indigo-600"
              />
              <div>
                <div class="font-medium text-gray-900">
                  {{ slotProps.data.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ slotProps.data.email }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <!-- CPF -->
        <Column field="cpf" header="CPF" style="min-width: 150px">
          <template #body="slotProps">
            <span class="text-gray-600">{{ slotProps.data.cpf }}</span>
          </template>
        </Column>

        <!-- Status -->
        <Column field="status" header="Status" style="min-width: 120px">
          <template #body="slotProps">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                {
                  'bg-green-100 text-green-800': slotProps.data.status === 'Ativo',
                  'bg-red-100 text-red-800': slotProps.data.status === 'Inativo',
                  'bg-yellow-100 text-yellow-800': slotProps.data.status === 'Pendente'
                }
              ]"
            >
              {{ slotProps.data.status }}
            </span>
          </template>
        </Column>

        <!-- Ações -->
        <Column style="width: 100px">
          <template #body>
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                text
                rounded
                class="text-gray-600 hover:text-indigo-600"
              />
              <Button
                icon="pi pi-eye"
                text
                rounded
                class="text-gray-600 hover:text-indigo-600"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal de Novo Usuário -->
    <Dialog
      v-model:visible="visible"
      modal
      header="Novo Usuário"
      :style="{ width: '450px' }"
      class="p-fluid"
    >
      <div class="space-y-4 mt-4">
        <div class="field">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1"
            >Nome Completo</label
          >
          <InputText
            id="name"
            v-model="newUser.name"
            required
            autofocus
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <InputText
            id="email"
            v-model="newUser.email"
            required
            type="email"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="cpf" class="block text-sm font-medium text-gray-700 mb-1"
            >CPF</label
          >
          <InputText id="cpf" v-model="newUser.cpf" required class="w-full" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            text
            @click="hideDialog"
          />
          <Button
            label="Salvar"
            icon="pi pi-check"
            severity="primary"
            @click="hideDialog"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';

const searchQuery = ref('');
const visible = ref(false);
const users = ref([
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    cpf: '123.456.789-00',
    status: 'Ativo',
    avatar: 'JS'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    cpf: '987.654.321-00',
    status: 'Inativo',
    avatar: 'MS'
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    cpf: '456.789.123-00',
    status: 'Pendente',
    avatar: 'PO'
  }
]);

const newUser = ref({
  name: '',
  email: '',
  cpf: '',
  status: 'Pendente'
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  );
});

const showDialog = () => {
  visible.value = true;
};

const hideDialog = () => {
  visible.value = false;
  newUser.value = {
    name: '',
    email: '',
    cpf: '',
    status: 'Pendente'
  };
};
</script>

<style>
:deep(.p-datatable .p-datatable-header) {
  background-color: white;
  border: none;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8fafc;
  color: #64748b;
  border-color: #f1f5f9;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: #f1f5f9;
  padding: 1rem;
}

:deep(.p-dialog .p-dialog-header) {
  background-color: white;
  border-bottom: 1px solid #f1f5f9;
  padding: 1.5rem;
}

:deep(.p-dialog .p-dialog-content) {
  background-color: white;
  padding: 1.5rem;
}

:deep(.p-dialog .p-dialog-footer) {
  background-color: #f8fafc;
  border-top: 1px solid #f1f5f9;
  padding: 1.5rem;
}

:deep(.p-paginator) {
  background-color: white;
  border-top: 1px solid #f1f5f9;
  padding: 1rem;
}

:deep(.p-input-icon-left > i:first-of-type) {
  left: 0.75rem;
  color: #64748b;
}

:deep(.p-inputtext) {
  padding-left: 2.5rem;
}
</style>
