namespace Api.Domain.Models;

public class Compra
{
    public int IdCompra { get; set; }
        
    // A propriedade agora é anulável (string?) para corresponder ao BD
    public string? CpfCliente { get; set; } // FK

    public decimal ValorTotal { get; set; }
    public DateTime Data { get; set; }
    public List<ItemCompra> Itens { get; set; } = new List<ItemCompra>();
}