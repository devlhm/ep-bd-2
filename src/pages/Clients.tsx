import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from "primereact/calendar";
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import "primeicons/primeicons.css";


import "primereact/resources/themes/lara-light-pink/theme.css";
import "primereact/resources/primereact.min.css";
import { formatCPF, formatCurrency, formatRg, getProcedureNames, removeDotDash } from '../Helpers';
import { FilterMatchMode } from 'primereact/api';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { InputText } from 'primereact/inputtext';
import InvoicesView from '../components/InvoicesView';

export interface Client {
    cpf: string,
    rg: string,
    nome: string,
    dataNascimento: string | Date | null
}

const Clients: React.FC = () => {
    let emptyClient: Client = {
        cpf: "",
        rg: "",
        nome: "",
        dataNascimento: null
    };

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [client, setClient] = useState<Client>(emptyClient);
    const [deleteClientDialog, setDeleteClientDialog] = useState<boolean>(false);
    const [clientDialog, setClientDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [invoicesDialog, setInvoicesDialog] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const [filters, setFilters] = useState({
        nome: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        cpf: { value: null, matchMode: FilterMatchMode.EQUALS },
        rg: { value: null, matchMode: FilterMatchMode.EQUALS },
        dataNascimento: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });

    const fetchClients = async () => {
        try {
            const response = await axios.get<Client[]>('http://localhost:5155/client');

            const mapped = response.data.map((client) => {
                client.dataNascimento = moment(client.dataNascimento).toDate();

                return client;
            });

            setClients(mapped);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || 'Ocorreu um erro inesperado');
            } else {
                setError('Ocorreu um erro inesperado');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    if (loading) {
        return < Loading />;
    }

    if (error) {
        console.log(error);
        return <ErrorMessage />;
    }

    const dateBodyTemplate = (rowData: Client) => {
        return (rowData.dataNascimento! as Date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar
            value={options.value}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
            mask="99/99/9999"
        />
    }

    const confirmDeleteClient = (client: Client) => {
        setClient(client);
        setDeleteClientDialog(true);
    };

    const showInvoices = (client: Client) => {
        setClient(client);
        setInvoicesDialog(true);
    };

    const actionBodyTemplate = (rowData: Client) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2 bg-green-500 text-white"
                    onClick={() => editClient(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning mr-2 bg-red-500 text-white"
                    onClick={() => confirmDeleteClient(rowData)}
                />
                <Button
                    icon="pi pi-file"
                    className="p-button-rounded p-button-warning bg-yellow-500 text-white"
                    onClick={() => showInvoices(rowData)}
                />
            </>
        );
    };

    const saveClient = async () => {
        setSubmitted(true);

        var reqBody = { ...client };

        reqBody.cpf = removeDotDash(reqBody.cpf);
        reqBody.rg = removeDotDash(reqBody.rg);

        if (client!.nome.trim()) {
            if (update) {
                try {
                    await axios.put(`http://localhost:5155/client/`, reqBody);
                    setUpdate(false);
                } catch (error: any) {
                    console.log(error)
                    toast.current!.show({
                        severity: "error",
                        summary: "Erro",
                        detail: error.response.data,
                        life: 3000
                    });
                    return;
                }
            }
            else
                try {
                    await axios.post(`http://localhost:5155/client`, reqBody);
                } catch (error: any) {
                    console.log(error);
                    toast.current!.show({
                        severity: "error",
                        summary: "Erro",
                        detail: error.response.data,
                        life: 3000
                    });
                    return;
                }

            await fetchClients();

            toast.current!.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Cliente salvo",
                life: 3000
            });

            setClientDialog(false);
            setClient(emptyClient);
        }
    };

    const clientDialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text mr-3 p-3"
                onClick={() => {
                    setClientDialog(false)
                    setUpdate(false);
                }}
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                className="p-button-text p-3"
                onClick={saveClient}
            />
        </>
    );

    const editClient = (client: Client) => {
        setUpdate(true);
        setClient({ ...client });
        setClientDialog(true);
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || "";
        let _client: any = { ...client! };
        _client[`${name}`] = val;

        setClient(_client);
    };

    const onDateInputChange = (e: any, name: string) => {
        let _client: any = { ...client };
        _client[`${name}`] = e.value;

        setClient(_client);
    }

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        let _client: any = { ...client };
        _client[`${name}`] = val;

        setClient(_client);
    };

    const deleteClient = (client: Client) => {
        setClients(clients.filter((val) => val.cpf !== client.cpf));
        setDeleteClientDialog(false);
        setClient(emptyClient);
        try {
            axios.delete(`http://localhost:5155/client/${client.cpf}`);
        } catch (error: any) {
            throw new Error(error.message)
        } finally {
            toast.current!.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Cliente apagado",
                life: 3000
            });
        }
    }

    const cpfBodyTemplate = (rowData: Client) => {
        return formatCPF(rowData.cpf);
    }

    const rgBodyTemplate = (rowData: Client) => {
        return formatRg(rowData.rg);
    }

    return (
        <div className='flex flex-col self-center justify-self-center w-full h-full bg-white'>
            <Toast ref={toast} />
            <DataTable sortField='data' className='w-full h-full' sortOrder={-1} dataKey='cpf' scrollable scrollHeight='100vh' filterDisplay='menu' filters={filters} value={clients}>
                <Column filter sortable field='nome' header='Nome' />
                <Column filter sortable field='cpf' body={cpfBodyTemplate} header='CPF' />
                <Column filter sortable field='rg' body={rgBodyTemplate} header='RG' />
                <Column filter sortable field='dataNascimento' dataType="date" body={dateBodyTemplate} filterElement={dateFilterTemplate}
                    header='Data de Nasc.' />
                <Column body={actionBodyTemplate} header="Ações" />
            </DataTable>

            <DeleteConfirmationDialog 
                visible={deleteClientDialog}
                onHide={() => setDeleteClientDialog(false)}
                onConfirm={() => deleteClient(client!)}
                confirmationMessage="Você tem certeza que quer apagar esse cliente?"
            />

            <Dialog
                visible={clientDialog}
                style={{ width: "450px" }}
                header="Detalhes do cliente"
                modal
                className="p-fluid"
                footer={clientDialogFooter}
                onHide={() => {
                    setUpdate(false);
                    setClientDialog(false); 
                }}
            >
                <div className="field mb-3">
                    <label htmlFor="nome">Nome</label>
                    <InputText
                        id="nome"
                        value={client!.nome}
                        onChange={(e) => onInputChange(e, "nome")}
                        required
                        className={classNames({ "p-invalid": submitted && !client!.nome }, 'p-3 border-2 rounded-lg')}
                    />
                    {submitted && !client!.nome && (
                        <small className="p-error">Preencha o nome.</small>
                    )}
                </div>
                <div className="grid grid-cols-5 gap-x-2">
                    <div className="field mb-3 col-span-3">
                        <label htmlFor="cpf">CPF</label>
                        <InputMask
                            id="cpf"
                            value={client!.cpf}
                            disabled={update}
                            onChange={(e) => onInputChange(e, "cpf")}
                            required
                            mask='999.999.999-99'
                            className={classNames({ "p-invalid": submitted && !client!.cpf }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !client!.cpf && (
                            <small className="p-error">Preencha o CPF.</small>
                        )}
                    </div>
                    <div className="field mb-3 col-span-2">
                        <label htmlFor="rg">RG</label>
                        <InputMask
                            id="rg"
                            value={client!.rg}
                            onChange={(e) => onInputNumberChange(e, "rg")}
                            required
                            mask='99.999.999-*'
                            className={classNames({ "p-invalid": submitted && !client!.rg }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !client!.rg && (
                            <small className="p-error">Preencha o RG.</small>
                        )}
                    </div>
                </div>
                <div className="field mb-3">
                    <label htmlFor="dataNascimento">Date de Nascimento</label>
                    <Calendar
                            id="dataNascimento"
                            dateFormat='dd/mm/yy'
                            value={client!.dataNascimento as Date}
                            onChange={(e) => onDateInputChange(e, "dataNascimento")}
                            required
                            className={classNames({ "p-invalid": submitted && !client!.dataNascimento }, 'p-3 border-2 rounded-lg')}
                        />
                    {submitted && !client!.dataNascimento && (
                        <small className="p-error">Preencha a data de nascimento.</small>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={invoicesDialog}
                style={{ width: "80rem" }}
                header="Faturas do cliente"
                modal
                className="p-fluid"
                onHide={() => {
                    setInvoicesDialog(false); 
                }}
            >
                <InvoicesView client={client} />   
            </Dialog>

            <Button
                icon="pi pi-plus"
                className="p-button-rounded p-button-success p-button-lg bg-blue-500 text-white fixed bottom-5 right-5"
                onClick={() => {
                    setClient(emptyClient);
                    setSubmitted(false);
                    setClientDialog(true);
                }}
            />
        </div>
    );
};

export default Clients;