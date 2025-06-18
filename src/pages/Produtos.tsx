import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-pink/theme.css";
import "primereact/resources/primereact.min.css";
import { formatCurrency, removeDotDash } from '../Helpers';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
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
import Sidebar from '../components/Sidebar/Sidebar';
import { Produto } from '../@types/Produto';
import { Api } from '../hooks/api';

const Produtos: React.FC = () => {
    let emptyProduct: Produto = {
        idProduto: 0,
        nome: "",
        quantidadeEmEstoque: 0,
        prateleira: "",
        corredor: "",
        validade: new Date(),
        valorUnitario: 0
    };

    const [products, setProducts] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Produto>(emptyProduct);
    const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
    const [productDialog, setProductDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [sellProductDialog, setSellProductDialog] = useState<boolean>(false);
    const [sell, setSell] = useState({
        quantity: 1,
        cpf: ''
    });

    const toast = useRef<Toast>(null);

    const [filters, setFilters] = useState({
        nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const getStatus = (qtd: number) => {
        if (qtd == 0)
            return 'INDISPONÍVEL';
        if (qtd < 10)
            return 'BAIXO';
        else {
            return 'OK';
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await Api.fetchProducts();

            const mapped = response.map((product) => {
                product.status = getStatus(product.quantidadeEmEstoque);
                return product;
            });

            setProducts(mapped);
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

    const sendSellProductRequest = async () => {
        setSubmitted(true);
        sell.cpf = removeDotDash(sell.cpf);
        if (sell.cpf.trim()) {
            try {
                await axios.post(`http://localhost:5155/product/sell`, {
                    productId: product.idProduto,
                    quantity: sell.quantity,
                    cpf: sell.cpf
                });
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

            await fetchProducts();

            toast.current!.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Produto vendido",
                life: 3000
            });

            setSellProductDialog(false);
            setSell({ quantity: 1, cpf: '' });
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return < Loading />;
    }

    if (error) {
        console.log(error);
        return <ErrorMessage />;
    }

    const confirmDeleteProduct = (product: Produto) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const sellProduct = (product: Produto) => {
        setProduct(product);
        setSellProductDialog(true);
    }

    const actionBodyTemplate = (rowData: Produto) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2 bg-green-500 text-white"
                    onClick={() => editProduct(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning bg-red-500 text-white"
                    onClick={() => confirmDeleteProduct(rowData)}
                />
                <Button
                    icon="pi pi-shopping-cart"
                    className={classNames('p-button-rounded p-button-info ml-2 bg-blue-500 text-white', { 'p-disabled': rowData.quantidadeEmEstoque === 0 })}
                    disabled={rowData.quantidadeEmEstoque === 0}
                    onClick={() => {
                        setSubmitted(false);
                        setSell({ quantity: 1, cpf: '' });
                        sellProduct(rowData)
                    }}
                />

            </>
        );
    };

    const saveProduct = async () => {
        setSubmitted(true);

        var reqBody = { ...product };

        if (product!.nome.trim()) {
            if (product.idProduto) {
                try {
                    await axios.put(`http://localhost:5155/product/`, reqBody);
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
                    await axios.post(`http://localhost:5155/product`, reqBody);
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

            await fetchProducts();

            toast.current!.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Produto salvo",
                life: 3000
            });

            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const productDialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text mr-3 p-3"
                onClick={() => setProductDialog(false)}
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                className="p-button-text p-3"
                onClick={saveProduct}
            />
        </>
    );

    const sellProductDialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text mr-3 p-3"
                onClick={() => setSellProductDialog(false)}
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                className="p-button-text p-3"
                onClick={sendSellProductRequest}
            />
        </>
    );

    const editProduct = (product: Produto) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const onInputChange = (e: any, name: string) => {
        const val = (e.target && e.target.value) || "";
        let _product: any = { ...product! };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        let _product: any = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputChangeSell = (e: any, name: string) => {
        const val = (e.target && e.target.value) || "";
        let _product: any = { ...sell! };
        _product[`${name}`] = val;

        setSell(_product);
    };

    const onInputNumberChangeSell = (e: any, name: string) => {
        let val = e.value || 0;

        if (name === 'quantity' && val > product.quantidadeEmEstoque)
            val = product.quantidadeEmEstoque;

        let _product: any = { ...sell };
        _product[`${name}`] = val;

        setSell(_product);
    };

    const deleteProduct = (product: Produto) => {
        setProducts(products.filter((val) => val.idProduto !== product.idProduto));
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        try {
            axios.delete(`http://localhost:5155/product/${product.idProduto}`);
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

    const valorUnitarioBodyTemplate = (rowData: Produto) => {
        return formatCurrency(rowData.valorUnitario);
    }

    const qtdBodyTemplate = (rowData: Produto) => {
        return rowData.quantidadeEmEstoque;
    }

    const statusBodyTemplate = (rowData: Produto) => {
        return (
            <span className={classNames('p-tag p-tag-rounded',
                { 'bg-red-500': (rowData.quantidadeEmEstoque == 0) },
                { 'bg-yellow-500': (rowData.quantidadeEmEstoque > 0 && rowData.quantidadeEmEstoque < 10) })}>
                {rowData.status}
            </span>
        );
    }

    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown
            value={options.value}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            options={[
                { label: 'OK', value: 'OK' },
                { label: 'BAIXO', value: 'BAIXO' },
                { label: 'INDISPONÍVEL', value: 'INDISPONÍVEL' }
            ]}
        />
    }

    return (
        <div className='w-full h-full grid justify-center' style={{ gridTemplateColumns: "250px 1fr" }}>
            <Sidebar />
            <div className='flex flex-col self-center justify-self-center w-full h-full bg-white'>
                <Toast ref={toast} />
                <DataTable sortField='data' className='w-full h-full' sortOrder={-1} dataKey='id' scrollable scrollHeight='100vh' filterDisplay='menu' filters={filters} value={products}>
                    <Column filter sortable field='nome' header='Nome' />
                    <Column sortable field='valorUnitario' body={valorUnitarioBodyTemplate} header='Valor Unitário' />
                    <Column filter sortable field='status' body={statusBodyTemplate} filterElement={statusFilterTemplate} header='Status do Estoque' />
                    <Column filter sortable field='quantidade' body={qtdBodyTemplate} header='Qtd' />
                    <Column body={actionBodyTemplate} header="Ações" />
                </DataTable>

                <DeleteConfirmationDialog
                    visible={deleteProductDialog}
                    onHide={() => setDeleteProductDialog(false)}
                    onConfirm={() => deleteProduct(product!)}
                    confirmationMessage="Você tem certeza que quer apagar esse produto?"
                />

                <Dialog
                    visible={productDialog}
                    style={{ width: "450px" }}
                    header="Detalhes do produto"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={() => setProductDialog(false)}
                >
                    <div className="grid grid-cols-5 gap-x-2">
                        <div className="field mb-3 col-span-3">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={product!.nome}
                                onChange={(e) => onInputChange(e, "nome")}
                                required
                                className={classNames({ "p-invalid": submitted && !product!.nome }, 'p-3 border-2 rounded-lg')}
                            />
                            {submitted && !product!.nome && (
                                <small className="p-error">Preencha o nome.</small>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-x-2">
                        <div className="field mb-3">
                            <label htmlFor="valorUnitario">Valor Unitário</label>
                            <InputNumber
                                id="valorUnitario"
                                value={product!.valorUnitario}
                                onChange={(e) => onInputNumberChange(e, "valorUnitario")}
                                required
                                className={classNames({ "p-invalid": submitted && !product!.valorUnitario }, 'p-3 border-2 rounded-lg')}
                            />
                            {submitted && !product!.valorUnitario && (
                                <small className="p-error">Preencha o valor unitário.</small>
                            )}
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="hora">Quantidade</label>
                            <InputNumber
                                id="quantidade"
                                value={product!.quantidadeEmEstoque}
                                onChange={(e) => onInputNumberChange(e, "quantidade")}
                                required
                                className={classNames({ "p-invalid": submitted && !product!.quantidadeEmEstoque }, 'p-3 border-2 rounded-lg')}
                            />
                            {submitted && !product!.quantidadeEmEstoque && (
                                <small className="p-error">Preencha a quantidade.</small>
                            )}
                        </div>
                    </div>

                </Dialog>

                <Dialog
                    visible={sellProductDialog}
                    style={{ width: "450px" }}
                    header="Vender produto"
                    modal
                    className="p-fluid"
                    footer={sellProductDialogFooter}
                    onHide={() => setSellProductDialog(false)}
                >
                    <label htmlFor="cpf">CPF do Cliente</label>
                    <InputMask mask='999.999.999-99' required id="cpf" value={sell.cpf} onChange={(e) => onInputChangeSell(e, "cpf")} className="p-3 border-2 rounded-lg" />
                    {submitted && !sell.cpf && (
                        <small className="p-error">Preencha o CPF do cliente.</small>
                    )}

                    <label htmlFor='quantity' className='mt-3 block'>Quantidade</label>
                    <InputNumber max={product.quantidadeEmEstoque} required value={sell.quantity} onChange={(e) => onInputNumberChangeSell(e, "quantity")} id="quantity" className="p-3 border-2 rounded-lg" />
                    {submitted && !sell.quantity && (
                        <small className="p-error">Preencha a quantidade.</small>
                    )}

                </Dialog>

                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success p-button-lg bg-blue-500 text-white fixed bottom-5 right-5"
                    onClick={() => {
                        setProduct(emptyProduct);
                        setSubmitted(false);
                        setProductDialog(true);
                    }}
                />
            </div>
        </div>
    );
};

export default Produtos;