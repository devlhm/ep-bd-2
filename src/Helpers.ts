export function formatCPF(cpf: string): string {
    // Remove any non-numeric characters
    cpf = cpf.replace(/\D/g, '');

    // Check if the CPF has 11 digits
    if (cpf.length !== 11) {
        throw new Error('Invalid CPF length');
    }

    // Format the CPF
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatDate(date: string): string {
    // Check if the date has the format yyyy-mm-dd
    date = date.split('T')[0];

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error('Invalid date format');
    }

    // Format the date
    return date.split('-').reverse().join('/');
}

export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const getProcedureNames: () => string[] = () => [
        'Limpeza de Pele',
        'Peeling',
        'Drenagem Linfática',
        'Radiofrequência',
        'Peeling Químico',
        'Microagulhamento',
        'Lifting Facial',
        'Laser Fracionado',
        'Hidratação Facial'
    ];

export const getProductTypes: () => string[] = () => 
    [
        'Cosmético',
        'Capilar',
        'Perfume'
    ];

export const getFunctionalities: () => string[] = () => ['Limpeza',
        'Nutrição',
        'Brilho',
        'Proteção UV',
        'Hidratação',
        'Rejuvenescimento',
        'Relaxamento',
        'Anti-idade',
        'Purificação',
        'Aromaterapia',
        'Tratamento'];

export const getProfessionalTypes: () => string[] = () => ['Dermatologista', 'Esteticista'];

export function getProfessionalTypeString(type: number) {
    if (type == 0)
        return 'Dermatologista';
    else if (type == 1)
        return 'Esteticista';

    else
        return 'Inválido';
}

export function formatRg(rg: string): string {
    // Format the RG
    return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
}

export const removeDotDash: (str: string) => string = (str: string) => str.replace(/[.-]/g, '');

export function getInvoiceStatus(status: number): string {
    if (status == 0)
        return 'Aberta';
    else if (status == 1)
        return 'Fechada';
    else
        return 'Paga';
}