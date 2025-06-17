<template>
  <div class="space-y-6">
    <!-- Área de Busca -->
    <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Buscar Ativo</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div class="md:col-span-6 flex-col">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Digite o código do ativo..."
              class="w-full"
            />
          </span>
        </div>
        
        <div class="md:col-span-4">
          <Dropdown
            v-model="selectedPeriod"
            :options="periods"
            optionLabel="label"
            placeholder="Selecione o período"
            class="w-full"
          />
        </div>
        
        <div class="md:col-span-2">
          <Button
            label="Buscar"
            icon="pi pi-search"
            :loading="loading"
            @click="handleSearch"
            class="w-full p-button-primary"
          />
        </div>
      </div>
    </div>

    <!-- Resultados da Busca -->
    <div class="space-y-6">
      <!-- Cards de Métricas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card v-for="(metric, key) in {
          returnRate: ['Retorno Esperado', assetMetrics.returnRate, 'pi-trending-up'],
          stdDev: ['Desvio Padrão', assetMetrics.stdDev, 'pi-chart-bar'],
          performance: ['vs. Benchmark', `${assetMetrics.performance} vs ${assetMetrics.benchmark}`, 'pi-chart-line'],
          charp: ['Sharpe Ratio', '1.5', 'pi-star']
        }" :key="key"
        class="transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <template #content>
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">{{ metric[0] }}</p>
                <h4 class="mt-2 text-xl font-semibold text-gray-900">{{ metric[1] }}</h4>
              </div>
              <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <i :class="['pi', metric[2], 'text-indigo-600']"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Gráfico -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Histórico de Preços - {{ searchQuery || 'Ativo' }}
        </h3>
        <Chart
          type="line"
          :data="chartData"
          :options="chartOptions"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Chart from 'primevue/chart';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';

const searchQuery = ref('');
const selectedPeriod = ref({ label: 'Últimos 30 dias', value: 30 });
const loading = ref(false);
const hasSearched = ref(false);

const periods = [
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 30 dias', value: 30 },
  { label: 'Últimos 90 dias', value: 90 }
];

const chartData = computed(() => ({
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: searchQuery.value || 'Ativo',
      data: [65, 72, 68, 75, 82, 85],
      borderColor: '#4F46E5',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(79, 70, 229, 0.1)'
    },
    {
      label: 'BOVA11',
      data: [60, 65, 60, 68, 75, 78],
      borderColor: '#9333EA',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(147, 51, 234, 0.1)'
    }
  ]
}));

const chartOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#64748b'
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#64748b'
      }
    },
    y: {
      grid: {
        color: '#e2e8f0'
      },
      ticks: {
        color: '#64748b'
      }
    }
  }
};

const assetMetrics = {
  returnRate: '+15.2%',
  stdDev: '12.4%',
  performance: '+8.9%',
  benchmark: 'BOVA11'
};

const handleSearch = () => {
  loading.value = true;
  // Simula uma busca
  setTimeout(() => {
    loading.value = false;
    hasSearched.value = true;
  }, 800);
};
</script>

<style scoped>
:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-card) {
  border-radius: 0.75rem;
  border: 1px solid #f1f5f9;
}

:deep(.p-card-content) {
  padding: 1.5rem;
}

:deep(.p-inputtext) {
  width: 100%;
  padding-left: 2.5rem;
}

:deep(.p-input-icon-left > i:first-of-type) {
  left: 0.75rem;
}
</style>
