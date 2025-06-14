<template>
  <div class="space-y-6">
    <!-- Header com Sumário -->
    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-gray-600">Saldo Total</h2>
          <p class="text-3xl font-bold text-gray-900">R$ 45.789,00</p>
          <span class="text-sm text-green-600">
            <i class="pi pi-arrow-up mr-1"></i>
            +12.5% este mês
          </span>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-gray-600">Rendimento</h2>
          <p class="text-3xl font-bold text-gray-900">R$ 1.234,00</p>
          <span class="text-sm text-green-600">
            <i class="pi pi-arrow-up mr-1"></i>
            +2.7% último período
          </span>
        </div>
        <div class="flex justify-end items-center space-x-3">
          <Button
            icon="pi pi-download"
            label="Exportar"
            class="p-button-outlined"
          />
          <Button
            icon="pi pi-plus"
            label="Novo Produto"
            severity="success"
          />
        </div>
      </div>
    </div>

    <!-- Filtros e Pesquisa -->
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
      <div class="flex gap-3 w-full md:w-auto">
        <span class="p-input-icon-left flex-1 md:w-64">
          <i class="pi pi-search"></i>
          <InputText
            v-model="filters.global"
            placeholder="Buscar produtos..."
            class="w-full"
          />
        </span>
        <Button
          icon="pi pi-filter"
          label="Filtros"
          @click="showFilters = !showFilters"
          class="p-button-outlined"
          :class="{ 'p-button-secondary': showFilters }"
        />
      </div>
      <div class="flex gap-3 w-full md:w-auto">
        <Dropdown
          v-model="selectedView"
          :options="viewOptions"
          optionLabel="label"
          class="w-full md:w-40"
        />
        <Button
          icon="pi pi-chart-line"
          class="p-button-outlined"
          @click="showAnalytics = true"
        />
      </div>
    </div>

    <!-- Grid de Produtos -->
    <div v-if="selectedView.value === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ product.name }}
            </h3>
            <p class="text-sm text-gray-600">{{ product.category }}</p>
          </div>
          <Tag :value="product.status" :severity="getStatusSeverity(product.status)" />
        </div>
        
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Quantidade</span>
            <span class="font-medium">{{ product.quantity }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Valor Unitário</span>
            <span class="font-medium">R$ {{ product.price }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total</span>
            <span class="font-bold">R$ {{ (product.quantity * product.price).toFixed(2) }}</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-2">
          <Button
            icon="pi pi-pencil"
            text
            rounded
            @click="editProduct(product)"
          />
          <Button
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            @click="confirmDelete(product)"
          />
        </div>
      </div>
    </div>

    <!-- Tabela de Produtos -->
    <div v-else class="bg-white rounded-lg border border-gray-200">
      <DataTable
        :value="products"
        :paginator="true"
        :rows="10"
        stripedRows
        responsiveLayout="stack"
        class="p-datatable-sm"
      >
        <Column field="name" header="Nome" sortable />
        <Column field="category" header="Categoria" sortable />
        <Column field="quantity" header="Quantidade" sortable />
        <Column field="price" header="Valor Unit." sortable>
          <template #body="{ data }">
            R$ {{ data.price }}
          </template>
        </Column>
        <Column field="status" header="Status" sortable>
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </Column>
        <Column header="Ações">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                text
                rounded
                @click="editProduct(data)"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                @click="confirmDelete(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog de Analytics -->
    <Dialog
      v-model:visible="showAnalytics"
      header="Analytics da Carteira"
      :style="{ width: '90vw', maxWidth: '960px' }"
      modal
    >
      <div class="p-4 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Placeholder para gráficos -->
          <div class="bg-gray-50 p-6 rounded-lg min-h-[300px] flex items-center justify-center">
            <div class="text-center">
              <i class="pi pi-chart-line text-4xl text-gray-400"></i>
              <p class="mt-2 text-gray-500">Distribuição por Categoria</p>
            </div>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg min-h-[300px] flex items-center justify-center">
            <div class="text-center">
              <i class="pi pi-chart-bar text-4xl text-gray-400"></i>
              <p class="mt-2 text-gray-500">Performance Mensal</p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';

const showFilters = ref(false);
const showAnalytics = ref(false);
const filters = ref({
  global: ''
});

const selectedView = ref({ label: 'Grid', value: 'grid' });
const viewOptions = [
  { label: 'Grid', value: 'grid' },
  { label: 'Lista', value: 'list' }
];

// Dados mockados
const products = [
  {
    id: 1,
    name: 'Produto A',
    category: 'Categoria 1',
    quantity: 100,
    price: 25.99,
    status: 'Em estoque'
  },
  {
    id: 2,
    name: 'Produto B',
    category: 'Categoria 2',
    quantity: 50,
    price: 45.00,
    status: 'Baixo estoque'
  },
  {
    id: 3,
    name: 'Produto C',
    category: 'Categoria 1',
    quantity: 0,
    price: 19.99,
    status: 'Sem estoque'
  }
];

function getStatusSeverity(status) {
  switch (status) {
    case 'Em estoque':
      return 'success';
    case 'Baixo estoque':
      return 'warning';
    case 'Sem estoque':
      return 'danger';
    default:
      return 'info';
  }
}

function editProduct(product) {
  // TODO: Implementar edição
  console.log('Editar produto:', product);
}

function confirmDelete(product) {
  // TODO: Implementar confirmação de exclusão
  console.log('Confirmar exclusão:', product);
}
</script>

<style scoped>
/* Animações suaves */
.p-dialog-enter-active {
  transition: all 0.3s ease-out;
}

.p-dialog-leave-active {
  transition: all 0.2s ease-in;
}

.p-dialog-enter-from,
.p-dialog-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
