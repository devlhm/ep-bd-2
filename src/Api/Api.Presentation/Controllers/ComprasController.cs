using Api.Application.Interface.Service;
using Api.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Caixa,Gerente")]
    public class ComprasController : ControllerBase
    {
        private readonly ICompraService _compraService;

        public ComprasController(ICompraService compraService)
        {
            _compraService = compraService;
        }

        // POST: api/compras
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Compra compra)
        {
            // [Authorize(Roles = "Cashier")]
            try
            {
                int newCompraId = await _compraService.CreateAsync(compra);
                return Ok(new { message = "Compra registrada com sucesso!", compraId = newCompraId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message }); // Ex: Produto ou cliente não encontrado
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message }); // Ex: Estoque insuficiente
            }
            catch (Exception)
            {
                // Erro genérico
                return StatusCode(500, new { message = "Ocorreu um erro interno ao processar a compra." });
            }
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var compra = await _compraService.GetByIdAsync(id);
            if (compra == null)
            {
                return NotFound(new { message = $"Compra com ID {id} não encontrada." });
            }
            return Ok(compra);
        }
    }
}