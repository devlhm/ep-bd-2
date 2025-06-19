export interface Compra {
    cpfCliente?: string;
    itens: Array<{
        idProduto: number;
        quantidadeComprada: number;
    }>;
}