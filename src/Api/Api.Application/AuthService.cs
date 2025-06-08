using Api.Application.Interface;
using Api.Application.Interface.Repository;
using Api.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Api.Application.Interface.Service;
using Api.Domain.Models;

namespace Api.Application
{
    public class AuthService : IAuthService
    {
        private readonly IFuncionarioRepository _funcionarioRepository;
        private readonly string _jwtKey;

        public AuthService(IFuncionarioRepository funcionarioRepository, IConfiguration configuration)
        {
            _funcionarioRepository = funcionarioRepository;
            _jwtKey = configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is undefined."); 
        }

        // Assinatura corrigida para não depender de um DTO
        public async Task<string?> LoginAsync(string cpf, string senha)
        {
            var funcionario = await _funcionarioRepository.GetByCpfAsync(cpf);

            if (funcionario == null) return null;
            
            if (!BCrypt.Net.BCrypt.Verify(senha, funcionario.Senha))
            {
                return null; // Senha incorreta
            }

            // A lógica de geração de token a partir daqui permanece a mesma...
            var tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(_jwtKey);
            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, funcionario.Cpf),
                new(ClaimTypes.Role, ((TipoCargo)funcionario.IdCargo).ToString())
            };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            SecurityToken? token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}