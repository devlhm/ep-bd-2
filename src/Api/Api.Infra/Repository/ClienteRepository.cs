using System.Data;
using Api.Application.Interface.Repository;
using Api.Domain.Models;
using Dapper;

namespace Api.Infra.Repository
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly IDbConnection _connection;

        public ClienteRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task CreateAsync(Cliente cliente)
        {
            using IDbTransaction? transaction = _connection.BeginTransaction();
            try
            {
                // 1. Inserir na tabela 'pessoa'
                var pessoaSql = @"
                    INSERT INTO pessoa (cpf, nome, email, telefone, endereco, aniversario)
                    VALUES (@Cpf, @Nome, @Email, @Telefone, @Endereco, @Aniversario);
                ";
                await _connection.ExecuteAsync(pessoaSql, cliente, transaction);

                // 2. Inserir na tabela 'cliente'
                var clienteSql = @"
                    INSERT INTO cliente (cpf, pontuacao)
                    VALUES (@Cpf, @Pontuacao);
                ";
                await _connection.ExecuteAsync(clienteSql, cliente, transaction);

                transaction.Commit();
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<bool> DeleteAsync(string cpf)
        {
            // O 'ON DELETE CASCADE' cuida da remoção da tabela 'cliente'
            var sql = "DELETE FROM pessoa WHERE cpf = @Cpf";
            int affectedRows = await _connection.ExecuteAsync(sql, new { Cpf = cpf });
            return affectedRows > 0;
        }

        private const string SelectClienteQuery = @"
            SELECT
                p.cpf AS Cpf,
                p.nome AS Nome,
                p.email AS Email,
                p.telefone AS Telefone,
                p.endereco AS Endereco,
                p.aniversario AS Aniversario,
                c.pontuacao AS Pontuacao
            FROM pessoa p
            INNER JOIN cliente c ON p.cpf = c.cpf
        ";

        public async Task<IEnumerable<Cliente>> GetAllAsync()
        {
            return await _connection.QueryAsync<Cliente>(SelectClienteQuery);
        }

        public async Task<Cliente?> GetByCpfAsync(string cpf)
        {
            var sql = $"{SelectClienteQuery} WHERE p.cpf = @Cpf;";
            return await _connection.QuerySingleOrDefaultAsync<Cliente>(sql, new { Cpf = cpf });
        }

        public async Task<bool> UpdateAsync(Cliente cliente)
        {
            if (_connection.State == ConnectionState.Closed) { _connection.Open(); }
            using IDbTransaction? transaction = _connection.BeginTransaction();
            try
            {
                var pessoaSql = @"
                    UPDATE pessoa SET
                        nome = @Nome,
                        email = @Email,
                        telefone = @Telefone,
                        endereco = @Endereco,
                        aniversario = @Aniversario
                    WHERE cpf = @Cpf;
                ";
                await _connection.ExecuteAsync(pessoaSql, cliente, transaction);

                var clienteSql = @"
                    UPDATE cliente SET
                        pontuacao = @Pontuacao
                    WHERE cpf = @Cpf;
                ";
                await _connection.ExecuteAsync(clienteSql, cliente, transaction);
                
                transaction.Commit();
                return true;
            }
            catch(Exception)
            {
                transaction.Rollback();
                throw; // ou retorne false, dependendo da sua estratégia de erro
            }
        }
    }
}