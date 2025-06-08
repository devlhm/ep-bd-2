using Api.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Interface.Repository
{
    /// <summary>
    /// Contrato para operações de dados com a entidade Compra.
    /// </summary>
    public interface ICompraRepository
    {
        /// <summary>
        /// Busca uma compra pelo seu ID, incluindo seus itens.
        /// </summary>
        Task<Compra?> GetByIdAsync(int idCompra);

        /// <summary>
        /// Cria uma nova compra no banco de dados.
        /// </summary>
        /// <remarks>
        /// A implementação deve ser transacional para garantir que a compra, 
        /// seus itens e a atualização do estoque ocorram de forma atômica.
        /// </remarks>
        /// <returns>O ID da nova compra criada.</returns>
        Task<int> CreateAsync(Compra compra);
        
        /// <summary>
        /// Busca o total de receita em um determinado período.
        /// </summary>
        Task<decimal> GetTotalRevenueByPeriodAsync(DateTime dataInicio, DateTime dataFim);
    }
}