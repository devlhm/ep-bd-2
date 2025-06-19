import { Client } from '../@types/Cliente';
import { Funcionario } from '../@types/Funcionario';
import { Produto } from '../@types/Produto';
import apiClient from '../Api/front/api'

export const Api = {
    login: async (cpf: string, senha: string) => {
        try {
            const response = await apiClient.post('/auth/login', {
                cpf,
                senha,
            })
                .then((res) => {
                    // Salvar o token no localStorage ou onde preferir
                    localStorage.setItem('authToken', res.data.token);
                    return res;
                });
            return response.data;
        } catch (error: any) {
            // Trate o erro aqui conforme sua necessidade
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    },
    fetchClients: async (): Promise<Client[]> => {
        try {
            const response = await apiClient.get('/clientes');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            throw error;
        }
    },
    fetchFuncionarios: async (): Promise<Funcionario[]> => {
        try {
            const response = await apiClient.get('/funcionarios');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            throw error;
        }
    },
    fetchProdutos: async (): Promise<Produto[]> => {
        try {
            const response = await apiClient.get('/produtos');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    },
    fetchVendas: async (): Promise<any[]> => {
        try {
            const response = await apiClient.get('/compras/1');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
            throw error;
        }
    },
};