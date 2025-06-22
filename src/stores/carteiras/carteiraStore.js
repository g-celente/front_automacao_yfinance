import { defineStore } from "pinia";
import { useToast } from 'primevue/usetoast';
import api from "@/api/main.js";

export const carteiraStore = defineStore("carteira", () => {
    const toast = useToast();    async function getCarteiras() {
        try {
            const response = await api.carteira.getCarteiras();
            console.log('Carteiras:', response.data);
            return response.data.portfolios;
        } catch (e) {
            console.error('Erro ao buscar carteiras:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao carregar carteiras',
                life: 3000
            });
            throw e;
        }
    }    async function createCarteira(carteiraData) {
        try {
            const response = await api.carteira.createCarteira(carteiraData);
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Carteira criada com sucesso',
                life: 3000
            });
            return response.data;
        } catch (e) {
            console.error('Erro ao criar carteira:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao criar carteira',
                life: 3000
            });
            throw e;
        }
    }    async function updateCarteira(carteiraId, carteiraData) {
        try {
            const response = await api.carteira.updateCarteira(carteiraId, carteiraData);
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Carteira atualizada com sucesso',
                life: 3000
            });
            return response.data;
        } catch (e) {
            console.error('Erro ao atualizar carteira:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao atualizar carteira',
                life: 3000
            });
            throw e;
        }
    }    async function deleteCarteira(carteiraId) {
        try {
            const response = await api.carteira.deleteCarteira(carteiraId);
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Carteira deletada com sucesso',
                life: 3000
            });
            return response.data;
        } catch (e) {
            console.error('Erro ao deletar carteira:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao deletar carteira',
                life: 3000
            });
            throw e;
        }
    }    async function getCarteiraById(carteiraId) {
        try {
            const response = await api.carteira.getCarteiraById(carteiraId);
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Carteira carregada com sucesso',
                life: 3000
            });
            return response.data.carteira;
        } catch (e) {
            console.error('Erro ao buscar carteira por ID:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao carregar carteira',
                life: 3000
            });
            throw e;
        }
    }    async function getIndicadoresCarteira(carteiraId) {
        try {
            const response = await api.carteira.getIndicadoresCarteira(carteiraId);
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Indicadores carregados com sucesso',
                life: 3000
            });
            return response.data;
        } catch (e) {
            console.error('Erro ao buscar indicadores da carteira:', e);
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: e.response?.data?.message || e.message || 'Erro ao carregar indicadores',
                life: 3000
            });
            throw e;
        }
    }

    /**
     * Exporta uma carteira em formato XLSX
     * @param {number} carteiraId - ID da carteira a ser exportada
     * @returns {Promise<void>}
     */
    async function exportarCarteira(carteiraId) {
        try {
            console.log(`Iniciando exportação da carteira ${carteiraId}`);

            // Faz a requisição para o backend
            const response = await api.carteira.exportarCarteira(carteiraId);

            // Verifica se a resposta é um blob (arquivo)
            if (!(response.data instanceof Blob)) {
                throw new Error('Resposta não é um arquivo válido');
            }

            // Obtém o nome do arquivo do header Content-Disposition ou cria um padrão
            let filename = `carteira_${carteiraId}_report.xlsx`;

            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                // Extrai o filename do header Content-Disposition
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            // Cria uma URL temporária para o blob
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);

            // Cria um elemento <a> temporário para trigger do download
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.download = filename;

            // Adiciona ao DOM, clica e remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Limpa a URL temporária da memória
            window.URL.revokeObjectURL(url);            console.log(`Carteira ${carteiraId} exportada com sucesso: ${filename}`);

            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Carteira exportada com sucesso! Arquivo: ${filename}`,
                life: 3000
            });

            return {
                success: true,
                message: 'Carteira exportada com sucesso!',
                filename: filename
            };

        } catch (error) {
            console.error('Erro ao exportar carteira:', error);

            // Tratamento de erros específicos
            let errorMessage = 'Erro interno do servidor';

            if (error.response) {
                // Erro da resposta HTTP
                if (error.response.status === 400) {
                    errorMessage = 'O ativo BOVA11.SA não está presente na carteira. Por favor, insira o BOVA11.SA para poder exportar.';
                } else if (error.response.status === 404) {
                    errorMessage = 'Carteira não encontrada ou não autorizada';
                } else if (error.response.status === 429) {
                    errorMessage = 'Muitas tentativas de exportação. Tente novamente em alguns minutos.';
                } else if (error.response.data instanceof Blob) {
                    // Se o erro veio como blob, tenta converter para JSON
                    try {
                        const errorText = await error.response.data.text();
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.message || errorMessage;
                    } catch {
                        // Se não conseguir parsear, usa mensagem padrão
                    }
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                // Erro de rede/conexão
                errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
            } else if (error.message) {
                // Outros erros                errorMessage = error.message;
            }

            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: errorMessage,
                life: 3000
            });

            throw new Error(errorMessage);
        }
    }

    return {
        getCarteiras,
        createCarteira,
        updateCarteira,
        deleteCarteira,
        getCarteiraById,
        getIndicadoresCarteira,
        exportarCarteira
    };
});