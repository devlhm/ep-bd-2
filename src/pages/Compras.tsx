import React, { useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import Sidebar from '../components/Sidebar/Sidebar';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { classNames } from 'primereact/utils';
import { ComprasType } from '../@types/ComprasType';

const Compras = () => {
    const [compras, setCompras] = useState<ComprasType[]>([]);
    const [compraDialog, setCompraDialog] = useState(false);
    const [deleteCompraDialog, setDeleteCompraDialog] = useState(false);
    const [compra, setCompra] = useState<ComprasType>({ id: 0, cpf_cliente: '', valor_total: 0, data: '' });
    const [submitted, setSubmitted] = useState(false);
    const [update, setUpdate] = useState(false);
    const [filters, setFilters] = useState({});
    const toast = useRef<Toast>(null);

    const emptyCompra: ComprasType = { id: 0, cpf_cliente: '', valor_total: 0, data: '' };

    const onInputChange = (e: InputMaskChangeEvent | React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = e.target.value;
        setCompra({ ...compra, [name]: val });
    };

    const deleteCompra = (compraToDelete: ComprasType) => {
        setCompras(prev => prev.filter(c => c.id !== compraToDelete.id));
        setDeleteCompraDialog(false);
        toast.current!.show({
            severity: "success",
            summary: "Sucesso",
            detail: "Produto vendido",
            life: 3000
        });
    };

    const compraDialogFooter = (
        <div className="flex justify-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setCompraDialog(false)} />
            <Button label="Salvar" icon="pi pi-check" onClick={() => {
                setSubmitted(true);
                if (compra.cpf_cliente && compra.valor_total && compra.data) {
                    if (!update) {
                        setCompras(prev => [...prev, { ...compra, id_compra: Date.now().toString() }]);
                    }
                    setCompraDialog(false);
                    setCompra(emptyCompra);
                    setSubmitted(false);
                    toast.current!.show({
                        severity: "success",
                        summary: "Sucesso",
                        detail: "Compra salva"
                    });
                }
            }} />
        </div>
    );

    return (
        <div className='w-full h-full grid justify-center' style={{ gridTemplateColumns: "250px 1fr" }}>
            <Sidebar />
            <div className='flex flex-col self-center justify-self-center w-full h-full bg-white'>
                <Toast ref={toast} />
                <DataTable
                    sortField='data'
                    className='w-full h-full'
                    sortOrder={-1}
                    dataKey='id_compra'
                    scrollable
                    scrollHeight='100vh'
                    filterDisplay='menu'
                    filters={filters}
                    value={compras}
                >
                    <Column field='id_compra' header='ID da Compra' sortable />
                    <Column field='cpf_cliente' header='CPF do Cliente' sortable />
                    <Column field='valor_total' header='Valor Total' sortable body={(rowData) => `R$ ${parseFloat(rowData.valor_total).toFixed(2)}`} />
                    <Column field='data' header='Data' sortable />
                    <Column
                        header="Ações"
                        body={(rowData) => (
                            <div className='flex gap-2'>
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-info" onClick={() => {
                                    setCompra(rowData);
                                    setUpdate(true);
                                    setCompraDialog(true);
                                }} />
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {
                                    setCompra(rowData);
                                    setDeleteCompraDialog(true);
                                }} />
                            </div>
                        )}
                    />
                </DataTable>

                <DeleteConfirmationDialog
                    visible={deleteCompraDialog}
                    onHide={() => setDeleteCompraDialog(false)}
                    onConfirm={() => deleteCompra(compra)}
                    confirmationMessage="Você tem certeza que quer apagar essa compra?"
                />

                <Dialog
                    visible={compraDialog}
                    style={{ width: "450px" }}
                    header="Detalhes da Compra"
                    modal
                    className="p-fluid"
                    footer={compraDialogFooter}
                    onHide={() => {
                        setUpdate(false);
                        setCompraDialog(false);
                    }}
                >
                    <div className="field mb-3">
                        <label htmlFor="cpf_cliente">CPF do Cliente</label>
                        <InputMask
                            id="cpf_cliente"
                            value={compra.cpf_cliente}
                            mask='999.999.999-99'
                            onChange={(e) => onInputChange(e, "cpf_cliente")}
                            required
                            className={classNames({ "p-invalid": submitted && !compra.cpf_cliente }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !compra.cpf_cliente && (
                            <small className="p-error">Preencha o CPF.</small>
                        )}
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="valor_total">Valor Total</label>
                        <InputText
                            id="valor_total"
                            value={compra.valor_total.toString()}
                            onChange={(e) => onInputChange(e, "valor_total")}
                            required
                            className={classNames({ "p-invalid": submitted && !compra.valor_total }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !compra.valor_total && (
                            <small className="p-error">Preencha o valor.</small>
                        )}
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="data">Data</label>
                        <InputText
                            id="data"
                            placeholder="DD/MM/AAAA"
                            value={compra.data}
                            onChange={(e) => onInputChange(e, "data")}
                            required
                            className={classNames({ "p-invalid": submitted && !compra.data }, 'p-3 border-2 rounded-lg')}
                        />
                        {submitted && !compra.data && (
                            <small className="p-error">Preencha a data.</small>
                        )}
                    </div>
                </Dialog>

                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success p-button-lg bg-blue-500 text-white fixed bottom-5 right-5"
                    onClick={() => {
                        setCompra(emptyCompra);
                        setSubmitted(false);
                        setCompraDialog(true);
                    }}
                />
            </div>
        </div>
    );
};

export default Compras;
