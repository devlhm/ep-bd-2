using Api.Application.Interface.Service;
using Api.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Api.Presentation.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Api.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Gerente")]
    public class FuncionariosController : ControllerBase
    {
        private readonly IFuncionarioService _funcionarioService;

        public FuncionariosController(IFuncionarioService funcionarioService)
        {
            _funcionarioService = funcionarioService;
        }

        // GET: api/funcionarios
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // [Authorize(Roles = "Manager")]
            var funcionarios = await _funcionarioService.GetAllAsync();
            
            // Mapeamento para o DTO para remover a senha da resposta
            var response = funcionarios.Select(f => new FuncionarioResponseDto
            (
                f.Cpf,
                f.Nome,
                f.Email,
                f.Salario,
                f.IdCargo
            ));
            
            return Ok(response);
        }

        // POST: api/funcionarios
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Funcionario funcionario)
        {
            // [Authorize(Roles = "Manager")]
            try
            {
                await _funcionarioService.CreateAsync(funcionario);
                
                // Mapeamento para o DTO para remover a senha da resposta
                var response = new FuncionarioResponseDto
                (
                    funcionario.Cpf,
                    funcionario.Nome,
                    funcionario.Email,
                    funcionario.Salario,
                    funcionario.IdCargo
                );

                return CreatedAtAction(nameof(GetAll), null, response);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Ocorreu um erro ao criar o funcionário."});
            }
        }
    }
}