using System;
using System.Threading.Tasks;

namespace Api.Application.Interface.Service
{
    public interface IRelatorioService
    {
        Task<decimal> GetTotalRevenueByPeriodAsync(DateTime startDate, DateTime endDate);
        
        /// <summary>
        /// Gera um resumo financeiro comparando receitas e despesas em um período.
        /// </summary>
        /// <returns>Uma tupla contendo o total da receita e o total das despesas.</returns>
        Task<(decimal TotalRevenue, decimal TotalExpenses)> GetFinancialSummaryByPeriodAsync(DateTime startDate, DateTime endDate);
    }
}