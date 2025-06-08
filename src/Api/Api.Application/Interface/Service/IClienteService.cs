using Api.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Interface.Service
{
    /// <summary>
    /// Contrato para o serviço de negócio de Clientes.
    /// </summary>
    public interface IClienteService
    {
        Task CreateAsync(Cliente cliente);
        Task<IEnumerable<Cliente>> GetAllAsync();
        Task<Cliente?> GetByCpfAsync(string cpf);
        Task<bool> UpdateAsync(Cliente cliente);
        Task<bool> DeleteAsync(string cpf);
    }
}