using Api.Application.Interface;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Api.Application.Interface.Service;
using Api.Presentation.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Api.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Gerente")]
    public class RelatoriosController : ControllerBase
    {
        private readonly IRelatorioService _relatorioService;

        public RelatoriosController(IRelatorioService relatorioService)
        {
            _relatorioService = relatorioService;
        }

        // GET: api/relatorios/receita?de=2025-05-01&ate=2025-05-31
        [HttpGet("receita")]
        public async Task<IActionResult> GetReceitaPorPeriodo([FromQuery] DateTime de, [FromQuery] DateTime ate)
        {
            // [Authorize(Roles = "Manager")]
            if (de > ate)
            {
                return BadRequest(new { message = "A data de início não pode ser maior que a data de fim." });
            }

            decimal totalReceita = await _relatorioService.GetTotalRevenueByPeriodAsync(de, ate);

            return Ok(new {
                periodo = new { de = de.ToShortDateString(), ate = ate.ToShortDateString() },
                receitaTotal = totalReceita
            });
        }
        
        [HttpGet("resumo-financeiro")]
        public async Task<IActionResult> GetResumoFinanceiro([FromQuery] DateTime de, [FromQuery] DateTime ate)
        {
            if (de > ate)
            {
                return BadRequest(new { message = "A data de início não pode ser maior que a data de fim." });
            }

            var (totalRevenue, totalExpenses) = await _relatorioService.GetFinancialSummaryByPeriodAsync(de, ate);

            var lucro = totalRevenue - totalExpenses;

            var responseDto = new ResumoFinanceiroDto(
                ReceitaTotal: totalRevenue,
                DespesasTotais: totalExpenses,
                Lucro: lucro,
                PeriodoInicio: de,
                PeriodoFim: ate
            );

            return Ok(responseDto);
        }
    }
}