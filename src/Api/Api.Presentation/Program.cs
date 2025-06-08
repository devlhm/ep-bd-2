using Api.Application;
using Api.Application.Interface.Service;
using Api.Application.Interface.Repository;
using Api.Infra.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Data;
using System.Text;
using Api.Infra.Data;
using Api.Presentation.Handlers;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// 1. Configurar serviços do ASP.NET Core
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 2. ADICIONAR O NOSSO MANIPULADOR DE EXCEÇÃO
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

// 3. Configurar Autenticação JWT
// As chaves viriam do appsettings.json ou user-secrets
byte[] key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is undefined."));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// 4. Configurar a conexão com o banco de dados
string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddScoped<IDbConnection>(sp => new NpgsqlConnection(connectionString));

// 5. Registrar nossas interfaces e implementações (Injeção de Dependência)
// Repositórios
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IFuncionarioRepository, FuncionarioRepository>();
builder.Services.AddScoped<ICompraRepository, CompraRepository>();

// Serviços
builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IFuncionarioService, FuncionarioService>();
builder.Services.AddScoped<ICompraService, CompraService>();
builder.Services.AddScoped<IRelatorioService, RelatorioService>();
builder.Services.AddScoped<IAuthService, AuthService>(); // <-- ADICIONAR ESTA LINHA

// REGISTRAR O INICIALIZADOR
builder.Services.AddScoped<DatabaseInitializer>();

WebApplication app = builder.Build();

// ==========================================================
// ===== EXECUTAR O INICIALIZADOR DE BANCO DE DADOS =====
// ==========================================================
using (IServiceScope scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
    // Usamos .Wait() ou tornamos o método Main assíncrono.
    // Para simplicidade aqui, vamos usar .Wait().
    initializer.InitializeAsync().Wait(); 
}
// ==========================================================

// 6. Configurar o pipeline de requisições HTTP

// Adicionar um middleware de tratamento de exceções global
app.UseExceptionHandler("/error"); 

app.UseHttpsRedirection();

// Ativar a autenticação e autorização
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();