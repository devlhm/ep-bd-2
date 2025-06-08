using Api.Application.Interface.Service;
using Api.Presentation.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Api.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous] // Permite que qualquer um acesse este endpoint para poder fazer login
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequest)
        {
            string? token = await _authService.LoginAsync(loginRequest.Cpf, loginRequest.Senha);

            if (token == null)
            {
                return Unauthorized(new { message = "CPF ou senha inválidos." });
            }

            return Ok(new { token });
        }
    }
}