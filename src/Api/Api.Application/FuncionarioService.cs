using Api.Application.Interface.Service;
using Api.Application.Interface.Repository;
using Api.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application
{
    public class FuncionarioService : IFuncionarioService
    {
        private readonly IFuncionarioRepository _funcionarioRepository;

        // Em um projeto real, você injetaria um serviço de hashing
        // public FuncionarioService(IFuncionarioRepository funcionarioRepository, IPasswordHasher passwordHasher)
        public FuncionarioService(IFuncionarioRepository funcionarioRepository)
        {
            _funcionarioRepository = funcionarioRepository;
        }

        public async Task CreateAsync(Funcionario funcionario)
        {
            // ===== REGRA DE NEGÓCIO: HASHING DE SENHA =====
            // Antes de salvar, a senha deve ser transformada em um hash seguro.
            // Bibliotecas como BCrypt.Net ou a criptografia nativa do .NET são usadas para isso.
            // Exemplo: funcionario.Senha = BCrypt.Net.BCrypt.HashPassword(funcionario.Senha);
            funcionario.Senha = HashPassword(funcionario.Senha); // Placeholder para a lógica de hash

            await _funcionarioRepository.CreateAsync(funcionario);
        }

        public async Task<bool> UpdateAsync(Funcionario funcionario)
        {
            Funcionario? existing = await _funcionarioRepository.GetByCpfAsync(funcionario.Cpf);
            if (existing == null)
            {
                throw new KeyNotFoundException("Funcionário não encontrado.");
            }

            // Se a senha foi alterada no objeto, gere um novo hash
            if (existing.Senha != funcionario.Senha)
            {
                 funcionario.Senha = funcionario.Senha = BCrypt.Net.BCrypt.HashPassword(funcionario.Senha);
            }

            return await _funcionarioRepository.UpdateAsync(funcionario);
        }

        public async Task<IEnumerable<Funcionario>> GetAllAsync()
        {
            return await _funcionarioRepository.GetAllAsync();
        }

        public async Task<Funcionario?> GetByCpfAsync(string cpf)
        {
            return await _funcionarioRepository.GetByCpfAsync(cpf);
        }
        
        // Método privado apenas para simular o hashing
        private string HashPassword(string password)
        {
            // LÓGICA DE HASHING REAL IRIA AQUI
            return $"HASHED_{password}"; 
        }
    }
}