namespace Api.Domain.Models
{
    // Classe base abstrata com os campos comuns de Pessoa.
    public abstract class Pessoa
    {
        public string Cpf { get; set; } // PK
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Endereco { get; set; }
        public DateTime Aniversario { get; set; }
    }
}