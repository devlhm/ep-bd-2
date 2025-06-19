// src/components/Dashboard.tsx
import React from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import Sidebar from "../components/Sidebar/Sidebar";

type Venda = {
    id: string;
    cpf_cliente: string;
    valor_total: number;
    data: string; // formato ISO ou "YYYY-MM-DD"
};

// Exemplo de dados de vendas (pode vir via props ou API)
const vendas: Venda[] = [
    { id: "1", cpf_cliente: "12345678900", valor_total: 200, data: "2025-06-01" },
    { id: "2", cpf_cliente: "12345678900", valor_total: 350, data: "2025-06-01" },
    { id: "3", cpf_cliente: "98765432100", valor_total: 500, data: "2025-06-02" },
    { id: "4", cpf_cliente: "98765432100", valor_total: 250, data: "2025-06-03" },
];

// Agrupar vendas por data
const vendasPorDia = vendas.reduce<Record<string, number>>((acc, venda) => {
    const dia = venda.data;
    acc[dia] = (acc[dia] || 0) + venda.valor_total;
    return acc;
}, {});

const dadosVendas = Object.entries(vendasPorDia).map(([data, total]) => ({
    data,
    total,
}));

// Dados fictícios para despesas e lucro
const dadosFicticios = [
    { data: "2025-06-01", valor: 300 },
    { data: "2025-06-02", valor: 200 },
    { data: "2025-06-03", valor: 150 },
];

const dadosLucro = dadosVendas.map((venda, index) => ({
    data: venda.data,
    valor: venda.total - (dadosFicticios[index]?.valor || 0),
}));

const Dashboard: React.FC = () => {
    return (
        <div className='w-full h-full grid justify-center' style={{ gridTemplateColumns: "250px 1fr" }}>
            <Sidebar />

            <div className="p-6 grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gráfico de Vendas */}
                    <div className="bg-white rounded-2xl shadow-md p-4">
                        <h2 className="text-xl font-semibold mb-4">Vendas</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dadosVendas}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="data" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfico de Despesas */}
                    <div className="bg-white rounded-2xl shadow-md p-4">
                        <h2 className="text-xl font-semibold mb-4">Despesas</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dadosFicticios}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="data" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="valor" stroke="#f97316" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Lucro */}
                <div className="bg-white rounded-2xl shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Lucro</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dadosLucro}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="data" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="valor" stroke="#10b981" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
