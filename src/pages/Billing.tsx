import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../Helpers';

interface IBilling {
    total: number;
    productTotal: number;
    procedureTotal: number;
    productBilling: MonthBilling[];
    procedureBilling: MonthBilling[];
}

interface MonthBilling {
    month: Date | string;
    total: number;
}

interface JoinedMonthBilling {
    month: Date | string;
    totalProcedure: number;
    totalProduct: number;
}

const Billing: React.FC = () => {

    const [billing, setBilling] = useState<IBilling>({} as IBilling);
    const [joinedBillings, setJoinedBillings] = useState<JoinedMonthBilling[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBillings = async () => {
        try {
            const response = await axios.get<IBilling>('http://localhost:5155/billing');

            const mapped = {
                total: response.data.total,
                productTotal: response.data.productTotal,
                procedureTotal: response.data.procedureTotal,
                productBilling: response.data.productBilling.map((item) => ({
                    month: moment(item.month).format('MM/yy'),
                    total: item.total
                })),
                procedureBilling: response.data.procedureBilling.map((item) => ({
                    month: moment(item.month).format('MM/yy'),
                    total: item.total
                }))
            };

            var joined: JoinedMonthBilling[] = [];

            for (let i = 0; i < mapped.productBilling.length; i++) {
                joined.push({
                    month: mapped.productBilling[i].month,
                    totalProcedure: mapped.procedureBilling[i].total,
                    totalProduct: mapped.productBilling[i].total
                });
            }

            console.log(joined);

            setBilling(mapped);
            setJoinedBillings(joined);
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
        fetchBillings();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        console.log(error);
        return <ErrorMessage />;
    }

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className='w-5/6'>
                <h2 className="text-center text-4xl mb-8">Faturamento Mensal</h2>
                <div className="w-full h-4/6 p-5 bg-white rounded-lg shadow-md">
                    <ResponsiveContainer>
                        <BarChart data={joinedBillings} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <Tooltip />
                            <YAxis />
                            <XAxis dataKey="month" />
                            <Bar dataKey="totalProduct" fill="#8884d8" />
                            <Bar dataKey="totalProcedure" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-7 bg-white rounded-lg shadow-md p-2 text-center text-xl">
                        <p>Faturamento total: {formatCurrency(billing.total)}</p>
                        <p style={{ color: "#8884d8" }}>Faturamento total dos produtos: {formatCurrency(billing.productTotal)}</p>
                        <p style={{ color: "#82ca9d" }}>Faturamento total dos procedimentos: {formatCurrency(billing.procedureTotal)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Billing;