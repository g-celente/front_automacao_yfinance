<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <!-- Header -->
        <header class="fixed top-0 w-full z-50 transition-all duration-300"
            :class="scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'">
            <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <div
                        class="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp class="w-5 h-5 text-white" />
                    </div>
                    <span class="text-xl font-bold text-slate-800">SmartWallet</span>
                </div>

                <div class="hidden md:flex items-center space-x-8">
                    <a href="#produto" class="text-slate-600 hover:text-purple-600 transition-colors">Produto</a>
                    <a href="#demo" class="text-slate-600 hover:text-purple-600 transition-colors">Demonstração</a>
                    <a href="#faq" class="text-slate-600 hover:text-purple-600 transition-colors">FAQ</a>
                    <router-link :to="{ path: '/register' }" custom v-slot="{ navigate }">
                        <button @click="navigate"
                            class="w-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg">
                            Comece Grátis
                        </button>
                    </router-link>
                    <router-link :to="{ path: '/login' }" custom v-slot="{ navigate }">
                        <button @click="navigate"
                            class="w-70 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg">
                            Faça Login
                        </button>
                    </router-link>
                </div>

                <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
                    <Menu class="w-6 h-6 text-slate-600" />
                </button>
            </nav>

            <!-- Mobile Menu -->
            <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
                <div class="container mx-auto px-4 py-4 space-y-4">
                    <a href="#produto" class="block text-slate-600">Produto</a>
                    <a href="#demo" class="block text-slate-600">Demonstração</a>
                    <a href="#faq" class="block text-slate-600">FAQ</a>
                    <router-link :to="{ path: '/register' }" custom v-slot="{ navigate }">
                        <button @click="navigate"
                            class="w-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg">
                            Comece Grátis
                        </button>
                    </router-link>
                    <router-link :to="{ path: '/login' }" custom v-slot="{ navigate }">
                        <button @click="navigate"
                            class="w-70 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg">
                            Faça Login
                        </button>
                    </router-link>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="pt-32 pb-20 px-4">
            <div class="container mx-auto text-center">
                <div v-motion :initial="{ opacity: 0, y: 50 }"
                    :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }" class="max-w-4xl mx-auto">
                    <h1 class="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
                        Analise sua carteira
                        <span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            com confiança
                        </span>
                    </h1>

                    <p class="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Transforme dados do mercado em decisões inteligentes com sua carteira.
                        Calcule indicadores estatísticos, monitore performance e otimize resultados.
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <router-link :to="{ path: '/register' }" custom v-slot="{ navigate }">
                            <button @click="navigate"
                                class="w-70 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg">
                                Comece Grátis
                            </button>
                        </router-link>
                        <button
                            class="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-all duration-300">
                            Ver Demonstração
                        </button>
                    </div>

                    <div class="text-sm text-slate-500 flex items-center justify-center gap-2">
                        <Shield class="w-4 h-4" />
                        <span>Dados seguros • Sem compromisso • Configuração em 2 minutos</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Produto Section -->
        <section id="produto" class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                        Indicadores que <span class="text-purple-600">importam</span>
                    </h2>
                    <p class="text-xl text-slate-600 max-w-3xl mx-auto">
                        Utilize dados do yfinance para calcular métricas essenciais e tomar decisões baseadas em
                        evidências
                    </p>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div v-for="(feature, index) in features" :key="index" v-motion :initial="{ opacity: 0, y: 30 }"
                        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 100 } }"
                        class="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <component :is="feature.icon" class="w-6 h-6 text-white" />
                        </div>
                        <h3 class="text-xl font-semibold text-slate-800 mb-3">{{ feature.title }}</h3>
                        <p class="text-slate-600">{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Demo Section -->
        <section id="demo" class="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                        Veja sua carteira em <span class="text-purple-600">ação</span>
                    </h2>
                    <p class="text-xl text-slate-600 max-w-3xl mx-auto">
                        Interface intuitiva com dados em tempo real da bolsa brasileira
                    </p>
                </div>

                <div v-motion :initial="{ opacity: 0, scale: 0.9 }"
                    :visible-once="{ opacity: 1, scale: 1, transition: { duration: 800 } }"
                    class="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto">
                    <div class="mb-6">
                        <h3 class="text-2xl font-bold text-slate-800 mb-2">Carteira - João Silva</h3>
                        <div class="flex items-center gap-4 text-sm text-slate-600">
                            <span>Última atualização: há 5 min</span>
                            <span class="flex items-center gap-1">
                                <TrendingUp class="w-4 h-4 text-green-500" />
                                +12.5% no mês
                            </span>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-4 gap-6 mb-8">
                        <div class="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                            <div class="text-sm text-green-600 mb-1">Retorno Esperado</div>
                            <div class="text-2xl font-bold text-green-700">15.2%</div>
                        </div>
                        <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                            <div class="text-sm text-blue-600 mb-1">Desvio Padrão</div>
                            <div class="text-2xl font-bold text-blue-700">8.4%</div>
                        </div>
                        <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                            <div class="text-sm text-purple-600 mb-1">Índice Sharpe</div>
                            <div class="text-2xl font-bold text-purple-700">1.81</div>
                        </div>
                        <div class="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                            <div class="text-sm text-orange-600 mb-1">Beta</div>
                            <div class="text-2xl font-bold text-orange-700">0.92</div>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-slate-200">
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Ativo</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Peso</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Preço</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Variação</th>
                                    <th class="text-left py-3 px-4 font-semibold text-slate-700">Beta</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stock in portfolioData" :key="stock.symbol"
                                    class="border-b border-slate-100 hover:bg-slate-50">
                                    <td class="py-3 px-4">
                                        <div class="font-semibold text-slate-800">{{ stock.symbol }}</div>
                                        <div class="text-sm text-slate-600">{{ stock.name }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-slate-700">{{ stock.weight }}%</td>
                                    <td class="py-3 px-4 text-slate-700">R$ {{ stock.price }}</td>
                                    <td class="py-3 px-4">
                                        <span :class="stock.change >= 0 ? 'text-green-600' : 'text-red-600'"
                                            class="font-semibold">
                                            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change }}%
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-slate-700">{{ stock.beta }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                        Assessores <span class="text-purple-600">confiam</span> em nós
                    </h2>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div v-for="(testimonial, index) in testimonials" :key="index" v-motion
                        :initial="{ opacity: 0, y: 30 }"
                        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 200 } }"
                        class="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-200">
                        <div class="flex items-center mb-4">
                            <div v-for="i in 5" :key="i" class="text-yellow-400">
                                <Star class="w-5 h-5 fill-current" />
                            </div>
                        </div>
                        <p class="text-slate-600 mb-6 italic">"{{ testimonial.text }}"</p>
                        <div class="flex items-center">
                            <div
                                class="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                {{ testimonial.name.charAt(0) }}
                            </div>
                            <div>
                                <div class="font-semibold text-slate-800">{{ testimonial.name }}</div>
                                <div class="text-sm text-slate-600">{{ testimonial.role }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section id="faq" class="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                        Perguntas <span class="text-purple-600">frequentes</span>
                    </h2>
                </div>

                <div class="max-w-3xl mx-auto">
                    <div v-for="(faq, index) in faqs" :key="index" class="mb-4">
                        <button @click="toggleFaq(index)"
                            class="w-full bg-white p-6 rounded-xl border border-slate-200 text-left hover:shadow-md transition-all duration-300 flex items-center justify-between">
                            <span class="font-semibold text-slate-800">{{ faq.question }}</span>
                            <ChevronDown class="w-5 h-5 text-slate-600 transition-transform duration-300"
                                :class="{ 'rotate-180': faq.open }" />
                        </button>
                        <div v-if="faq.open" v-motion :initial="{ opacity: 0, height: 0 }"
                            :enter="{ opacity: 1, height: 'auto', transition: { duration: 300 } }"
                            class="bg-white px-6 pb-6 rounded-b-xl border-x border-b border-slate-200 -mt-1">
                            <p class="text-slate-600">{{ faq.answer }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-slate-800 text-white py-16">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div class="flex items-center space-x-2 mb-4">
                            <div
                                class="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <TrendingUp class="w-5 h-5 text-white" />
                            </div>
                            <span class="text-xl font-bold">SmartWallet</span>
                        </div>
                        <p class="text-slate-400">
                            Análise inteligente de carteiras para assessores de investimento.
                        </p>
                    </div>

                    <div>
                        <h3 class="font-semibold mb-4">Produto</h3>
                        <ul class="space-y-2 text-slate-400">
                            <li><a href="#" class="hover:text-white transition-colors">Funcionalidades</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Preços</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">API</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="font-semibold mb-4">Suporte</h3>
                        <ul class="space-y-2 text-slate-400">
                            <li><a href="#" class="hover:text-white transition-colors">Documentação</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Contato</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Status</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="font-semibold mb-4">Legal</h3>
                        <ul class="space-y-2 text-slate-400">
                            <li><a href="#" class="hover:text-white transition-colors">Termos de Uso</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Privacidade</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Cookies</a></li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p class="text-slate-400 mb-4 md:mb-0">
                        © 2024 SmartWallet. Todos os direitos reservados.
                    </p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-slate-400 hover:text-white transition-colors">
                            <Twitter class="w-5 h-5" />
                        </a>
                        <a href="#" class="text-slate-400 hover:text-white transition-colors">
                            <Linkedin class="w-5 h-5" />
                        </a>
                        <a href="#" class="text-slate-400 hover:text-white transition-colors">
                            <Github class="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false"></div>
            <div v-motion :initial="{ opacity: 0, scale: 0.9 }"
                :enter="{ opacity: 1, scale: 1, transition: { duration: 300 } }"
                class="bg-white rounded-2xl p-8 max-w-md w-full relative z-10">
                <button @click="showModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X class="w-6 h-6" />
                </button>

                <div class="text-center mb-6">
                    <div
                        class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp class="w-8 h-8 text-white" />
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800 mb-2">Comece grátis hoje</h3>
                    <p class="text-slate-600">Cadastre-se e receba acesso antecipado</p>
                </div>

                <form @submit.prevent="submitForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Nome completo</label>
                        <input v-model="form.name" type="text" required
                            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                            placeholder="Seu nome">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Email profissional</label>
                        <input v-model="form.email" type="email" required
                            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                            placeholder="seu@email.com">
                    </div>
                    <button type="submit" :disabled="loading"
                        class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                        {{ loading ? 'Enviando...' : 'Cadastrar Grátis' }}
                    </button>
                </form>

                <p class="text-xs text-slate-500 text-center mt-4">
                    Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
    TrendingUp,
    Menu,
    Shield,
    BarChart3,
    Target,
    FileText,
    Zap,
    Star,
    ChevronDown,
    X,
    Twitter,
    Linkedin,
    Github
} from 'lucide-vue-next'

// Reactive data
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const showModal = ref(false)
const loading = ref(false)
const form = ref({
    name: '',
    email: ''
})

const features = ref([
    {
        icon: BarChart3,
        title: 'Indicadores Estatísticos',
        description: 'Retorno esperado, desvio padrão, Sharpe e Beta calculados automaticamente'
    },
    {
        icon: Target,
        title: 'Performance Tracking',
        description: 'Acompanhe o desempenho da carteira em tempo real com dados do yfinance'
    },
    {
        icon: FileText,
        title: 'Relatórios Detalhados',
        description: 'Exporte análises completas para apresentar aos seus clientes'
    },
    {
        icon: Zap,
        title: 'Automação Inteligente',
        description: 'Alertas automáticos e rebalanceamento sugerido da carteira'
    }
])

const portfolioData = ref([
    { symbol: 'PETR4', name: 'Petrobras PN', weight: 25, price: '32.45', change: 2.1, beta: 1.2 },
    { symbol: 'VALE3', name: 'Vale ON', weight: 20, price: '68.90', change: -0.8, beta: 1.1 },
    { symbol: 'ITUB4', name: 'Itaú Unibanco PN', weight: 15, price: '28.75', change: 1.5, beta: 0.9 },
    { symbol: 'BBDC4', name: 'Bradesco PN', weight: 12, price: '15.20', change: 0.3, beta: 0.8 },
    { symbol: 'WEGE3', name: 'WEG ON', weight: 10, price: '42.80', change: 3.2, beta: 0.7 }
])

const testimonials = ref([
    {
        name: 'Carlos Mendes',
        role: 'Assessor de Investimentos',
        text: 'Revolucionou minha forma de analisar carteiras. Os indicadores são precisos e a interface é intuitiva.'
    },
    {
        name: 'Ana Paula Silva',
        role: 'Gestora de Patrimônio',
        text: 'Economizo horas de trabalho toda semana. Os relatórios impressionam meus clientes.'
    },
    {
        name: 'Roberto Santos',
        role: 'Consultor Financeiro',
        text: 'A integração com dados reais da bolsa brasileira faz toda a diferença nas minhas análises.'
    }
])

const faqs = ref([
    {
        question: 'Como funciona a integração com o yfinance?',
        answer: 'Utilizamos a API do yfinance para obter dados em tempo real da bolsa brasileira, garantindo informações sempre atualizadas para seus cálculos.',
        open: false
    },
    {
        question: 'Quais indicadores são calculados automaticamente?',
        answer: 'Calculamos retorno esperado, desvio padrão, índice de Sharpe, Beta, correlações e diversos outros indicadores estatísticos essenciais.',
        open: false
    },
    {
        question: 'Posso exportar os relatórios?',
        answer: 'Sim! Você pode exportar relatórios completos em PDF, Excel ou compartilhar diretamente com seus clientes via link.',
        open: false
    },
    {
        question: 'Há limite de carteiras que posso analisar?',
        answer: 'No plano gratuito você pode analisar até 3 carteiras. Nos planos pagos não há limite de carteiras.',
        open: false
    }
])

// Methods
const handleScroll = () => {
    scrolled.value = window.scrollY > 50
}

const toggleFaq = (index) => {
    faqs.value[index].open = !faqs.value[index].open
}

const submitForm = async () => {
    loading.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    alert(`Obrigado, ${form.value.name}! Você receberá um email em breve.`)

    form.value.name = ''
    form.value.email = ''
    loading.value = false
    showModal.value = false
}

// Lifecycle
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
    font-family: 'Inter', sans-serif;
}

html {
    scroll-behavior: smooth;
}
</style>