namespace Api.Domain.Models;

public class Produto
{
    public int IdProduto { get; set; } // PK
    public string Nome { get; set; }
    public int QuantidadeEmEstoque { get; set; }
    public string Prateleira { get; set; }
    public string Corredor { get; set; }
    public DateTime Validade { get; set; }
    public decimal ValorUnitario { get; set; }
}