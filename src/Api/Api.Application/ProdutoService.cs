using Api.Application.Interface.Repository;
using Api.Application.Interface.Service;
using Api.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application
{
    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _produtoRepository;

        public ProdutoService(IProdutoRepository produtoRepository)
        {
            _produtoRepository = produtoRepository;
        }

        public async Task<int> CreateAsync(Produto produto)
        {
            // ===== REGRA DE NEGÓCIO =====
            // Exemplo: Não permitir o cadastro de produtos com preço negativo ou zero.
            if (produto.ValorUnitario <= 0)
            {
                throw new ArgumentException("O valor do produto deve ser maior que zero.");
            }

            return await _produtoRepository.CreateAsync(produto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _produtoRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Produto>> GetAllAsync()
        {
            return await _produtoRepository.GetAllAsync();
        }

        public async Task<Produto?> GetByIdAsync(int id)
        {
            return await _produtoRepository.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(Produto produto)
        {
            // ===== REGRA DE NEGÓCIO =====
            // Exemplo: Validação similar à da criação
            if (produto.ValorUnitario <= 0)
            {
                throw new ArgumentException("O valor do produto deve ser maior que zero.");
            }
            
            // Outra regra: garantir que o produto a ser atualizado realmente existe.
            Produto? existingProduct = await _produtoRepository.GetByIdAsync(produto.IdProduto);
            if (existingProduct == null)
            {
                throw new KeyNotFoundException($"Produto com ID {produto.IdProduto} não encontrado.");
            }

            return await _produtoRepository.UpdateAsync(produto);
        }
    }
}