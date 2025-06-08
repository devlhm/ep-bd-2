using System.Data;
using Api.Application.Interface.Repository;
using Api.Domain.Models;
using Dapper;

namespace Api.Infra.Repository
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly IDbConnection _connection;

        public ProdutoRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<int> CreateAsync(Produto produto)
        {
            var sql = @"
                INSERT INTO produto (nome, quantidade_em_estoque, prateleira, corredor, validade, valor_unitario)
                VALUES (@Nome, @QuantidadeEmEstoque, @Prateleira, @Corredor, @Validade, @ValorUnitario)
                RETURNING id_produto;
            ";
            // ExecuteScalarAsync é ideal para retornar um único valor, como o ID recém-criado.
            return await _connection.ExecuteScalarAsync<int>(sql, produto);
        }

        public async Task<bool> DeleteAsync(int idProduto)
        {
            var sql = "DELETE FROM produto WHERE id_produto = @IdProduto";
            int affectedRows = await _connection.ExecuteAsync(sql, new { IdProduto = idProduto });
            // Retorna true se pelo menos uma linha foi afetada.
            return affectedRows > 0;
        }

        public async Task<IEnumerable<Produto>> GetAllAsync()
        {
            var sql = @"
                SELECT
                    id_produto AS IdProduto,
                    nome AS Nome,
                    quantidade_em_estoque AS QuantidadeEmEstoque,
                    prateleira AS Prateleira,
                    corredor AS Corredor,
                    validade AS Validade,
                    valor_unitario AS ValorUnitario
                FROM produto;
            ";
            // QueryAsync retorna uma coleção de objetos.
            return await _connection.QueryAsync<Produto>(sql);
        }

        public async Task<Produto?> GetByIdAsync(int idProduto)
        {
            var sql = @"
                SELECT
                    id_produto AS IdProduto,
                    nome AS Nome,
                    quantidade_em_estoque AS QuantidadeEmEstoque,
                    prateleira AS Prateleira,
                    corredor AS Corredor,
                    validade AS Validade,
                    valor_unitario AS ValorUnitario
                FROM produto
                WHERE id_produto = @IdProduto;
            ";
            // QuerySingleOrDefaultAsync retorna um único objeto ou null se não for encontrado.
            return await _connection.QuerySingleOrDefaultAsync<Produto>(sql, new { IdProduto = idProduto });
        }

        public async Task<bool> UpdateAsync(Produto produto)
        {
            var sql = @"
                UPDATE produto SET
                    nome = @Nome,
                    quantidade_em_estoque = @QuantidadeEmEstoque,
                    prateleira = @Prateleira,
                    corredor = @Corredor,
                    validade = @Validade,
                    valor_unitario = @ValorUnitario
                WHERE id_produto = @IdProduto;
            ";
            int affectedRows = await _connection.ExecuteAsync(sql, produto);
            return affectedRows > 0;
        }
    }
}