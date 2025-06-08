using Api.Application.Interface.Service;
using Api.Application.Interface.Repository;
using System;
using System.Threading.Tasks;

namespace Api.Application
{
    public class RelatorioService : IRelatorioService
    {
        private readonly ICompraRepository _compraRepository;

        public RelatorioService(ICompraRepository compraRepository)
        {
            _compraRepository = compraRepository;
        }

        public async Task<decimal> GetTotalRevenueByPeriodAsync(DateTime startDate, DateTime endDate)
        {
            return await _compraRepository.GetTotalRevenueByPeriodAsync(startDate, endDate);
        }
    }
}