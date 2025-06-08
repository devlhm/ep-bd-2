using Api.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Interface.Service
{
    /// <summary>
    /// Contrato para o serviço de negócio de Produtos.
    /// </summary>
    public interface IProdutoService
    {
        Task<Produto?> GetByIdAsync(int id);
        Task<IEnumerable<Produto>> GetAllAsync();
        Task<int> CreateAsync(Produto produto);
        Task<bool> UpdateAsync(Produto produto);
        Task<bool> DeleteAsync(int id);
    }
}