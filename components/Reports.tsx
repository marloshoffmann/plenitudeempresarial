
import React from 'react';
import { AssessmentResult } from '../types';

interface ReportItem {
    id: string;
    created_at: string;
    disc_results: any;
    values_results: any;
}

interface ReportsProps {
    assessments: ReportItem[];
    onViewReport: (results: AssessmentResult) => void;
}

const Reports: React.FC<ReportsProps> = ({ assessments, onViewReport }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <i className="fas fa-history text-slate-400"></i>
                    Histórico de Avaliações
                </h2>
            </div>

            {assessments.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">
                    <i className="fas fa-clipboard-list text-5xl text-zinc-800 mb-4"></i>
                    <p className="text-slate-500">Você ainda não realizou nenhuma avaliação.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {assessments.map((item) => (
                        <div
                            key={item.id}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center hover:border-zinc-700 transition-all group"
                        >
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors">
                                    <i className="fas fa-file-alt text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Relatório DNA Comportamental</h3>
                                    <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => onViewReport({ disc: item.disc_results, values: item.values_results })}
                                className="w-full md:w-auto px-6 py-2.5 bg-zinc-800 text-white text-xs font-bold rounded-xl hover:bg-slate-200 hover:text-black transition-all"
                            >
                                <i className="fas fa-eye mr-2"></i>
                                VER RELATÓRIO
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reports;
