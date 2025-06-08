using Api.Application.Interface.Service;
using Api.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

// Em um projeto real, você criaria DTOs para entrada e saída.
// Ex: public class CreateProdutoDto { public string Nome { get; set; } ... }

namespace Api.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly IProdutoService _produtoService;

        public ProdutosController(IProdutoService produtoService)
        {
            _produtoService = produtoService;
        }

        // GET: api/produtos
        [HttpGet]
        [Authorize(Roles = "Gerente,Repositor,Caixa")]
        public async Task<IActionResult> GetAll()
        {
            var produtos = await _produtoService.GetAllAsync();
            return Ok(produtos);
        }

        // GET: api/produtos/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Gerente,Repositor,Caixa")]
        public async Task<IActionResult> GetById(int id)
        {
            Produto? produto = await _produtoService.GetByIdAsync(id);
            if (produto == null)
            {
                return NotFound();
            }
            return Ok(produto);
        }

        // POST: api/produtos
        [HttpPost]
        [Authorize(Roles = "Gerente,Repositor")]
        public async Task<IActionResult> Create([FromBody] Produto produto) // Usando o modelo diretamente para simplificar
        {
            try
            {
                int newProductId = await _produtoService.CreateAsync(produto);
                produto.IdProduto = newProductId;
                // Retorna 201 Created com a localização do novo recurso e o objeto criado
                return CreatedAtAction(nameof(GetById), new { id = newProductId }, produto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/produtos/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Gerente,Repositor")]
        public async Task<IActionResult> Update(int id, [FromBody] Produto produto)
        {
            if (id != produto.IdProduto)
            {
                return BadRequest("O ID na URL deve ser o mesmo do corpo da requisição.");
            }

            try
            {
                bool success = await _produtoService.UpdateAsync(produto);
                if (!success)
                {
                    return NotFound(); // Ou outro código se a atualização falhar por outro motivo
                }
                return NoContent(); // Retorna 204 No Content, um sucesso sem corpo de resposta
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}