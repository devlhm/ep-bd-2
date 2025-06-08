namespace Api.Domain.Models;

public class ItemCompra
{
    public int IdCompra { get; set; } // FK
    public int IdProduto { get; set; } // FK
    public int QuantidadeComprada { get; set; }

    // Propriedade de navegação para o produto associado (opcional, mas útil)
    public Produto Produto { get; set; }
}