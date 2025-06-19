import { Client } from '../@types/Cliente';
import { Compra } from '../@types/Compra';
import { Funcionario } from '../@types/Funcionario';
import { Produto } from '../@types/Produto';
import { Venda } from '../@types/ComprasType';
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
    editClient: async (id: string, client: Client): Promise<Client> => {
        try {
            const response = await apiClient.put(`/clientes/${id}`, client);
            return response.data;
        } catch (error) {
            console.error('Erro ao editar cliente:', error);
            throw error;
        }
    },
    deleteClient: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/clientes/${id}`);
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
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
    editFuncionario: async (id: string, funcionario: Funcionario): Promise<Funcionario> => {
        try {
            const response = await apiClient.put(`/funcionarios/${id}`, funcionario);
            return response.data;
        } catch (error) {
            console.error('Erro ao editar funcionário:', error);
            throw error;
        }
    },
    deleteFuncionario: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/funcionarios/${id}`);
        } catch (error) {
            console.error('Erro ao deletar funcionário:', error);
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
    editProduto: async (id: string, produto: Produto): Promise<Produto> => {
        try {
            const response = await apiClient.put(`/produtos/${id}`, produto);
            return response.data;
        } catch (error) {
            console.error('Erro ao editar produto:', error);
            throw error;
        }
    },
    deleteProduto: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/produtos/${id}`);
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            throw error;
        }
    },
    fetchVendas: async (): Promise<Venda[]> => {
        try {
            const response = await apiClient.get('/compras/1');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
            throw error;
        }
    },
    registerVenda: async (venda: Compra): Promise<any> => {
        try {
            const response = await apiClient.post('/compras', venda);
            return response.data;
        } catch (error) {
            console.error('Erro ao registrar venda:', error);
            throw error;
        }
    }
};