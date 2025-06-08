using Api.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Interface.Repository
{
    /// <summary>
    /// Contrato para operações de dados com a entidade Cliente.
    /// </summary>
    public interface IClienteRepository
    {
        /// <summary>
        /// Cadastra um novo cliente no banco de dados. (Ação do Caixa)
        /// </summary>
        Task CreateAsync(Cliente cliente);

        /// <summary>
        /// Lista todos os clientes cadastrados. (Ação do Gerente)
        /// </summary>
        Task<IEnumerable<Cliente>> GetAllAsync();

        /// <summary>
        /// Busca um cliente específico pelo seu CPF.
        /// </summary>
        Task<Cliente?> GetByCpfAsync(string cpf);

        /// <summary>
        /// Atualiza os dados de um cliente.
        /// </summary>
        Task<bool> UpdateAsync(Cliente cliente);

        /// <summary>
        /// Remove um cliente.
        /// </summary>
        Task<bool> DeleteAsync(string cpf);
    }
}