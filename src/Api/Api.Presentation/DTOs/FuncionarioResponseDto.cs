namespace Api.Presentation.DTOs
{
    public record FuncionarioResponseDto(
        string Cpf,
        string Nome,
        string Email,
        decimal Salario,
        int IdCargo
    );
}