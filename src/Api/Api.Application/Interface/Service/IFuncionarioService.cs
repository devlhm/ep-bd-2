using Api.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Application.Interface.Service
{
    public interface IFuncionarioService
    {
        Task CreateAsync(Funcionario funcionario);
        Task<Funcionario?> GetByCpfAsync(string cpf);
        Task<IEnumerable<Funcionario>> GetAllAsync();
        Task<bool> UpdateAsync(Funcionario funcionario);
    }
}