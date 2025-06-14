<template>
  <div class="space-y-6">
    <!-- Cards de Métricas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(stat, index) in statistics"
        :key="index"
        class="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
      >
        <div class="flex justify-between items-start">
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ stat.value }}</h3>
            <div class="flex items-center space-x-1">
              <i
                :class="[
                  'pi',
                  stat.change >= 0 ? 'pi-arrow-up text-emerald-500' : 'pi-arrow-down text-red-500'
                ]"
              ></i>
              <span
                :class="[
                  'text-sm font-medium',
                  stat.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                ]"
              >
                {{ Math.abs(stat.change) }}%
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ stat.metric }}</p>
          </div>
          <div
            :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center',
              stat.iconBg
            ]"
          >
            <i :class="['pi', stat.icon, 'text-xl', stat.iconColor]"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos e Atividades -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Gráfico Principal -->
      <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            Performance Histórica
          </h3>
          <Dropdown
            v-model="selectedPeriod"
            :options="periods"
            optionLabel="label"
            class="w-40"
          />
        </div>
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[300px]" />
      </div>

      <!-- Lista de Atividades -->
      <div class="bg-white p-6 rounded-xl border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Atividades Recentes
        </h3>
        <div class="space-y-4">
          <div
            v-for="(activity, index) in activities"
            :key="index"
            class="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center',
                activity.iconBg
              ]"
            >
              <i :class="['pi', activity.icon, activity.iconColor]"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">
                {{ activity.title }}
              </p>
              <p class="text-sm text-gray-500">{{ activity.description }}</p>
              <span class="text-xs text-gray-400">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';
import Dropdown from 'primevue/dropdown';

const selectedPeriod = ref({ label: 'Últimos 30 dias', value: 30 });
const periods = [
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 30 dias', value: 30 },
  { label: 'YTD', value: 365 }
];

const statistics = [
  {
    label: 'Total em Ativos',
    value: 'R$ 2.45M',
    change: 12.5,
    icon: 'pi-dollar',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    metric: 'Sharpe Ratio: 1.8'
  },
  {
    label: 'Retorno Anual',
    value: '24.3%',
    change: 8.2,
    icon: 'pi-chart-line',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    metric: 'Volatilidade: 12%'
  },
  {
    label: 'Carteiras Ativas',
    value: '1,458',
    change: 15.8,
    icon: 'pi-wallet',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    metric: 'Drawdown: -5%'
  },
  {
    label: 'Volume 24h',
    value: 'R$ 845K',
    change: -2.4,
    icon: 'pi-sync',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    metric: 'Beta: 0.85'
  }
];

const chartData = ref({
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Retorno',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: '#4F46E5',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(79, 70, 229, 0.1)'
    },
    {
      label: 'Benchmark',
      data: [10, 15, 12, 20, 18, 25],
      borderColor: '#9333EA',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(147, 51, 234, 0.1)'
    }
  ]
});

const chartOptions = ref({
  plugins: {
    legend: {
      labels: {
        color: '#495057'
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        color: '#ebedef'
      }
    }
  }
});

const activities = [
  {
    title: 'Nova Carteira #A234',
    description: 'João Silva iniciou uma carteira de R$ 50K',
    time: '5 min atrás',
    icon: 'pi-wallet',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    title: 'Alerta de Risco',
    description: 'Carteira #B123 atingiu limite de drawdown',
    time: '1h atrás',
    icon: 'pi-exclamation-triangle',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    title: 'Rebalanceamento',
    description: 'Rebalanceamento automático executado',
    time: '2h atrás',
    icon: 'pi-sync',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  }
];
</script>
