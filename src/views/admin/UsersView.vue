<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Usuários</h1>
      <Button
        icon="pi pi-plus"
        label="Novo Usuário"
        severity="primary"
        @click="showDialog"
        class="px-4 py-2"
      />
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <DataTable
        :value="users"
        class="p-datatable-sm"
        responsiveLayout="scroll"
        :paginator="true"
        :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários"
      >
        <Column field="name" header="Nome" sortable style="min-width: 200px">
          <template #body="slotProps">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <span class="text-sm font-medium text-gray-600">
                  {{ slotProps.data.name.charAt(0) }}
                </span>
              </div>
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
        <Column field="cpf" header="CPF" sortable style="min-width: 150px" />
        <Column field="status" header="Status" sortable style="min-width: 120px">
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
        <Column style="width: 100px">
          <template #body>
            <Button
              icon="pi pi-ellipsis-v"
              text
              rounded
              severity="secondary"
              aria-label="Ações"
            />
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
            >Nome</label
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
        <div class="flex justify-end space-x-2">
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
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const users = ref([
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    cpf: '123.456.789-00',
    status: 'Ativo'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    cpf: '987.654.321-00',
    status: 'Inativo'
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    cpf: '456.789.123-00',
    status: 'Pendente'
  }
]);

const visible = ref(false);
const newUser = ref({
  name: '',
  email: '',
  cpf: '',
  status: 'Pendente'
});

const statusSeverity = {
  Ativo: 'success',
  Inativo: 'danger',
  Pendente: 'warning'
};

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
.p-datatable .p-datatable-header {
  background-color: white;
  border: none;
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: #f9fafb;
  color: #4b5563;
  border-color: #f3f4f6;
}

.p-datatable .p-datatable-tbody > tr {
  transition: background-color 0.2s;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background-color: #f9fafb;
}

.p-datatable .p-datatable-tbody > tr > td {
  border-color: #f3f4f6;
}

.p-dialog .p-dialog-header {
  background-color: white;
  border-bottom: 1px solid #f3f4f6;
}

.p-dialog .p-dialog-content {
  background-color: white;
}

.p-dialog .p-dialog-footer {
  background-color: #f9fafb;
  border-top: 1px solid #f3f4f6;
}

.p-button.p-button-primary {
  background: #4F46E5;
}

.p-button.p-button-primary:hover {
  background: #4338CA;
}
</style>
