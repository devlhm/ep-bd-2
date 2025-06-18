import { Client } from '../@types/Client';
import apiClient from '../Api/front/api'

export const Api = {
    login: async (cpf: string, senha: string) => {
        console.log('Tentando fazer login com CPF:', cpf, 'e senha:', senha);
        try {
            const response = await apiClient.post('/auth/login', {
                cpf,
                senha,
            })
                .then((res) => {
                    // Salvar o token no localStorage ou onde preferir
                    localStorage.setItem('authToken', res.data.token);
                    console.log('Login bem-sucedido:', res.data);
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
            const response = await apiClient.get('/clients');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            throw error;
        }
    }
};