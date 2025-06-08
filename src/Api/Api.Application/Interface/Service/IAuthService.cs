namespace Api.Application.Interface.Service
{
    public interface IAuthService
    {
        /// <summary>
        /// Autentica um funcionário e retorna um token JWT se as credenciais forem válidas.
        /// </summary>
        Task<string?> LoginAsync(string cpf, string senha); // <-- CORRIGIDO: Recebe tipos primitivos
    }
}