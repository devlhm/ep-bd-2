using Api.Application.Interface.Service;
using Api.Application.Interface.Repository;
using System;
using System.Threading.Tasks;

namespace Api.Application
{
    public class RelatorioService : IRelatorioService
    {
        private readonly ICompraRepository _compraRepository;
        private readonly IFuncionarioRepository _funcionarioRepository;

        public RelatorioService(ICompraRepository compraRepository, IFuncionarioRepository funcionarioRepository)
        {
            _compraRepository = compraRepository;
            _funcionarioRepository = funcionarioRepository;
        }

        public async Task<decimal> GetTotalRevenueByPeriodAsync(DateTime startDate, DateTime endDate)
        {
            return await _compraRepository.GetTotalRevenueByPeriodAsync(startDate, endDate);
        }

        // Nova implementação
        public async Task<(decimal TotalRevenue, decimal TotalExpenses)> GetFinancialSummaryByPeriodAsync(DateTime startDate, DateTime endDate)
        {
            // 1. Obter a receita total para o período exato
            var totalRevenue = await _compraRepository.GetTotalRevenueByPeriodAsync(startDate, endDate);

            // 2. Obter a despesa mensal com salários
            var monthlySalaryExpense = await _funcionarioRepository.GetTotalMonthlySalaryExpenseAsync();

            // 3. Calcular a despesa proporcional ao período solicitado
            if (monthlySalaryExpense > 0)
            {
                var daysInPeriod = (endDate - startDate).TotalDays;
                // Calcula a despesa diária com base em um mês médio (30.44 dias) e multiplica pelos dias no período
                var dailySalaryExpense = monthlySalaryExpense / 30.44m; 
                var totalExpenses = dailySalaryExpense * (decimal)daysInPeriod;
                return (totalRevenue, totalExpenses);
            }

            return (totalRevenue, 0);
        }
    }
}