using Api.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Interface.Repository
{
    /// <summary>
    /// Contrato para operações de dados com a entidade Produto.
    /// </summary>
    public interface IProdutoRepository
    {
        /// <summary>
        /// Busca um produto pelo seu ID.
        /// </summary>
        Task<Produto?> GetByIdAsync(int idProduto);

        /// <summary>
        /// Lista todos os produtos cadastrados.
        /// </summary>
        Task<IEnumerable<Produto>> GetAllAsync();

        /// <summary>
        /// Adiciona um novo produto no banco de dados.
        /// </summary>
        /// <returns>O ID do novo produto criado.</returns>
        Task<int> CreateAsync(Produto produto);

        /// <summary>
        /// Atualiza os dados de um produto existente.
        /// </summary>
        Task<bool> UpdateAsync(Produto produto);

        /// <summary>
        /// Remove um produto do banco de dados.
        /// </summary>
        Task<bool> DeleteAsync(int idProduto);
    }
}