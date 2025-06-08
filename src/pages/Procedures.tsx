import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from "primereact/calendar";
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import "primeicons/primeicons.css";


import "primereact/resources/themes/lara-light-pink/theme.css";
import "primereact/resources/primereact.min.css";
import { formatCPF, formatCurrency, getProcedureNames, removeDotDash } from '../Helpers';
import { InputText } from 'primereact/inputtext';
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

export interface Procedure {
    id: any;
    idFatura: any;
    nome: string;
    valor: number;
    cpfProfissional: string;
    data: any;
    hora: any;
    cpfCliente: string;
}

const Procedures: React.FC = () => {
    let emptyProcedure: Procedure = {
        id: null,
        idFatura: null,
        nome: "",
        valor: 0,
        cpfProfissional: "",
        data: moment().toDate(),
        hora: moment("12:00", "HH:mm").toDate(),
        cpfCliente: ""
    };

    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [procedure, setProcedure] = useState<Procedure>(emptyProcedure);
    const [deleteProcedureDialog, setDeleteProcedureDialog] = useState<boolean>(false);
    const [procedureDialog, setProcedureDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const [filters, setFilters] = useState({
        nome: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        cpfCliente: { value: null, matchMode: FilterMatchMode.EQUALS },
        cpfProfissional: { value: null, matchMode: FilterMatchMode.EQUALS },
        data: { value: null, matchMode: FilterMatchMode.DATE_IS },
        hora: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const fetchProcedures = async () => {
        try {
            const response = await axios.get<Procedure[]>('http://localhost:5155/procedure');

            const mapped = response.data.map((procedure) => {
                procedure.data = moment(procedure.data).toDate();

                return procedure;
            });

            setProcedures(mapped);
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
        fetchProcedures();
    }, []);

    if (loading) {
        return < Loading />;
    }

    if (error) {
        console.log(error);
        return <ErrorMessage />;
    }

    const dateBodyTemplate = (rowData: Procedure) => {
        return rowData.data.toLocaleDateString("pt-BR", {
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

    const confirmDeleteProcedure = (procedure: Procedure) => {
        setProcedure(procedure);
        setDeleteProcedureDialog(true);
    };

    const actionBodyTemplate = (rowData: Procedure) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2 bg-green-500 text-white"
                    onClick={() => editProcedure(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning bg-red-500 text-white"
                    onClick={() => confirmDeleteProcedure(rowData)}
                />
            </>
        );
    };

    const saveProcedure = async () => {
        setSubmitted(true);

        var reqBody = { ...procedure };

        console.log(typeof reqBody.hora);

        reqBody.cpfCliente = removeDotDash(reqBody.cpfCliente);
        reqBody.cpfProfissional = removeDotDash(reqBody.cpfProfissional);

        reqBody.data = moment(reqBody.data).format("YYYY-MM-DD").toString() + "T00:00:00.000Z";

        if (reqBody.hora instanceof Date)
            reqBody.hora = moment(reqBody.hora).format("HH:mm:ss").toString();

        console.log("reqBody:")

        console.log(reqBody);
        if (procedure!.nome.trim()) {
            if (procedure.id) {
                try {
                    await axios.put(`http://localhost:5155/procedure/`, reqBody);
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
                    await axios.post(`http://localhost:5155/procedure`, reqBody);
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

            await fetchProcedures();

            toast.current!.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Procedimento salvo",
                life: 3000
            });

            setProcedureDialog(false);
            setProcedure(emptyProcedure);
        }
    };

    const procedureDialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text mr-3 p-3"
                onClick={() => setProcedureDialog(false)}
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                className="p-button-text p-3"
                onClick={saveProcedure}
            />
        </>
    );

    const editProcedure = (procedure: Procedure) => {
        setProcedure({ ...procedure });
        setProcedureDialog(true);
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || "";
        let _procedure: any = { ...procedure! };
        _procedure[`${name}`] = val;

        setProcedure(_procedure);
    };

    const onDateInputChange = (e: any, name: string) => {
        let _procedure: any = { ...procedure };
        _procedure[`${name}`] = e.value;

        setProcedure(_procedure);
    }

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        let _procedure: any = { ...procedure };
        _procedure[`${name}`] = val;

        setProcedure(_procedure);
    };

    const deleteProcedure = (procedure: Procedure) => {
        setProcedures(procedures.filter((val) => val.id !== procedure.id));
        setDeleteProcedureDialog(false);
        setProcedure(emptyProcedure);
        try {
            axios.delete(`http://localhost:5155/procedure/${procedure.id}`);
        } catch (error: any) {
            throw new Error(error.message)
        } finally {
            toast.current!.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Procedimento apagado",
                life: 3000
            });
        }
    }

    const valueBodyTemplate = (rowData: Procedure) => {
        return formatCurrency(rowData.valor);
    }

    const cpfProfissionalBodyTemplate = (rowData: Procedure) => {
        return formatCPF(rowData.cpfProfissional);
    }

    const cpfClienteBodyTemplate = (rowData: Procedure) => {
        return formatCPF(rowData.cpfCliente);
    }

    return (
        <div className='flex flex-col self-center justify-self-center w-full h-full bg-white'>
            <Toast ref={toast} />
            <DataTable sortField='data' className='w-full h-full' sortOrder={-1} dataKey='id' scrollable scrollHeight='100vh' filterDisplay='menu' filters={filters} value={procedures}>
                <Column filter sortable field='nome' header='Nome' />
                <Column sortable field='valor' body={valueBodyTemplate} header='Valor' />
                <Column filter sortable field='cpfProfissional' body={cpfProfissionalBodyTemplate} header='CPF do Profissional' />
                <Column filter sortable filterField='data' dataType="date" body={dateBodyTemplate} filterElement={dateFilterTemplate}
                    header='Data' />
                <Column filter sortable field='hora' body={(rowData: Procedure) => rowData.hora.substring(0, 5)} header='Hora' />
                <Column filter sortable field='cpfCliente' header='CPF do Cliente' body={cpfClienteBodyTemplate} />
                <Column body={actionBodyTemplate} header="Ações" />
            </DataTable>

            <DeleteConfirmationDialog 
                visible={deleteProcedureDialog}
                onHide={() => setDeleteProcedureDialog(false)}
                onConfirm={() => deleteProcedure(procedure!)}
                confirmationMessage="Você tem certeza que quer apagar esse procedimento?"
            />

            <Dialog
                visible={procedureDialog}
                style={{ width: "450px" }}
                header="Detalhes do procedimento"
                modal
                className="p-fluid"
                footer={procedureDialogFooter}
                onHide={() => setProcedureDialog(false)}
            >
                <div className="grid grid-cols-5 gap-x-2">
                    <div className="field mb-3 col-span-3">
                        <label htmlFor="cpfCliente">CPF do Cliente</label>
                        <InputMask
                            id="cpfCliente"
                            value={procedure!.cpfCliente}
                            disabled={procedure.id ? true : false}
                            onChange={(e) => onInputChange(e, "cpfCliente")}
                            required
                            mask='999.999.999-99'
                            className={classNames({ "p-invalid": submitted && !procedure!.cpfCliente }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !procedure!.nome && (
                            <small className="p-error">Preencha o nome.</small>
                        )}
                    </div>
                    <div className="field mb-3 col-span-2">
                        <label htmlFor="valor" className=''>Valor</label>
                        <InputNumber
                            id="valor"
                            value={procedure!.valor}
                            onChange={(e) => onInputNumberChange(e, "valor")}
                            required
                            mode='currency'
                            currency='BRL'
                            locale='pt-BR'
                            className={classNames({ "p-invalid": submitted && !procedure!.valor }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !procedure!.valor && (
                            <small className="p-error">Preencha o valor.</small>
                        )}
                    </div>
                </div>
                <div className="field mb-3">
                    <label htmlFor="nome">Nome</label>
                    <Dropdown
                        id="nome"
                        value={procedure!.nome}
                        onChange={(e) => onInputChange(e, "nome")}
                        required
                        className={classNames({ "p-invalid": submitted && !procedure!.nome }, 'p-3 border-2 rounded-lg')}
                        options={getProcedureNames()}
                    />
                    {submitted && !procedure!.nome && (
                        <small className="p-error">Preencha o nome.</small>
                    )}
                </div>
                <div className="field mb-3">
                    <label htmlFor="cpfProfissional">CPF do Profissional</label>
                    <InputMask
                        id="cpfProfissional"
                        value={procedure!.cpfProfissional}
                        onChange={(e) => onInputChange(e, "cpfProfissional")}
                        required
                        mask='999.999.999-99'
                        className={classNames({ "p-invalid": submitted && !procedure!.cpfProfissional }, 'p-3 border-2 rounded-lg')}
                    />
                    {submitted && !procedure!.cpfProfissional && (
                        <small className="p-error">Preencha o CPF do profissional.</small>
                    )}
                </div>
                <div className="grid grid-cols-5 gap-x-2">
                    <div className="field mb-3 col-span-3">
                        <label htmlFor="data">Data</label>
                        <Calendar
                            id="data"
                            dateFormat='dd/mm/yy'
                            value={procedure!.data}
                            onChange={(e) => onDateInputChange(e, "data")}
                            required
                            minDate={new Date()}
                            className={classNames({ "p-invalid": submitted && !procedure!.data }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && procedure.data == (
                            <small className="p-error">Preencha a data.</small>
                        )}
                    </div>
                    <div className="field mb-3 col-span-2">
                        <label htmlFor="hora">Hora</label>
                        <Calendar
                            timeOnly
                            id="hora"
                            value={moment(procedure!.hora, "HH:mm").toDate()}
                            onChange={(e) => onInputChange(e, "hora")}
                            required
                            className={classNames({ "p-invalid": submitted && !procedure!.hora }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !procedure!.hora && (
                            <small className="p-error">Preencha a hora.</small>
                        )}
                    </div>
                </div>

            </Dialog>

            <Button
                icon="pi pi-plus"
                className="p-button-rounded p-button-success p-button-lg bg-blue-500 text-white fixed bottom-5 right-5"
                onClick={() => {
                    setProcedure(emptyProcedure);
                    setSubmitted(false);
                    setProcedureDialog(true);
                }}
            />
        </div>
    );
};

export default Procedures;