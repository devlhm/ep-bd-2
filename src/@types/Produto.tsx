export interface Produto {
    idProduto: number;
    nome: string;
    quantidadeEmEstoque: number;
    prateleira: string;
    corredor: string;
    validade: Date;
    valorUnitario: number;
    status?: string;
}