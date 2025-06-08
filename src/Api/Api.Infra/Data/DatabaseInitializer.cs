using Dapper;
using System.Data;

namespace Api.Infra.Data
{
    public class DatabaseInitializer
    {
        private readonly IDbConnection _connection;

        public DatabaseInitializer(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task InitializeAsync()
        {
            // Script SQL completo para criar todas as tabelas e inserir dados iniciais.
            var sql = @"
                -- Criação das tabelas com 'IF NOT EXISTS'
                CREATE TABLE IF NOT EXISTS pessoa (
                    cpf VARCHAR(11) PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    telefone VARCHAR(15) NOT NULL,
                    endereco VARCHAR(200) NOT NULL,
                    aniversario DATE NOT NULL
                );

                CREATE TABLE IF NOT EXISTS cargo (
                    id_cargo SERIAL PRIMARY KEY,
                    nome VARCHAR(50) UNIQUE NOT NULL
                );

                CREATE TABLE IF NOT EXISTS funcionario (
                    cpf VARCHAR(11) PRIMARY KEY,
                    salario NUMERIC(10,2) NOT NULL,
                    senha TEXT NOT NULL,
                    id_cargo INT REFERENCES cargo(id_cargo) ON DELETE SET NULL,
                    FOREIGN KEY (cpf) REFERENCES pessoa(cpf) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS cliente (
                    cpf VARCHAR(11) PRIMARY KEY,
                    pontuacao INT NOT NULL,
                    FOREIGN KEY (cpf) REFERENCES pessoa(cpf) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS supermercado (
                    cnpj VARCHAR(14) PRIMARY KEY
                );

                CREATE TABLE IF NOT EXISTS produto (
                    id_produto SERIAL PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL,
                    quantidade_em_estoque INT NOT NULL,
                    prateleira VARCHAR(20) NOT NULL,
                    corredor VARCHAR(20) NOT NULL,
                    validade DATE NOT NULL,
                    valor_unitario NUMERIC(10,2) NOT NULL
                );

                CREATE TABLE IF NOT EXISTS compra (
                    id_compra SERIAL PRIMARY KEY,
                    cpf_cliente VARCHAR(11),
                    valor_total NUMERIC(10,2) NOT NULL,
                    data DATE NOT NULL,
                    FOREIGN KEY (cpf_cliente) REFERENCES cliente(cpf) ON DELETE SET NULL
                );

                CREATE TABLE IF NOT EXISTS compra_produto (
                    id_compra INT NOT NULL,
                    id_produto INT NOT NULL,
                    quantidade_comprada INT NOT NULL,
                    PRIMARY KEY (id_compra, id_produto),
                    FOREIGN KEY (id_compra) REFERENCES compra(id_compra) ON DELETE CASCADE,
                    FOREIGN KEY (id_produto) REFERENCES produto(id_produto) ON DELETE CASCADE
                );

                -- Inserção de dados com 'ON CONFLICT DO NOTHING' para evitar duplicatas
                INSERT INTO cargo (id_cargo, nome) VALUES (1, 'Gerente'), (2, 'Caixa'), (3, 'Repositor')
                ON CONFLICT (id_cargo) DO NOTHING;

                -- O ideal é não inserir dados de teste de usuários/compras assim,
                -- mas para um trabalho de faculdade, é aceitável para ter um estado inicial.
                -- Adicionar 'ON CONFLICT' para as outras tabelas se necessário.
            ";

            await _connection.ExecuteAsync(sql);
        }
    }
}