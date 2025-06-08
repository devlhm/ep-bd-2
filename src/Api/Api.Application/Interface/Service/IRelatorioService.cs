using System;
using System.Threading.Tasks;

namespace Api.Application.Interface.Service
{
    public interface IRelatorioService
    {
        Task<decimal> GetTotalRevenueByPeriodAsync(DateTime startDate, DateTime endDate);
    }
}