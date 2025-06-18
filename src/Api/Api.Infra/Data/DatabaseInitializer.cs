using Dapper;
using System.Data;
using BCrypt.Net;

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
            // --- ETAPA 1: Criar as tabelas ---
            var createTablesSql = @"
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
                    cpf VARCHAR(11) PRIMARY KEY REFERENCES pessoa(cpf) ON DELETE CASCADE,
                    salario NUMERIC(10,2) NOT NULL,
                    senha TEXT NOT NULL,
                    id_cargo INT REFERENCES cargo(id_cargo) ON DELETE SET NULL
                );
                CREATE TABLE IF NOT EXISTS cliente (
                    cpf VARCHAR(11) PRIMARY KEY REFERENCES pessoa(cpf) ON DELETE CASCADE,
                    pontuacao INT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS produto (
                    id_produto SERIAL PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL,
                    quantidade_em_estoque INT NOT NULL,
                    prateleira VARCHAR(50),
                    corredor VARCHAR(50),
                    validade DATE NOT NULL,
                    valor_unitario NUMERIC(10, 2) NOT NULL
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
                );";
            
            await _connection.ExecuteAsync(createTablesSql);

            // --- ETAPA 2: Inserir dados base (cargos) ---
            var seedCargosSql = @"
                INSERT INTO cargo (id_cargo, nome) VALUES (1, 'Gerente'), (2, 'Caixa'), (3, 'Repositor') 
                ON CONFLICT (id_cargo) DO NOTHING;";
            await _connection.ExecuteAsync(seedCargosSql);
            
            // --- ETAPA 3: Inserir Pessoas ---
            var seedPessoasSql = @"
                INSERT INTO pessoa (cpf, nome, email, telefone, endereco, aniversario) VALUES
                ('12345678901', 'João da Silva', 'joao@email.com', '(11)91234-5678', 'Rua A, 123', '1990-05-15'),
                ('98765432100', 'Maria Oliveira', 'maria@email.com', '(11)97654-3210', 'Rua B, 456', '1988-03-22'),
                ('11122233344', 'Carlos Souza', 'carlos@email.com', '(11)92345-6789', 'Rua C, 789', '1992-07-20'),
                ('55566677788', 'Ana Lima', 'ana@email.com', '(11)93456-7890', 'Rua D, 321', '1995-12-10'),
                ('22233344455', 'Paula Martins', 'paula@email.com', '(21)99876-5432', 'Rua E, 987', '1991-08-05')
                ON CONFLICT (cpf) DO NOTHING;";
            await _connection.ExecuteAsync(seedPessoasSql);
            
            // --- ETAPA 4: Inserir Clientes e Funcionários ---
            var seedClientesSql = @"
                INSERT INTO cliente (cpf, pontuacao) VALUES
                ('98765432100', 150),
                ('55566677788', 300),
                ('22233344455', 90)
                ON CONFLICT (cpf) DO NOTHING;";
            await _connection.ExecuteAsync(seedClientesSql);

            var plainTextPassword = "123456";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainTextPassword);

            var seedFuncionariosSql = @"
                INSERT INTO funcionario (cpf, salario, senha, id_cargo) VALUES
                ('12345678901', 3500.00, @HashedPassword, 1),
                ('11122233344', 1800.00, @HashedPassword, 3)
                ON CONFLICT (cpf) DO NOTHING;";
            await _connection.ExecuteAsync(seedFuncionariosSql, new { HashedPassword = hashedPassword });

            // --- ETAPA 5: Inserir Produtos ---
            var seedProdutosSql = @"
                INSERT INTO produto (nome, quantidade_em_estoque, prateleira, corredor, validade, valor_unitario) VALUES
                ('Arroz 5kg', 100, 'A1', 'C1', '2025-12-31', 25.90),
                ('Feijão 1kg', 150, 'A2', 'C1', '2025-10-15', 8.50),
                ('Macarrão 500g', 200, 'A3', 'C2', '2025-11-30', 4.75),
                ('Óleo 900ml', 180, 'B1', 'C3', '2025-09-20', 6.90)
                ON CONFLICT (id_produto) DO NOTHING;";
            await _connection.ExecuteAsync(seedProdutosSql);

            // --- ETAPA 6: Inserir Compras e Itens de Compra ---
            // (Opcional, mas útil para ter dados de teste)
            var seedComprasSql = @"
                INSERT INTO compra (cpf_cliente, valor_total, data) VALUES
                ('98765432100', 34.40, '2025-05-15'),
                ('55566677788', 11.65, '2025-05-16')
                ON CONFLICT (id_compra) DO NOTHING;

                INSERT INTO compra_produto (id_compra, id_produto, quantidade_comprada) VALUES
                (1, 1, 1), 
                (1, 2, 1), 
                (2, 3, 1), 
                (2, 4, 1)
                ON CONFLICT (id_compra, id_produto) DO NOTHING;";
            await _connection.ExecuteAsync(seedComprasSql);
        }
    }
}