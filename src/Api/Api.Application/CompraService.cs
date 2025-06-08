using Api.Application.Interface.Service;
using Api.Application.Interface.Repository;
using Api.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Application
{
    public class CompraService : ICompraService
    {
        private readonly ICompraRepository _compraRepository;
        private readonly IProdutoRepository _produtoRepository;
        private readonly IClienteRepository _clienteRepository;

        public CompraService(
            ICompraRepository compraRepository, 
            IProdutoRepository produtoRepository, 
            IClienteRepository clienteRepository)
        {
            _compraRepository = compraRepository;
            _produtoRepository = produtoRepository;
            _clienteRepository = clienteRepository;
        }

        public async Task<int> CreateAsync(Compra compra)
        {
            if (compra.Itens == null || !compra.Itens.Any())
                throw new ArgumentException("A compra deve ter pelo menos um item.");

            decimal valorTotalCalculado = 0;

            // ===== REGRAS DE NEGÓCIO =====
            // 1. Validar cliente (se houver)
            if (!string.IsNullOrEmpty(compra.CpfCliente))
            {
                Cliente? cliente = await _clienteRepository.GetByCpfAsync(compra.CpfCliente);
                if (cliente == null)
                    throw new KeyNotFoundException("Cliente não encontrado.");
            }

            // 2. Validar cada item e calcular o preço total do lado do servidor
            foreach (ItemCompra? item in compra.Itens)
            {
                Produto? produtoDoBanco = await _produtoRepository.GetByIdAsync(item.IdProduto);
                if (produtoDoBanco == null)
                    throw new KeyNotFoundException($"Produto com ID {item.IdProduto} não existe.");

                if (produtoDoBanco.QuantidadeEmEstoque < item.QuantidadeComprada)
                    throw new InvalidOperationException($"Estoque insuficiente para o produto '{produtoDoBanco.Nome}'.");

                // O preço usado é SEMPRE o do banco de dados, nunca o que o cliente envia.
                valorTotalCalculado += produtoDoBanco.ValorUnitario * item.QuantidadeComprada;
            }

            // 3. Atribuir os valores calculados e a data do servidor
            compra.ValorTotal = valorTotalCalculado;
            compra.Data = DateTime.UtcNow;

            // 4. Enviar para o repositório, que fará a transação
            return await _compraRepository.CreateAsync(compra);
        }

        public async Task<Compra?> GetByIdAsync(int id)
        {
            return await _compraRepository.GetByIdAsync(id);
        }
    }
}