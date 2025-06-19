<template>
  <div class="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
    <!-- Header com busca -->
    <div class="max-w-full mx-auto">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          <i class="pi pi-chart-line text-indigo-600 mr-2 sm:mr-3"></i>
          Análise de Ativos
        </h1>
        <p class="text-sm sm:text-base text-gray-600">Pesquise e analise o desempenho histórico de ativos</p>
      </div>

      <!-- Formulário de busca -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <!-- Campo do ativo -->
          <div class="space-y-2 lg:col-span-1">
            <label class="text-xs sm:text-sm font-semibold text-gray-700">Nome do Ativo</label>
            <div class="relative">
              <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              <InputText 
                v-model="searchQuery.asset_name"
                placeholder="Ex: PETR4, VALE3..."
                class="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                @keypress.enter="handleSearch"
              />
            </div>
          </div>

          <!-- Seletor de período -->
          <div class="space-y-2 lg:col-span-1">
            <label class="text-xs sm:text-sm font-semibold text-gray-700">Período de Análise</label>
            <Dropdown 
              v-model="selectedPeriod"
              :options="periods"
              optionLabel="label"
              placeholder="Selecione o período"
              class="w-full text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Botão de buscar -->
          <div class="space-y-2 sm:col-span-2 lg:col-span-1">
            <label class="text-xs sm:text-sm font-semibold text-gray-700 hidden lg:block">&nbsp;</label>
            <Button 
              @click="handleSearch"
              :loading="loading"
              :disabled="!searchQuery.asset_name"
              class="w-full py-2 sm:py-3 px-4 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="pi pi-search mr-2"></i>
              {{ loading ? 'Buscando...' : 'Buscar Ativo' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Resultados da busca -->
      <div v-if="hasSearched && !loading" class="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
        
        <!-- Cards de métricas aprimorados -->
        <div v-if="searchResults" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          
          <!-- Card de Retorno -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <div class="p-2 bg-green-100 rounded-lg mr-3">
                    <i class="pi pi-trending-up text-green-600 text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-gray-600">Retorno Total</p>
                    <p class="text-lg sm:text-2xl font-bold text-green-600">
                      {{searchResults.results.retorno}}
                    </p>
                  </div>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Período:</span>
                    <span class="font-medium">{{ selectedPeriod.label }}</span>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Tipo:</span>
                    <span class="font-medium">Acumulado</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: Math.min(Math.abs(searchResults.results.retorno * 100), 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Card de Sharpe Ratio -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <div class="p-2 bg-blue-100 rounded-lg mr-3">
                    <i class="pi pi-chart-bar text-blue-600 text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-gray-600">Índice Sharpe</p>
                    <p class="text-lg sm:text-2xl font-bold text-blue-600">
                      {{ formatNumber(searchResults.results.sharpe) }}
                    </p>
                  </div>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Classificação:</span>
                    <span class="font-medium" :class="getSharpeClass(searchResults.results.sharpe)">
                      {{ getSharpeRating(searchResults.results.sharpe) }}
                    </span>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Risco/Retorno:</span>
                    <span class="font-medium">Ajustado</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: Math.min(Math.max(searchResults.results.sharpe * 50, 0), 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Card de Volatilidade -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <div class="p-2 bg-orange-100 rounded-lg mr-3">
                    <i class="pi pi-exclamation-triangle text-orange-600 text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-gray-600">Volatilidade</p>
                    <p class="text-lg sm:text-2xl font-bold text-orange-600">
                      {{searchResults.results.volatilidadeAnual}}
                    </p>
                  </div>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Nível:</span>
                    <span class="font-medium" :class="getVolatilityClass(searchResults.results.volatilidadeAnual)">
                      {{ getVolatilityLevel(searchResults.results.volatilidadeAnual) }}
                    </span>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Base:</span>
                    <span class="font-medium">Anualizada</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: Math.min(searchResults.results.volatilidadeAnual, 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Card de Desvio Padrão -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <div class="p-2 bg-purple-100 rounded-lg mr-3">
                    <i class="pi pi-calculator text-purple-600 text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-gray-600">Desvio Padrão</p>
                    <p class="text-lg sm:text-2xl font-bold text-purple-600">
                      {{ formatNumber(searchResults.results.desvio) }}
                    </p>
                  </div>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Dispersão:</span>
                    <span class="font-medium">{{ getDispersionLevel(searchResults.results.desvio) }}</span>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Período:</span>
                    <span class="font-medium">{{ selectedPeriod.label }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: Math.min(searchResults.results.desvio * 20, 100) + '%' }"
              ></div>
            </div>
          </div>

        </div>

        <!-- Gráfico de histórico responsivo -->
        <div v-if="chartData.labels.length > 0" class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 max-w-full overflow-hidden">
          <div class="mb-4 sm:mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                Histórico de Preços - {{ searchQuery.asset_name.toUpperCase() }}
              </h3>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ chartData.labels.length }} pontos
                </span>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ selectedPeriod.label }}
                </span>
              </div>
            </div>
            <p class="text-xs sm:text-sm text-gray-600">
              Evolução dos preços de fechamento no período selecionado
            </p>
          </div>
          
          <div class="h-64 sm:h-80 lg:h-96 w-full">
            <Chart 
              type="line" 
              :data="chartData" 
              :options="chartOptions"
              class="w-full h-full"
            />
          </div>

          <!-- Estatísticas do gráfico -->
          <div class="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
            <div class="text-center">
              <p class="text-xs text-gray-500">Máximo</p>
              <p class="text-sm sm:text-base font-semibold text-green-600">
                R$ {{ getMaxPrice().toFixed(2) }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500">Mínimo</p>
              <p class="text-sm sm:text-base font-semibold text-red-600">
                R$ {{ getMinPrice().toFixed(2) }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500">Médio</p>
              <p class="text-sm sm:text-base font-semibold text-blue-600">
                R$ {{ getAvgPrice().toFixed(2) }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500">Atual</p>
              <p class="text-sm sm:text-base font-semibold text-gray-800">
                R$ {{ getCurrentPrice().toFixed(2) }}
              </p>
            </div>          </div>
        </div>

        <!-- Tabela de histórico de preços -->
        <div v-if="searchResults" class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 max-w-full overflow-hidden">
          <div class="mb-4 sm:mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                Histórico Detalhado - {{ searchQuery.asset_name.toUpperCase() }}
              </h3>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ searchResults.historico.length }} registros
                </span>
              </div>
            </div>
            <p class="text-xs sm:text-sm text-gray-600">
              Dados completos de abertura, fechamento, máxima, mínima e volume
            </p>
          </div>
          
          <!-- Container responsivo para tabela -->
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Abertura
                  </th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Máxima
                  </th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mínima
                  </th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechamento
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(item, index) in searchResults.historico" 
                  :key="index"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                    {{ item.data }}
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                    R$ {{ item.open }}
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-green-600 font-medium">
                    R$ {{ item.high }}
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-red-600 font-medium">
                    R$ {{ item.low }}
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-semibold">
                    R$ {{ item.close }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginação/Informações da tabela -->
          <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-600">
            <div class="mb-2 sm:mb-0">
              Mostrando {{ searchResults.historico.length }} registros do período {{ selectedPeriod.label.toLowerCase() }}
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Máxima</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Mínima</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensagem se não houver dados -->
        <div v-else-if="hasSearched && !loading" class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center max-w-full">
          <div class="mb-4">
            <i class="pi pi-info-circle text-4xl sm:text-6xl text-gray-400"></i>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Nenhum dado encontrado</h3>
          <p class="text-sm sm:text-base text-gray-500">Tente buscar por outro ativo ou período diferente.</p>
        </div>

      </div>

      <!-- Estado de loading -->
      <div v-if="loading" class="flex items-center justify-center py-8 sm:py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p class="text-sm sm:text-base text-gray-600">Buscando dados do ativo...</p>
        </div>
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
import { assetStore } from '@/stores/asset/assetStore';

const assetStoreInstance = assetStore();

const searchQuery = ref({
  asset_name: '',
});

const selectedPeriod = ref({ label: '30 dias', value: 30 });
const loading = ref(false);
const hasSearched = ref(false);
const searchResults = ref(null);

const periods = [
  { label: 'Últimos 30 dias', value: '1mo' },
  { label: '3 meses', value: '3mo' },
  { label: '6 meses', value: '6mo' },
  { label: '1 ano', value: '1y' },
  { label: '5 anos', value: '5y' },
  { label: 'YTD (Ano Atual)', value: 'ytd' },
  { label: 'Max (Máximo)', value: 'max' }
];

// Processa os dados do histórico para o gráfico
const chartData = computed(() => {
  if (!searchResults.value || !searchResults.value.historico) {
    return { labels: [], datasets: [] };
  }

  const historico = searchResults.value.historico;
  
  // Extrai as datas e preços
  const labels = historico.map(item => {
    const date = new Date(item.data);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  });

  const prices = historico.map(item => item.close);

  return {
    labels,
    datasets: [
      {
        label: `${searchQuery.value.asset_name.toUpperCase()} - Preço de Fechamento`,
        data: prices,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: window.innerWidth < 640 ? 10 : 12,
          weight: '500'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#374151',
      bodyColor: '#374151',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context) {
          return `R$ ${context.parsed.y.toFixed(2)}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxTicksLimit: window.innerWidth < 640 ? 6 : 10,
        font: {
          size: window.innerWidth < 640 ? 9 : 11
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(229, 231, 235, 0.8)'
      },
      ticks: {
        callback: function(value) {
          return `R$ ${value.toFixed(2)}`;
        },
        font: {
          size: window.innerWidth < 640 ? 9 : 11
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
};

// Função para buscar dados
const handleSearch = async () => {
  if (!searchQuery.value.asset_name) {
    return;
  }

  loading.value = true;
  hasSearched.value = true;

  try {
    const searchData = {
      asset_name: searchQuery.value.asset_name,
      periodo: selectedPeriod.value.value
    };
    
    const result = await assetStoreInstance.searchAsset(searchData);

    searchResults.value = result;

  } catch (error) {
    console.error('Erro na busca:', error);
    searchResults.value = null;
  } finally {
    loading.value = false;
  }
};

// Funções auxiliares para formatação
const formatNumber = (value) => {
  return value.toFixed(4);
};

// Funções para classificações nos cards
const getSharpeRating = (sharpe) => {
  if (sharpe > 2) return 'Excelente';
  if (sharpe > 1) return 'Bom';
  if (sharpe > 0) return 'Regular';
  return 'Ruim';
};

const getSharpeClass = (sharpe) => {
  if (sharpe > 2) return 'text-green-600';
  if (sharpe > 1) return 'text-blue-600';
  if (sharpe > 0) return 'text-yellow-600';
  return 'text-red-600';
};

const getVolatilityLevel = (volatility) => {
  if (volatility > 50) return 'Alta';
  if (volatility > 25) return 'Média';
  return 'Baixa';
};

const getVolatilityClass = (volatility) => {
  if (volatility > 50) return 'text-red-600';
  if (volatility > 25) return 'text-yellow-600';
  return 'text-green-600';
};

const getDispersionLevel = (desvio) => {
  if (desvio > 5) return 'Alta';
  if (desvio > 2) return 'Média';
  return 'Baixa';
};

// Funções para estatísticas do gráfico
const getMaxPrice = () => {
  if (!searchResults.value?.historico) return 0;
  return Math.max(...searchResults.value.historico.map(item => item.close));
};

const getMinPrice = () => {
  if (!searchResults.value?.historico) return 0;
  return Math.min(...searchResults.value.historico.map(item => item.close));
};

const getAvgPrice = () => {
  if (!searchResults.value?.historico) return 0;
  const prices = searchResults.value.historico.map(item => item.close);
  return prices.reduce((a, b) => a + b, 0) / prices.length;
};

const getCurrentPrice = () => {
  if (!searchResults.value?.historico) return 0;
  const historico = searchResults.value.historico;
  return historico[historico.length - 1].close;
};

// Funções auxiliares para formatação da tabela
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatPrice = (price) => {
  return price.toFixed(2);
};

const formatVolume = (volume) => {
  if (volume >= 1000000000) {
    return (volume / 1000000000).toFixed(1) + 'B';
  } else if (volume >= 1000000) {
    return (volume / 1000000).toFixed(1) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'K';
  }
  return volume.toString();
};
</script>

<style scoped>
:deep(.p-dropdown) {
  border-radius: 0.5rem;
}

@media (min-width: 640px) {
  :deep(.p-dropdown) {
    border-radius: 0.75rem;
  }
}

:deep(.p-dropdown-panel) {
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

:deep(.p-button) {
  border-radius: 0.5rem;
}

@media (min-width: 640px) {
  :deep(.p-button) {
    border-radius: 0.75rem;
  }
}

/* Garantir que o gráfico não ultrapasse os limites */
:deep(.p-chart) {
  max-width: 100%;
  overflow: hidden;
}

/* Estilos para a tabela responsiva */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Garantir que a tabela não quebre o layout */
table {
  table-layout: auto;
  width: 100%;
  min-width: 600px; /* Largura mínima para manter legibilidade */
}

/* Responsividade adicional para células da tabela */
@media (max-width: 640px) {
  table {
    min-width: 500px;
  }
  
  th, td {
    padding: 0.5rem !important;
    font-size: 0.75rem !important;
  }
}
</style>