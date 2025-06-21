<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Carregando dados da carteira...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="carteiraData">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <button 
            @click="$router.go(-1)"
            class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-3 transition-colors duration-200"
          >
            <i class="pi pi-arrow-left mr-2"></i>
            Voltar para Carteiras
          </button>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">
            Dashboard da Carteira #{{ $route.params.id }}
          </h1>
          <p class="text-gray-500">Análise completa de performance e composição</p>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center gap-3 mt-4 sm:mt-0">
          <Button
            icon="pi pi-plus"
            label="Adicionar Ativo"
            @click="showAddAssetDialog"
            class="px-4 py-2 text-sm font-medium transition-all duration-200"
          />
          <Button
            icon="pi pi-download"
            label="Exportar"
            @click="exportData($route.params.id)"
            :loading="exportLoading"
            outlined
            class="px-4 py-2 text-sm font-medium transition-all duration-200"
            />
        </div>
      </div>      <!-- Estado Vazio -->
      <div v-if="!hasAtivos" class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="mb-6">
            <i class="pi pi-chart-line text-6xl text-gray-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhum ativo cadastrado ainda</h3>
          <p class="text-gray-500 mb-6">Comece adicionando ativos à sua carteira para visualizar os indicadores e análises.</p>
          <Button
            icon="pi pi-plus"
            label="Adicionar Primeiro Ativo"
            @click="showAddAssetDialog"
            class="px-6 py-3 font-medium transition-all duration-200"
          />
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- Cards de Métricas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Total de Ativos -->
          <div class="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <p class="text-sm font-medium text-gray-500">Total de Ativos</p>
                <h3 class="text-2xl font-bold text-gray-900">{{ carteiraData.ativos_ordenados.length }}</h3>
                <div class="flex items-center space-x-1">
                  <i class="pi pi-arrow-up text-emerald-500"></i>
                  <span class="text-sm font-medium text-emerald-600">
                    {{ carteiraData.ativos_ordenados.length }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">Diversificação</p>
              </div>
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100">
                <i class="pi pi-chart-pie text-xl text-blue-600"></i>
              </div>
            </div>
          </div>

          <!-- Retorno Esperado -->
          <div class="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <p class="text-sm font-medium text-gray-500">Retorno Esperado</p>
                <h3 :class="retornoTextClass" class="text-2xl font-bold">
                  {{ formatPercentage(carteiraData.indicadores_carteira.retorno_esperado) }}
                </h3>
                <div class="flex items-center space-x-1">
                  <i :class="carteiraData.indicadores_carteira.retorno_esperado >= 0 ? 'pi pi-arrow-up text-emerald-500' : 'pi pi-arrow-down text-red-500'"></i>
                  <span :class="retornoClass" class="text-sm font-medium">
                    {{ Math.abs(carteiraData.indicadores_carteira.retorno_esperado * 100).toFixed(1) }}%
                  </span>
                </div>
                <p class="text-sm text-gray-500">Performance</p>
              </div>
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100">
                <i class="pi pi-trending-up text-xl text-emerald-600"></i>
              </div>
            </div>
          </div>

          <!-- Desvio Padrão -->
          <div class="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <p class="text-sm font-medium text-gray-500">Risco (Desvio Padrão)</p>
                <h3 class="text-2xl font-bold text-gray-900">
                  {{ formatPercentage(carteiraData.indicadores_carteira.desvio_padrao) }}
                </h3>
                <div class="flex items-center space-x-1">
                  <i class="pi pi-exclamation-triangle text-orange-500"></i>
                  <span class="text-sm font-medium text-orange-600">Volatilidade</span>
                </div>
                <p class="text-sm text-gray-500">Risco calculado</p>
              </div>
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100">
                <i class="pi pi-exclamation-triangle text-xl text-orange-600"></i>
              </div>
            </div>
          </div>

          <!-- Índice Sharpe -->
          <div class="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <p class="text-sm font-medium text-gray-500">Índice Sharpe</p>
                <h3 class="text-2xl font-bold text-gray-900">
                  {{ formatNumber(carteiraData.indicadores_carteira.indice_sharpe) }}
                </h3>
                <div class="flex items-center space-x-1">
                  <i :class="carteiraData.indicadores_carteira.indice_sharpe > 1 ? 'pi pi-arrow-up text-emerald-500' : 'pi pi-arrow-down text-red-500'"></i>
                  <span :class="sharpeClass" class="text-sm font-medium">
                    {{ getSharpeRating(carteiraData.indicadores_carteira.indice_sharpe) }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">Relação Risco/Ret.</p>
              </div>
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-violet-100">
                <i class="pi pi-chart-bar text-xl text-violet-600"></i>
              </div>
            </div>
          </div>

          <!-- Índice de Desempenho -->
          <div class="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <p class="text-sm font-medium text-gray-500">Performance Index</p>
                <h3 class="text-2xl font-bold text-gray-900">
                  {{ formatPercentage(carteiraData.indicadores_carteira.indice_desempenho) }}
                </h3>
                <div class="flex items-center space-x-1">
                  <i class="pi pi-calculator text-indigo-500"></i>
                  <span class="text-sm font-medium text-indigo-600">Índice geral</span>
                </div>
                <p class="text-sm text-gray-500">Desempenho</p>
              </div>
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-100">
                <i class="pi pi-calculator text-xl text-indigo-600"></i>
              </div>
            </div>
          </div>        </div>

        <!-- Gráficos e Análises -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Gráfico Principal - Retorno vs Risco -->
          <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                Análise de Retorno vs Risco
              </h3>
              <Dropdown
                v-model="selectedChartType"
                :options="chartTypes"
                optionLabel="label"
                class="w-40"
              />
            </div>
            <Chart 
              v-if="selectedChartType.value === 'scatter'"
              type="scatter" 
              :data="scatterChartData" 
              :options="scatterChartOptions" 
              class="h-[300px]" 
            />
            <Chart 
              v-else
              type="radar" 
              :data="radarChartData" 
              :options="radarChartOptions" 
              class="h-[300px]" 
            />
          </div>

          <!-- Lista de Ativos -->
          <div class="bg-white p-6 rounded-xl border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Top Ativos da Carteira
            </h3>
            <div class="space-y-4">
              <div
                v-for="(ativo, index) in carteiraData.ativos_ordenados.slice(0, 5)"
                :key="index"
                class="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
                  <i class="pi pi-chart-line text-blue-600"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ ativo.ticker }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Peso: {{ formatPercentage(ativo.peso) }}
                  </p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-xs text-gray-400">
                      Ret: {{ formatPercentage(ativo.retorno_esperado) }}
                    </span>
                    <span class="text-xs text-gray-400">
                      Risk: {{ formatPercentage(ativo.desvio_padrao) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div v-if="carteiraData.ativos_ordenados.length > 5" class="text-center pt-2">
                <Button
                  label="Ver Todos os Ativos"
                  @click="scrollToAssetsTable"
                  text
                  class="text-sm text-indigo-600 hover:text-indigo-700"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Heatmap da Matriz de Covariância -->
        <div class="bg-white rounded-xl p-6 border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Matriz de Covariância</h3>
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full">
              <div class="grid gap-1" :style="{ gridTemplateColumns: `repeat(${carteiraData.ativos_ordenados.length + 1}, minmax(100px, 1fr))` }">
                <!-- Header -->
                <div class="p-3 font-semibold text-gray-700"></div>
                <div 
                  v-for="ativo in carteiraData.ativos_ordenados" 
                  :key="`header-${ativo}`"
                  class="p-3 font-semibold text-gray-700 text-center bg-gray-50 rounded-lg"
                >
                  {{ formatTicker(ativo) }}
                </div>
                
                <!-- Rows -->
                <template v-for="(ativo1, i) in carteiraData.ativos_ordenados" :key="`row-${ativo1}`">
                  <div class="p-3 font-semibold text-gray-700 bg-gray-50 rounded-lg">
                    {{ formatTicker(ativo1) }}
                  </div>
                  <div 
                    v-for="(ativo2, j) in carteiraData.ativos_ordenados" 
                    :key="`cell-${ativo1}-${ativo2}`"
                    class="p-3 text-center text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                    :class="getCovarianceColor(carteiraData.matriz_cov_customizada[ativo1][ativo2])"
                  >
                    {{ formatNumber(carteiraData.matriz_cov_customizada[ativo1][ativo2], 6) }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>        <!-- Tabela de Ativos Detalhada -->
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden" ref="assetsTable">
          <div class="p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">Composição da Carteira</h3>
            <p class="text-sm text-gray-500 mt-1">Análise detalhada de cada ativo</p>
          </div>
          
          <DataTable 
            :value="ativosDetalhados" 
            :paginator="false" 
            stripedRows 
            :rowHover="true"
            responsiveLayout="stack" 
            breakpoint="768px"
            class="modern-datatable"
          >
            <!-- Nome do Ativo -->
            <Column field="ticker" header="Ativo" style="min-width: 150px">
              <template #body="slotProps">
                <div class="flex items-center">
                  <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-white font-bold text-sm"
                    :class="slotProps.data.ticker === 'BOVA11.SA' ? 'bg-yellow-100' : 'bg-blue-100'"
                  >
                    <i 
                      class="pi pi-chart-line" 
                      :class="slotProps.data.ticker === 'BOVA11.SA' ? 'text-yellow-600' : 'text-blue-600'"
                    ></i>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900">
                      {{ formatTicker(slotProps.data.ticker) }}
                    </div>
                    <div v-if="slotProps.data.ticker === 'BOVA11.SA'" class="text-xs text-yellow-600 font-medium">
                      <i class="pi pi-star-fill mr-1"></i>Benchmark
                    </div>
                  </div>
                </div>
              </template>
            </Column>

            <!-- Beta -->
            <Column field="beta" header="Beta" style="min-width: 100px">
              <template #body="slotProps">
                <div class="text-center">
                  <span class="font-medium text-gray-900">{{ formatNumber(slotProps.data.beta) }}</span>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ getBetaInterpretation(slotProps.data.beta) }}
                  </div>
                </div>
              </template>
            </Column>

            <!-- Retorno Esperado -->
            <Column field="retorno" header="Retorno" style="min-width: 120px">
              <template #body="slotProps">
                <div class="text-center">
                  <span :class="getReturnColorClass(slotProps.data.retorno)" class="font-semibold">
                    {{ formatPercentage(slotProps.data.retorno) }}
                  </span>
                </div>
              </template>
            </Column>

            <!-- Desvio Padrão (Risco) -->
            <Column field="risco" header="Risco" style="min-width: 120px">
              <template #body="slotProps">
                <div class="text-center">
                  <span class="font-medium text-gray-900">{{ formatPercentage(slotProps.data.risco) }}</span>
                  <div class="mt-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-500"
                        :class="slotProps.data.risco > 0.3 ? 'bg-red-400' : slotProps.data.risco > 0.15 ? 'bg-yellow-400' : 'bg-green-400'"
                        :style="{ width: Math.min(slotProps.data.risco * 300, 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </template>
            </Column>

            <!-- Peso na Carteira -->
            <Column field="peso" header="Peso (%)" style="min-width: 120px">
              <template #body="slotProps">
                <div class="text-center">
                  <span class="font-semibold text-indigo-600">{{ formatPercentage(slotProps.data.peso) }}</span>
                  <div class="mt-1">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        :style="{ width: (slotProps.data.peso * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </template>
            </Column>

            <!-- Índice Sharpe -->
            <Column field="sharpe" header="Sharpe" style="min-width: 100px">
              <template #body="slotProps">
                <div class="text-center">
                  <span class="font-medium text-gray-900">{{ formatNumber(slotProps.data.sharpe) }}</span>
                  <div class="text-xs mt-1" :class="getSharpeColorClass(slotProps.data.sharpe)">
                    {{ getSharpeRating(slotProps.data.sharpe) }}
                  </div>
                </div>
              </template>
            </Column>

            <!-- Índice de Desempenho -->
            <Column field="desempenho" header="Desempenho" style="min-width: 120px">
              <template #body="slotProps">
                <div class="text-center">
                  <span :class="getReturnColorClass(slotProps.data.desempenho)" class="font-semibold">
                    {{ formatPercentage(slotProps.data.desempenho) }}
                  </span>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>    <!-- Error State -->
    <div v-else class="flex flex-col items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="pi pi-exclamation-triangle text-4xl text-red-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Erro ao carregar dados</h3>
        <p class="text-gray-500 mb-4">Não foi possível carregar os dados da carteira.</p>
        <Button
          label="Tentar Novamente"
          icon="pi pi-refresh"
          @click="loadCarteiraData"
          class="px-4 py-2"
        />
      </div>
      <Button
            icon="pi pi-plus"
            label="Adicionar Ativo"
            @click="showAddAssetDialog"
            class="px-4 py-2 text-sm font-medium transition-all duration-200 mt-4"
        />
    </div>    <!-- Modal Adicionar Ativo -->
    <Dialog
      v-model:visible="addAssetDialogVisible"
      modal
      header="Adicionar Ativo à Carteira"
      :style="{ width: '500px' }"
      class="p-fluid"
    >
      <div class="space-y-6 mt-4">
        <div class="field">
          <label for="ticker" class="block text-sm font-semibold text-gray-700 mb-2">
            Ticker do Ativo *
          </label>
          <InputText
            id="ticker"
            v-model="newAsset.ticker"
            required
            autofocus
            class="w-full"
            placeholder="Ex: ITUB4.SA, VALE3.SA"
            @keypress.enter="addAsset"
          />
          <small class="text-gray-500 mt-1">Digite o código do ativo (ex: PETR4.SA)</small>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="intervalo" class="block text-sm font-semibold text-gray-700 mb-2">
              Intervalo
            </label>
            <Dropdown
              id="intervalo"
              v-model="newAsset.intervalo"
              :options="intervalOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecione o intervalo"
              class="w-full"
            />
          </div>
          
          <div class="field">
            <label for="period" class="block text-sm font-semibold text-gray-700 mb-2">
              Período
            </label>
            <Dropdown
              id="period"
              v-model="newAsset.period"
              :options="periodOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecione o período"
              class="w-full"
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3 pt-4">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            text
            @click="hideAddAssetDialog"
            class="transition-all duration-200"
          />
          <Button
            label="Adicionar Ativo"
            icon="pi pi-plus"
            :loading="addingAsset"
            :disabled="!newAsset.ticker"
            @click="addAsset"
            class="transition-all duration-200"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { carteiraStore } from '@/stores/carteiras/carteiraStore';
import { assetStore } from '@/stores/asset/assetStore';
import carteira from '@/api/services/carteira';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const carteiraStoreInstance = carteiraStore();
const assetStoreInstance = assetStore();

const exportLoading = ref(false);
const loading = ref(true);
const carteiraData = ref(null);
const addAssetDialogVisible = ref(false);
const addingAsset = ref(false);
const assetsTable = ref(null);

// Chart type selector
const selectedChartType = ref({ label: 'Dispersão', value: 'scatter' });
const chartTypes = [
  { label: 'Dispersão', value: 'scatter' },
  { label: 'Radar', value: 'radar' }
];

const newAsset = ref({
  ticker: '',
  intervalo: '5d',
  period: '1y'
});

const intervalOptions = [
  { label: '1 dia', value: '1d' },
  { label: '5 dias', value: '5d' },
  { label: '1 semana', value: '1wk' },
  { label: '1 mês', value: '1mo' }
];

const periodOptions = [
  { label: '1 mês', value: '1mo' },
  { label: '3 meses', value: '3mo' },
  { label: '6 meses', value: '6mo' },
  { label: '1 ano', value: '1y' },
  { label: '2 anos', value: '2y' },
  { label: '5 anos', value: '5y' }
];

// Computed Properties
const hasAtivos = computed(() => {
  return carteiraData.value && carteiraData.value.ativos_ordenados && carteiraData.value.ativos_ordenados.length > 0;
});

const retornoClass = computed(() => {
  const retorno = carteiraData.value?.indicadores_carteira?.retorno_esperado || 0;
  return retorno >= 0 ? 'text-green-600' : 'text-red-600';
});

const retornoTextClass = computed(() => {
  const retorno = carteiraData.value?.indicadores_carteira?.retorno_esperado || 0;
  return retorno >= 0 ? 'text-green-600' : 'text-red-600';
});

const sharpeClass = computed(() => {
  const sharpe = carteiraData.value?.indicadores_carteira?.indice_sharpe || 0;
  if (sharpe > 1) return 'text-green-600';
  if (sharpe > 0) return 'text-yellow-600';
  return 'text-red-600';
});

const ativosDetalhados = computed(() => {
  if (!carteiraData.value) return [];
  
  return carteiraData.value.ativos_ordenados.map(ticker => ({
    ticker,
    beta: carteiraData.value.beta[ticker],
    retorno: carteiraData.value.retorno_esperado[ticker],
    risco: carteiraData.value.desvio_padrao[ticker],
    peso: carteiraData.value.pesos[ticker],
    sharpe: carteiraData.value.indice_sharpe[ticker],
    desempenho: carteiraData.value.indice_desempenho[ticker]
  }));
});

const scatterChartData = computed(() => {
  if (!carteiraData.value) return { datasets: [] };
  
  const datasets = carteiraData.value.ativos_ordenados.map((ticker, index) => ({
    label: formatTicker(ticker),
    data: [{
      x: carteiraData.value.desvio_padrao[ticker] * 100,
      y: carteiraData.value.retorno_esperado[ticker] * 100
    }],
    backgroundColor: ticker === 'BOVA11.SA' ? '#FCD34D' : `hsl(${index * 137.5 % 360}, 70%, 60%)`,
    borderColor: ticker === 'BOVA11.SA' ? '#F59E0B' : `hsl(${index * 137.5 % 360}, 70%, 50%)`,
    borderWidth: 2,
    pointRadius: 8,
    pointHoverRadius: 10
  }));
  
  return { datasets };
});

const scatterChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: Risco ${context.parsed.x.toFixed(2)}%, Retorno ${context.parsed.y.toFixed(2)}%`;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Risco (Desvio Padrão %)'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Retorno Esperado (%)'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
};

const radarChartData = computed(() => {
  if (!carteiraData.value) return { labels: [], datasets: [] };
  
  const labels = carteiraData.value.ativos_ordenados.map(ticker => formatTicker(ticker));
  
  const datasets = [
    {
      label: 'Retorno Esperado (%)',
      data: carteiraData.value.ativos_ordenados.map(ticker => 
        carteiraData.value.retorno_esperado[ticker] * 100
      ),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2
    },
    {
      label: 'Índice Sharpe',
      data: carteiraData.value.ativos_ordenados.map(ticker => 
        carteiraData.value.indice_sharpe[ticker]
      ),
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 2
    }
  ];
  
  return { labels, datasets };
});

const radarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  },
  scales: {
    r: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    }
  }
};

// Methods
const loadCarteiraData = async () => {
  loading.value = true;
  try {
    const carteiraId = route.params.id;
    const response = await carteiraStoreInstance.getIndicadoresCarteira(carteiraId);
    console.log("response", response.value)
    carteiraData.value = response.indicadores;
  } catch (error) {
    console.error('Erro ao carregar dados da carteira:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'O Bova11.SA não foi encontrado na sua carteira ou não possui dados disponíveis.',
      life: 3000
    });
    response.value = null;
  } finally {
    loading.value = false;
  }
};

const showAddAssetDialog = () => {
  newAsset.value = {
    ticker: '',
    intervalo: '5d',
    period: '1y'
  };
  addAssetDialogVisible.value = true;
};

const hideAddAssetDialog = () => {
  addAssetDialogVisible.value = false;
};

const addAsset = async () => {
  if (!newAsset.value.ticker) return;
  
  addingAsset.value = true;
  try {
    const payload = {
      ticker: newAsset.value.ticker.toUpperCase(),
      intervalo: newAsset.value.intervalo,
      period: newAsset.value.period,
      carteira_id: parseInt(route.params.id)
    };
    
    await assetStoreInstance.createAsset(payload);
    
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Ativo ${newAsset.value.ticker} adicionado com sucesso!`,
      life: 3000
    });
    
    hideAddAssetDialog();
    await loadCarteiraData(); // Recarrega os dados
  } catch (error) {
    console.error('Erro ao adicionar ativo:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: response?.message || 'Não foi possível adicionar o ativo',
      life: 3000
    });
  } finally {
    addingAsset.value = false;
  }
};

const exportData = async (carteiraId) => {
  // Adiciona estado de loading para o botão de exportar
  const exportLoading = ref(false);
  exportLoading.value = true;
  
  try {
    // Mostra toast de início da exportação
    toast.add({
      severity: 'info',
      summary: 'Exportando...',
      detail: 'Preparando arquivo para download...',
      life: 2000
    });
    
    const result = await carteiraStoreInstance.exportarCarteira(carteiraId);
    
    // Sucesso
    toast.add({
      severity: 'success',
      summary: 'Exportação Concluída',
      detail: `Arquivo ${result.filename} baixado com sucesso!`,
      life: 4000
    });
    
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    
    // Mostra erro específico
    toast.add({
      severity: 'error',
      summary: 'Erro na Exportação',
      detail: error.message || 'Não foi possível exportar os dados',
      life: 6000
    });
  } finally {
    exportLoading.value = false;
  }
};

// Função para scrollar até a tabela de ativos
const scrollToAssetsTable = () => {
  if (assetsTable.value) {
    assetsTable.value.scrollIntoView({ behavior: 'smooth' });
  }
};

// Utility Functions
const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`;
};

const formatNumber = (value, decimals = 4) => {
  return value.toFixed(decimals);
};

const formatTicker = (ticker) => {
  return ticker.replace('.SA', '');
};

const getSharpeRating = (sharpe) => {
  if (sharpe > 2) return 'Excelente';
  if (sharpe > 1) return 'Bom';
  if (sharpe > 0) return 'Regular';
  return 'Ruim';
};

const getSharpeColorClass = (sharpe) => {
  if (sharpe > 1) return 'text-green-600';
  if (sharpe > 0) return 'text-yellow-600';
  return 'text-red-600';
};

const getBetaInterpretation = (beta) => {
  if (beta > 1.2) return 'Alto';
  if (beta > 0.8) return 'Médio';
  return 'Baixo';
};

const getReturnColorClass = (value) => {
  return value >= 0 ? 'text-green-600' : 'text-red-600';
};

const getCovarianceColor = (value) => {
  const intensity = Math.abs(value * 10000);
  if (intensity > 10) return 'bg-red-100 text-red-800';
  if (intensity > 5) return 'bg-orange-100 text-orange-800';
  if (intensity > 1) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

// Lifecycle
onMounted(() => {
  loadCarteiraData();
});
</script>

<style scoped>
/* DataTable Customization */
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

/* Chart Styling */
:deep(.p-chart) {
  position: relative;
}

/* Smooth transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
