import React, { useEffect, useState } from 'react';
import { Client } from '../pages/Clients';
import axios from 'axios';
import moment from 'moment';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { getInvoiceStatus } from '../Helpers';
import { Product } from '../pages/Products';
import { Procedure } from '../pages/Procedures';
import { classNames } from 'primereact/utils';

interface InvoicesViewProps {
    client: Client
}

interface InvoiceProduct {
    product: Product,
    quantity: number,
    total: number
}

interface InvoiceProductEntries {
    products: InvoiceProduct[]
    procedures: Procedure[]
}

interface Invoice {
    id: number,
    dataEmissao: string | Date | null,
    dataVencimento: string | Date | null,
    dataPagamento: string | Date | null,
    total: number,
    cpfCliente: string,
    formaPagamento: string,
    status: number,
    entries: InvoiceProductEntries
}

const InvoicesView: React.FC<InvoicesViewProps> = (props: InvoicesViewProps) => {

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedInvoice, setExpandedInvoice] = useState<number | null>(null);

    const createInvoice = async () => {
        try {
            const response = await axios.post<Invoice>(`http://localhost:5155/invoice/${props.client.cpf}`);

            setInvoices([response.data, ...invoices]);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || 'Ocorreu um erro inesperado');
            } else {
                setError('Ocorreu um erro inesperado');
            }
        }
    }

    const closeInvoice = async(invoiceId: number) => {
        try {
            await axios.put<Invoice>(`http://localhost:5155/invoice/updateStatus`, {
                invoiceId: invoiceId,
                status: 1
            });

            var invoice = invoices.find(i => i.id === invoiceId);
            if (invoice) {
                invoice.status = 1;
                setInvoices([...invoices]);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || 'Ocorreu um erro inesperado');
            } else {
                setError('Ocorreu um erro inesperado');
            }
        }
    }

    const fetchInvoices = async () => {
        try {
            const response = await axios.get<Invoice[]>(`http://localhost:5155/invoice/${props.client.cpf}`);

            const mapped = response.data.map((invoice) => {
                if (invoice.dataEmissao)
                    invoice.dataEmissao = moment(invoice.dataEmissao).toDate();
                if (invoice.dataVencimento)
                    invoice.dataVencimento = moment(invoice.dataVencimento).toDate();
                if (invoice.dataPagamento)
                    invoice.dataPagamento = moment(invoice.dataPagamento).toDate();

                return invoice;
            });

            mapped.sort((a, b) => a.status - b.status);

            setInvoices(mapped);
            console.log(mapped);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || 'Ocorreu um erro inesperado');
            } else {
                setError('Ocorreu um erro inesperado');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInvoices();
    }, [props.client]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        console.log(error);
        return <ErrorMessage />;
    }

    return (
        <div className='flex flex-col'>
            {invoices.map((invoice) => (
                <div key={invoice.id} className="bg-zinc-100 shadow-md rounded-md mb-4">
                    <div className="flex justify-between p-4 cursor-pointer" onClick={() => setExpandedInvoice(expandedInvoice === invoice.id ? null : invoice.id)}>
                        <div>
                            <h3 className="text-xl font-semibold">Emissão: {moment(invoice.dataEmissao).format('DD/MM/YYYY')}</h3>
                            <p className="text-md text-gray-500">Vencimento: {moment(invoice.dataVencimento).format('DD/MM/YYYY')}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">R$ {invoice.total.toFixed(2)}</h3>
                            <p className="text-md text-gray-500">{getInvoiceStatus(invoice.status)}</p>
                            <p className="text-md text-gray-500">{invoice.formaPagamento} {invoice.status == 2 && `- ${invoice.dataPagamento!.toLocaleString().split(",")[0]}`}</p>
                        </div>
                    </div>
                    {invoice.entries != null && (invoice.entries.procedures.length > 0 || invoice.entries.products.length > 0) && (
                        <div
                            className={`rounded-b-md overflow-hidden transition-max-height ease-linear duration-1000 ${expandedInvoice === invoice.id ? 'max-h-screen' : 'max-h-0'}`}
                        >
                            <div className="p-5 bg-white flex flex-col">
                                {invoice.entries.products.length > 0 && <>
                                    <h2 className="text-lg font-semibold">Produtos</h2>
                                    <ul>
                                        {invoice.entries.products.map((entry) => (
                                            <>
                                                <li key={entry.product.id} className="flex justify-between">
                                                    <p>{entry.product.nome}</p>
                                                    <p>{entry.quantity > 0 && (<>{entry.quantity} x </>)}R$ {entry.product.valorUnitario.toFixed(2)} = R$ {entry.total.toFixed(2)}</p>
                                                </li>
                                            </>
                                        ))}
                                    </ul>
                                    <hr className="my-4" />
                                </>}
                                {invoice.entries.procedures.length > 0 && <>
                                    <h3 className="text-lg font-semibold">Procedimentos</h3>
                                    <ul>
                                        {invoice.entries.procedures.map((entry) => (
                                            <li key={entry.id} className="flex justify-between">
                                                <p>{entry.nome}</p>
                                                <p>R$ {entry.valor.toFixed(2)}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </>}
                                {invoice.status === 0 && (<>
                                    <hr className="mt-4" />
                                    <button
                                        className="bg-red-500 text-white shadow-md rounded-md px-4 py-2 mt-4 self-end"
                                        onClick={() => closeInvoice(invoice.id)}
                                    >Fechar fatura</button>
                                </>)}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <button
                className={classNames("bg-blue-500 text-white shadow-md rounded-md px-5 py-3 max-w-fit self-end text-center"
                    , { 'cursor-not-allowed bg-gray-300': invoices[0].status === 0 }
                )}
                disabled={invoices[0].status === 0}
                onClick={createInvoice}
            >Abrir fatura</button>
        </div>
    );
}

export default InvoicesView;