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

    // --- ETAPA 2: Inserir dados base (cargos e pessoas) ---
    var seedBaseDataSql = @"
        INSERT INTO cargo (id_cargo, nome) VALUES (1, 'Gerente'), (2, 'Caixa'), (3, 'Repositor') ON CONFLICT (id_cargo) DO NOTHING;
        
        INSERT INTO pessoa (cpf, nome, email, telefone, endereco, aniversario) VALUES
        ('11111111111', 'Ana Gerente', 'gerente@super.com', '11999999999', 'Rua Principal, 1', '1980-01-01'),
        ('22222222222', 'Bruno Caixa', 'caixa@super.com', '11888888888', 'Rua Secundaria, 2', '1990-02-02'),
        ('33333333333', 'Carlos Repositor', 'repositor@super.com', '11777777777', 'Rua Terciaria, 3', '2000-03-03')
        ON CONFLICT (cpf) DO NOTHING;";
    await _connection.ExecuteAsync(seedBaseDataSql);
    
    // --- ETAPA 3: Gerar o Hash da senha e inserir os funcionários ---
    // A senha padrão para todos os usuários de teste
    var plainTextPassword = "123456";
    // Gerar o hash SEGURO da senha
    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainTextPassword);

    var seedFuncionariosSql = @"
        INSERT INTO funcionario (cpf, salario, senha, id_cargo) VALUES
        ('11111111111', 5000.00, @HashedPassword, 1),
        ('22222222222', 2000.00, @HashedPassword, 2),
        ('33333333333', 1800.00, @HashedPassword, 3)
        ON CONFLICT (cpf) DO NOTHING;";

    await _connection.ExecuteAsync(seedFuncionariosSql, new { HashedPassword = hashedPassword });
}
    }
}