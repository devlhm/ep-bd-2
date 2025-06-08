using Api.Application.Interface.Service;
using Api.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteService _clienteService;

        public ClientesController(IClienteService clienteService)
        {
            _clienteService = clienteService;
        }
        
        // GET: api/clientes/12345678901
        [Authorize(Roles = "Caixa,Gerente")]
        [HttpGet("{cpf}")]
        public async Task<IActionResult> GetByCpf(string cpf)
        {
            // [Authorize(Roles = "Manager")]
            Cliente? cliente = await _clienteService.GetByCpfAsync(cpf);
            if (cliente == null)
            {
                return NotFound();
            }
            return Ok(cliente);
        }

        // POST: api/clientes
        [HttpPost]
        [Authorize(Roles = "Caixa,Gerente")]
        public async Task<IActionResult> Create([FromBody] Cliente cliente)
        {
            // [Authorize(Roles = "Cashier")]
            try
            {
                await _clienteService.CreateAsync(cliente);
                // Retorna 201 Created com a localização do novo recurso
                return CreatedAtAction(nameof(GetByCpf), new { cpf = cliente.Cpf }, cliente);
            }
            catch (InvalidOperationException ex)
            {
                // Conflito, por exemplo, CPF já existente.
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Ocorreu um erro ao criar o cliente." });
            }
        }
        
        // GET: api/clientes
        [HttpGet]
        [Authorize(Roles = "Gerente")] // Apenas Gerentes podem ver todos os clientes
        public async Task<IActionResult> GetAll()
        {
            var clientes = await _clienteService.GetAllAsync();
            return Ok(clientes);
        }

        // PUT: api/clientes/12345678901
        [HttpPut("{cpf}")]
        [Authorize(Roles = "Gerente")] // Apenas Gerentes podem atualizar clientes
        public async Task<IActionResult> Update(string cpf, [FromBody] Cliente cliente)
        {
            if (cpf != cliente.Cpf)
            {
                return BadRequest("O CPF na URL deve ser o mesmo do corpo da requisição.");
            }
            try
            {
                await _clienteService.UpdateAsync(cliente);
                return NoContent(); // Sucesso
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/clientes/12345678901
        [HttpDelete("{cpf}")]
        [Authorize(Roles = "Gerente")] // Apenas Gerentes podem remover clientes
        public async Task<IActionResult> Delete(string cpf)
        {
            try
            {
                await _clienteService.DeleteAsync(cpf);
                return NoContent(); // Sucesso
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}