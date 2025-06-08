using System.Data;
using Api.Application.Interface.Repository;
using Api.Domain.Models;
using Dapper;

namespace Api.Infra.Repository
{
    public class FuncionarioRepository : IFuncionarioRepository
    {
        private readonly IDbConnection _connection;

        public FuncionarioRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        // A criação de funcionário é uma operação transacional,
        // pois envolve inserir em 'pessoa' e depois em 'funcionario'.
        public async Task CreateAsync(Funcionario funcionario)
        {
            using IDbTransaction? transaction = _connection.BeginTransaction();
            try
            {
                // 1. Inserir na tabela 'pessoa'
                var pessoaSql = @"
                    INSERT INTO pessoa (cpf, nome, email, telefone, endereco, aniversario)
                    VALUES (@Cpf, @Nome, @Email, @Telefone, @Endereco, @Aniversario);
                ";
                await _connection.ExecuteAsync(pessoaSql, funcionario, transaction);

                // 2. Inserir na tabela 'funcionario'
                var funcionarioSql = @"
                    INSERT INTO funcionario (cpf, salario, senha, id_cargo)
                    VALUES (@Cpf, @Salario, @Senha, @IdCargo);
                ";
                await _connection.ExecuteAsync(funcionarioSql, funcionario, transaction);

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
            // Graças ao 'ON DELETE CASCADE' no schema do banco,
            // basta deletar da tabela 'pessoa'.
            var sql = "DELETE FROM pessoa WHERE cpf = @Cpf";
            int affectedRows = await _connection.ExecuteAsync(sql, new { Cpf = cpf });
            return affectedRows > 0;
        }
        
        private const string SelectFuncionarioQuery = @"
            SELECT
                p.cpf AS Cpf,
                p.nome AS Nome,
                p.email AS Email,
                p.telefone AS Telefone,
                p.endereco AS Endereco,
                p.aniversario AS Aniversario,
                f.salario AS Salario,
                f.senha AS Senha,
                f.id_cargo AS IdCargo
            FROM pessoa p
            INNER JOIN funcionario f ON p.cpf = f.cpf
        ";

        public async Task<IEnumerable<Funcionario>> GetAllAsync()
        {
            return await _connection.QueryAsync<Funcionario>(SelectFuncionarioQuery);
        }

        public async Task<Funcionario?> GetByCpfAsync(string cpf)
        {
            var sql = $"{SelectFuncionarioQuery} WHERE p.cpf = @Cpf;";
            return await _connection.QuerySingleOrDefaultAsync<Funcionario>(sql, new { Cpf = cpf });
        }

        public async Task<bool> UpdateAsync(Funcionario funcionario)
        {
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
                int affectedPessoa = await _connection.ExecuteAsync(pessoaSql, funcionario, transaction);

                var funcionarioSql = @"
                    UPDATE funcionario SET
                        salario = @Salario,
                        senha = @Senha,
                        id_cargo = @IdCargo
                    WHERE cpf = @Cpf;
                ";
                int affectedFuncionario = await _connection.ExecuteAsync(funcionarioSql, funcionario, transaction);

                transaction.Commit();
                // Retorna true se qualquer uma das tabelas foi atualizada.
                return affectedPessoa > 0 || affectedFuncionario > 0;
            }
            catch(Exception)
            {
                transaction.Rollback();
                throw;
            }
        }
    }
}