using Api.Domain.Models;
using System.Threading.Tasks;

namespace Api.Application.Interface.Service
{
    public interface ICompraService
    {
        /// <summary>
        /// Processa e registra uma nova compra.
        /// </summary>
        /// <returns>O ID da nova compra.</returns>
        Task<int> CreateAsync(Compra compra);
        Task<Compra?> GetByIdAsync(int id);
    }
}