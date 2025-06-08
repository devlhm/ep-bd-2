import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from "primereact/calendar";
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-pink/theme.css";
import "primereact/resources/primereact.min.css";
import { formatCPF, formatCurrency, getProductTypes, getProcedureNames, getFunctionalities } from '../Helpers';
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

interface Supplier {
    id: any;
    nome: string
}

const Suppliers: React.FC = () => {
    let emptySupplier: Supplier = {
        id: null,
        nome: ''
    };

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [supplier, setSupplier] = useState<Supplier>(emptySupplier);
    const [deleteSupplierDialog, setDeleteSupplierDialog] = useState<boolean>(false);
    const [supplierDialog, setSupplierDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const [filters, setFilters] = useState({
        nome: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get<Supplier[]>('http://localhost:5155/supplier');

            setSuppliers(response.data);
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
        fetchSuppliers();
    }, []);

    if (loading) {
        return < Loading />;
    }

    if (error) {
        console.log(error);
        return <ErrorMessage />;
    }

    const confirmDeleteSupplier = (supplier: Supplier) => {
        setSupplier(supplier);
        setDeleteSupplierDialog(true);
    };

    const actionBodyTemplate = (rowData: Supplier) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2 bg-green-500 text-white"
                    onClick={() => editSupplier(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning bg-red-500 text-white"
                    onClick={() => confirmDeleteSupplier(rowData)}
                />
            </>
        );
    };

    const saveSupplier = async () => {
        setSubmitted(true);

        var reqBody = { ...supplier };

        if (supplier!.nome.trim()) {
            if (supplier.id) {
                try {
                    await axios.put(`http://localhost:5155/supplier/`, reqBody);
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
                    await axios.post(`http://localhost:5155/supplier`, reqBody);
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

            await fetchSuppliers();

            toast.current!.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Fornecedor salvo",
                life: 3000
            });

            setSupplierDialog(false);
            setSupplier(emptySupplier);
        }
    };

    const productDialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text mr-3 p-3"
                onClick={() => setSupplierDialog(false)}
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                className="p-button-text p-3"
                onClick={saveSupplier}
            />
        </>
    );

    const editSupplier = (supplier: Supplier) => {
        setSupplier({ ...supplier });
        setSupplierDialog(true);
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || "";
        let _procedure: any = { ...supplier! };
        _procedure[`${name}`] = val;

        setSupplier(_procedure);
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        let _procedure: any = { ...supplier };
        _procedure[`${name}`] = val;

        setSupplier(_procedure);
    };

    const deleteSupplier = (supplier: Supplier) => {
        setSuppliers(suppliers.filter((val) => val.id !== supplier.id));
        setDeleteSupplierDialog(false);
        setSupplier(emptySupplier);
        try {
            axios.delete(`http://localhost:5155/supplier/${supplier.id}`);
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

    return (
        <div className='flex flex-col self-center justify-self-center w-full h-full bg-white'>
            <Toast ref={toast} />
            <DataTable sortField='data' className='w-full h-full' sortOrder={-1} dataKey='id' scrollable scrollHeight='100vh' filterDisplay='menu' filters={filters} value={suppliers}>
                <Column filter sortable field='nome' header='Nome' />
                <Column body={actionBodyTemplate} header="Ações" />
            </DataTable>

            <DeleteConfirmationDialog
                visible={deleteSupplierDialog}
                onHide={() => setDeleteSupplierDialog(false)}
                onConfirm={() => deleteSupplier(supplier!)}
                confirmationMessage="Você tem certeza que quer apagar esse fornecedor?"
            />

            <Dialog
                visible={supplierDialog}
                style={{ width: "450px" }}
                header="Detalhes do fornecedor"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={() => setSupplierDialog(false)}
            >
                <div className="field mb-3">
                    <label htmlFor="nome">Nome</label>
                    <InputText
                        id="nome"
                        value={supplier!.nome}
                        onChange={(e) => onInputChange(e, "nome")}
                        required
                        className={classNames({ "p-invalid": submitted && !supplier!.nome }, 'p-3 border-2 rounded-lg')}
                    />
                    {submitted && !supplier!.nome && (
                        <small className="p-error">Preencha o nome.</small>
                    )}
                </div>

            </Dialog>

            <Button
                icon="pi pi-plus"
                className="p-button-rounded p-button-success p-button-lg bg-blue-500 text-white fixed bottom-5 right-5"
                onClick={() => {
                    setSupplier(emptySupplier);
                    setSubmitted(false);
                    setSupplierDialog(true);
                }}
            />
        </div>
    );
};

export default Suppliers;