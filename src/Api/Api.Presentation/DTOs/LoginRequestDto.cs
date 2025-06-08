namespace Api.Presentation.DTOs
{
    // Usando record para um DTO de requisição simples e imutável
    public record LoginRequestDto(string Cpf, string Senha);
}