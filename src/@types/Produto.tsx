export interface Produto {
    id_produto: number;
    nome: string;
    quantidade_em_estoque: number;
    prateleira: string;
    corredor: string;
    validade: Date;
    valor_unitario: number;
}