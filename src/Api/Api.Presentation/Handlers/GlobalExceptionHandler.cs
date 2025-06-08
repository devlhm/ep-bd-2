using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Api.Presentation.Handlers
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;
        private readonly IHostEnvironment _environment;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IHostEnvironment environment)
        {
            _logger = logger;
            _environment = environment;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            // Log do erro no servidor para análise da equipe
            _logger.LogError(
                exception, "Ocorreu uma exceção não tratada: {Message}", exception.Message);

            // Criação de uma resposta padronizada para o cliente
            var problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Erro interno do servidor",
                Detail = "Ocorreu um erro inesperado ao processar sua requisição. Por favor, tente novamente mais tarde."
            };

            // Em ambiente de desenvolvimento, adicionamos mais detalhes para facilitar a depuração.
            // Em produção, a mensagem de detalhe é omitida para não expor a infraestrutura.
            if (_environment.IsDevelopment())
            {
                problemDetails.Detail = exception.ToString();
            }

            // Escreve a resposta JSON
            httpContext.Response.StatusCode = problemDetails.Status.Value;
            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            // Retorna 'true' para indicar que a exceção foi tratada.
            return true;
        }
    }
}