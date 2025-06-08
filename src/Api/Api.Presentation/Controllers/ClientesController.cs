using Api.Application.Interface.Service;
using Api.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Presentation.Controllers
{
    [ApiController]
    [Authorize(Roles = "Gerente,Caixa")]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteService _clienteService;

        public ClientesController(IClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        // GET: api/clientes
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clientes = await _clienteService.GetAllAsync();
            return Ok(clientes);
        }

        // GET: api/clientes/12345678901
        [HttpGet("{cpf}")]
        public async Task<IActionResult> GetByCpf(string cpf)
        {
            Cliente? cliente = await _clienteService.GetByCpfAsync(cpf);
            if (cliente == null)
            {
                return NotFound();
            }
            return Ok(cliente);
        }

        // POST: api/clientes
        [HttpPost]
        
        public async Task<IActionResult> Create([FromBody] Cliente cliente)
        {
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
    }
}