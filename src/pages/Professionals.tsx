import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-pink/theme.css";
import "primereact/resources/primereact.min.css";
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { formatCPF, formatRg, getProfessionalTypeString, removeDotDash } from '../Helpers';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';

interface Professional {
    cpf: string,
    rg: string,
    nome: string,
    tipo: number,
    crm: string;
    cnec: string;
    registro: string;
}

const Professionals: React.FC = () => {
    let emptyProfessional: Professional = {
        cpf: '',
        rg: '',
        nome: '',
        tipo: 0,
        crm: '',
        cnec: '',
        registro: ''
    };

    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [professional, setProfessional] = useState<Professional>(emptyProfessional);
    const [deleteProfessionalDialog, setDeleteProfessionalDialog] = useState<boolean>(false);
    const [professionalDialog, setProfessionalDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const [filters, setFilters] = useState({
        cpf: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        rg: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
        tipo: { value: null, matchMode: FilterMatchMode.EQUALS },
        registro: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const fetchProfessionals = async () => {
        try {
            const response = await axios.get<Professional[]>('http://localhost:5155/professional');

            setProfessionals(response.data);
        } catch (error) {
            console.log(error);
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
        fetchProfessionals();
    }, []);

    if (loading) {
        return < Loading />;
    }

    if (error) {
        console.log(error);
        return <ErrorMessage />;
    }

    const confirmDeleteProfessional = (professional: Professional) => {
        setProfessional(professional);
        setDeleteProfessionalDialog(true);
    };

    const actionBodyTemplate = (rowData: Professional) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2 bg-green-500 text-white"
                    onClick={() => editProfessional(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning bg-red-500 text-white"
                    onClick={() => confirmDeleteProfessional(rowData)}
                />
            </>
        );
    };

    const saveProfessional = async () => {
        setSubmitted(true);

        var reqBody = { ...professional };
        reqBody.cnec = professional.tipo == 0 ? '' : reqBody.registro;
        reqBody.crm = professional.tipo == 1 ? '' : reqBody.registro;

        reqBody.cpf = removeDotDash(reqBody.cpf);
        reqBody.rg = removeDotDash(reqBody.rg);

        console.log(reqBody);

        if (professional!.nome.trim()) {
            if (update) {
                try {
                    await axios.put(`http://localhost:5155/professional/`, reqBody);
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
                    await axios.post(`http://localhost:5155/professional`, reqBody);
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

            await fetchProfessionals();

            toast.current!.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Profissional salvo",
                life: 3000
            });

            setProfessionalDialog(false);
            setProfessional(emptyProfessional);
        }
    };

    const professionalDialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text mr-3 p-3"
                onClick={() => {
                    setUpdate(false);
                    setProfessionalDialog(false)
                }}
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                className="p-button-text p-3"
                onClick={saveProfessional}
            />
        </>
    );

    const editProfessional = (professional: Professional) => {
        setUpdate(true);
        setProfessional({ ...professional });
        setProfessionalDialog(true);
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || "";
        let _professional: any = { ...professional! };
        _professional[`${name}`] = val;

        setProfessional(_professional);
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        let _professional: any = { ...professional };
        _professional[`${name}`] = val;

        setProfessional(_professional);
    };

    const deleteSupplier = (professional: Professional) => {
        setProfessionals(professionals.filter((val) => val.cpf !== professional.cpf));
        setDeleteProfessionalDialog(false);
        setProfessional(emptyProfessional);
        try {
            axios.delete(`http://localhost:5155/professional/${professional.cpf}`);
        } catch (error: any) {
            throw new Error(error.message)
        } finally {
            toast.current!.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Produto apagado",
                life: 3000
            });
        }
    }

    const typeBodyTemplate = (rowData: Professional) => {
        return getProfessionalTypeString(rowData.tipo);
    }

    const typeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown
            value={options.value}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            options={[
                { label: 'Dermatologista', value: 0 },
                { label: 'Esteticista', value: 1 },
            ]}
        />
    }

    const cpfBodyTemplate = (rowData: Professional) => {
        return formatCPF(rowData.cpf);
    }

    const rgBodyTemplate = (rowData: Professional) => {
        return formatRg(rowData.rg);
    }

    return (
        <div className='flex flex-col self-center justify-self-center w-full h-full bg-white'>
            <Toast ref={toast} />
            <DataTable sortField='data' className='w-full h-full' sortOrder={-1} dataKey='cpf' scrollable scrollHeight='100vh' filterDisplay='menu' filters={filters} value={professionals}>
                <Column filter sortable field='nome' header='Nome' />
                <Column filter sortable field='cpf' body={cpfBodyTemplate} header='CPF' />
                <Column filter sortable field='rg' body={rgBodyTemplate} header='RG' />
                <Column filter sortable field='registro' header='CRM/CNEC' />
                <Column filter sortable field='tipo' filterElement={typeFilterTemplate} body={typeBodyTemplate} header='Tipo' />
                <Column body={actionBodyTemplate} header="Ações" />
            </DataTable>

            <DeleteConfirmationDialog
                visible={deleteProfessionalDialog}
                onHide={() => setDeleteProfessionalDialog(false)}
                onConfirm={() => deleteSupplier(professional!)}
                confirmationMessage="Você tem certeza que quer apagar esse profissional?"
            />

            <Dialog
                visible={professionalDialog}
                style={{ width: "450px" }}
                header="Detalhes do profissional"
                modal
                className="p-fluid"
                footer={professionalDialogFooter}
                onHide={() => {
                    setUpdate(false);
                    setProfessionalDialog(false);
                }}
            >
                <div className="field mb-3">
                    <label htmlFor="nome">Nome</label>
                    <InputText
                        id="nome"
                        value={professional!.nome}
                        onChange={(e) => onInputChange(e, "nome")}
                        required
                        className={classNames({ "p-invalid": submitted && !professional!.nome }, 'p-3 border-2 rounded-lg')}
                    />
                    {submitted && !professional!.nome && (
                        <small className="p-error">Preencha o nome.</small>
                    )}
                </div>
                <div className="field mb-3">
                    <label htmlFor="tipo">Tipo</label>
                    <Dropdown
                        value={professional!.tipo}
                        className={classNames({ "p-invalid": submitted && !professional!.tipo }, 'p-3 border-2 rounded-lg')}
                        options={[
                            { label: 'Dermatologista', value: 0 },
                            { label: 'Esteticista', value: 1 },
                        ]}
                    />
                    {submitted && !professional!.tipo && (
                        <small className="p-error">Preencha o tipo.</small>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-x-3">

                    <div className="field mb-3">
                        <label htmlFor="cpf">CPF</label>
                        <InputMask
                            id="cpf"
                            value={professional!.cpf}
                            mask='999.999.999-99'
                            onChange={(e) => onInputChange(e, "cpf")}
                            disabled={update}
                            required
                            className={classNames({ "p-invalid": submitted && !professional!.cpf }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !professional!.cpf && (
                            <small className="p-error">Preencha o CPF.</small>
                        )}
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="rg">RG</label>
                        <InputMask
                            id="rg"
                            value={professional!.rg}
                            onChange={(e) => onInputChange(e, "rg")}
                            required
                            mask="99.999.999-*"
                            className={classNames({ "p-invalid": submitted && !professional!.rg }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !professional!.rg && (
                            <small className="p-error">Preencha o RG.</small>
                        )}
                    </div>
                </div>
                <div className="field mb-3">
                    <label htmlFor="registro">CRM/CNEC</label>
                    <InputText
                        value={professional!.registro}
                        onChange={(e) => onInputChange(e, "registro")}
                        required
                        pattern='[0-9]+'
                        className={classNames({ "p-invalid": submitted && !professional!.registro }, 'p-3 border-2 rounded-lg')}
                    />
                    {submitted && !professional!.registro && (
                        <small className="p-error">Preencha o CRM/CNEC.</small>
                    )}
                </div>

            </Dialog>

            <Button
                icon="pi pi-plus"
                className="p-button-rounded p-button-success p-button-lg bg-blue-500 text-white fixed bottom-5 right-5"
                onClick={() => {
                    setProfessional(emptyProfessional);
                    setSubmitted(false);
                    setProfessionalDialog(true);
                }}
            />
        </div>
    );
};

export default Professionals;