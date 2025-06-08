namespace Api.Presentation.DTOs
{
    public record ResumoFinanceiroDto(
        decimal ReceitaTotal,
        decimal DespesasTotais,
        decimal Lucro,
        DateTime PeriodoInicio,
        DateTime PeriodoFim
    );
}