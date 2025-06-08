namespace Api.Domain.Models;

public class Funcionario : Pessoa
{
    public decimal Salario { get; set; }
    public string Senha { get; set; } // Importante: Devemos armazenar o hash da senha, não o texto.
    public int IdCargo { get; set; } // FK para 'Cargo'
}