using Api.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Interface.Repository
{
    /// <summary>
    /// Contrato para operações de dados com a entidade Funcionario.
    /// </summary>
    public interface IFuncionarioRepository
    {
        /// <summary>
        /// Busca um funcionário pelo seu CPF.
        /// </summary>
        Task<Funcionario?> GetByCpfAsync(string cpf);

        /// <summary>
        /// Lista todos os funcionários.
        /// </summary>
        Task<IEnumerable<Funcionario>> GetAllAsync();
        
        /// <summary>
        /// Cria um novo funcionário (incluindo a entrada na tabela Pessoa).
        /// </summary>
        Task CreateAsync(Funcionario funcionario);

        /// <summary>
        /// Atualiza os dados de um funcionário.
        /// </summary>
        Task<bool> UpdateAsync(Funcionario funcionario);

        /// <summary>
        /// Remove um funcionário.
        /// </summary>
        Task<bool> DeleteAsync(string cpf);
        
        // ... (métodos existentes)

        /// <summary>
        /// Calcula o valor total de despesa mensal com salários.
        /// </summary>
        Task<decimal> GetTotalMonthlySalaryExpenseAsync();
    }
}