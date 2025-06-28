using System.Data;
using Api.Application.Interface.Repository;
using Api.Domain.Models;
using Dapper;

namespace Api.Infra.Repository
{
    public class CompraRepository : ICompraRepository
    {
        private readonly IDbConnection _connection;

        public CompraRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<int> CreateAsync(Compra compra)
        {
            // Toda a operação é envolvida em uma transação
            if (_connection.State == ConnectionState.Closed) { _connection.Open(); }
            using IDbTransaction? transaction = _connection.BeginTransaction();
            try
            {
                // 1. Inserir o registro principal da compra e obter o novo ID
                var sqlCompra = @"
                    INSERT INTO compra (cpf_cliente, valor_total, data)
                    VALUES (@CpfCliente, @ValorTotal, @Data)
                    RETURNING id_compra;
                ";
                var compraId = await _connection.ExecuteScalarAsync<int>(sqlCompra, compra, transaction);
                
                // Atribui o novo ID ao objeto para uso futuro
                compra.IdCompra = compraId;

                // 2. Iterar sobre os itens da compra
                foreach (ItemCompra? item in compra.Itens)
                {
                    // 2a. Inserir o item na tabela de ligação 'compra_produto'
                    var sqlItem = @"
                        INSERT INTO compra_produto (id_compra, id_produto, quantidade_comprada)
                        VALUES (@IdCompra, @IdProduto, @QuantidadeComprada);
                    ";
                    await _connection.ExecuteAsync(sqlItem, new 
                    { 
                        IdCompra = compraId, 
                        item.IdProduto, 
                        item.QuantidadeComprada 
                    }, transaction);

                    // 2b. Decrementar a quantidade do produto no estoque
                    var sqlUpdateEstoque = @"
                        UPDATE produto
                        SET quantidade_em_estoque = quantidade_em_estoque - @Quantidade
                        WHERE id_produto = @IdProduto;
                    ";
                    await _connection.ExecuteAsync(sqlUpdateEstoque, new 
                    { 
                        Quantidade = item.QuantidadeComprada, 
                        IdProduto = item.IdProduto 
                    }, transaction);
                }

                // Se tudo deu certo, confirma a transação
                transaction.Commit();
                return compraId;
            }
            catch (Exception)
            {
                // Se qualquer erro ocorreu, desfaz todas as operações
                transaction.Rollback();
                throw; // Propaga a exceção para a camada de serviço tratar
            }
        }

        public async Task<Compra?> GetByIdAsync(int idCompra)
        {
            // Usamos QueryMultiple para executar duas queries em uma única ida ao banco
            var sql = @"
                SELECT * FROM compra WHERE id_compra = @IdCompra;

                SELECT
                    cp.id_produto AS IdProduto,
                    cp.quantidade_comprada AS QuantidadeComprada,
                    p.nome AS Nome,
                    p.valor_unitario as ValorUnitario
                FROM compra_produto cp
                INNER JOIN produto p ON p.id_produto = cp.id_produto
                WHERE cp.id_compra = @IdCompra;
            ";

            using (SqlMapper.GridReader? multi = await _connection.QueryMultipleAsync(sql, new { IdCompra = idCompra }))
            {
                // Lê o primeiro resultado (a compra)
                var compra = await multi.ReadSingleOrDefaultAsync<Compra>();
                if (compra != null)
                {
                    // Lê o segundo resultado (a lista de itens) e a anexa à compra
                    compra.Itens = (await multi.ReadAsync<ItemCompra>()).ToList();
                }
                return compra;
            }
        }

        public async Task<decimal> GetTotalRevenueByPeriodAsync(DateTime dataInicio, DateTime dataFim)
        {
            var sql = @"
                SELECT SUM(valor_total) 
                FROM compra 
                WHERE data BETWEEN @DataInicio AND @DataFim;
            ";

            // Usamos ExecuteScalarAsync para buscar um valor único.
            // O resultado pode ser null se não houver vendas no período.
            var total = await _connection.ExecuteScalarAsync<decimal?>(sql, new { dataInicio, dataFim });
            
            // Retorna o total ou 0 se for nulo.
            return total ?? 0;
        }
    }
}