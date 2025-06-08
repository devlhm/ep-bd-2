using Api.Application.Interface.Repository;
using Api.Application.Interface.Service;
using Api.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _clienteRepository;

        public ClienteService(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        public async Task CreateAsync(Cliente cliente)
        {
            // ===== REGRA DE NEGÓCIO =====
            // Garantir que todo novo cliente comece com 0 pontos de fidelidade,
            // independentemente do que foi enviado na requisição.
            cliente.Pontuacao = 0;

            // ===== REGRA DE NEGÓCIO =====
            // Verificar se já não existe um cliente com o mesmo CPF
            Cliente? existingClient = await _clienteRepository.GetByCpfAsync(cliente.Cpf);
            if (existingClient != null)
            {
                throw new InvalidOperationException("Já existe um cliente cadastrado com este CPF.");
            }

            await _clienteRepository.CreateAsync(cliente);
        }
        
        // ... outros métodos ...
        
        public async Task<IEnumerable<Cliente>> GetAllAsync()
        {
            return await _clienteRepository.GetAllAsync();
        }

        public async Task<Cliente?> GetByCpfAsync(string cpf)
        {
            return await _clienteRepository.GetByCpfAsync(cpf);
        }

        public async Task<bool> UpdateAsync(Cliente cliente)
        {
             Cliente? existingClient = await _clienteRepository.GetByCpfAsync(cliente.Cpf);
            if (existingClient == null)
            {
                throw new KeyNotFoundException($"Cliente com CPF {cliente.Cpf} não encontrado.");
            }
            return await _clienteRepository.UpdateAsync(cliente);
        }

        public async Task<bool> DeleteAsync(string cpf)
        {
            return await _clienteRepository.DeleteAsync(cpf);
        }
    }
}