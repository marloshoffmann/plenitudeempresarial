
import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, ReferenceLine } from 'recharts';
import { AssessmentResult } from '../types';
import html2canvas from 'html2canvas';

interface ResultsViewProps {
  results: AssessmentResult;
  onRestart: () => void;
  onBack?: () => void;
}

const DISC_COLORS: Record<string, string> = {
  D: '#ef4444', // Vermelho
  I: '#f97316', // Laranja
  S: '#22c55e', // Verde
  C: '#3b82f6', // Azul
};

const VALUE_COLORS: Record<string, string> = {
  E: '#6366f1',
  P: '#fb7185',
  T: '#0891b2',
  B: '#d946ef',
  R: '#f59e0b',
  S: '#ec4899',
};

const ResultsView: React.FC<ResultsViewProps> = ({ results, onRestart, onBack }) => {
  const captureAreaRef = useRef<HTMLDivElement>(null);

  const discData = [
    { name: 'D', fullName: 'Dominância (D)', value: results.disc.D, color: DISC_COLORS.D },
    { name: 'I', fullName: 'Influência (I)', value: results.disc.I, color: DISC_COLORS.I },
    { name: 'S', fullName: 'Estabilidade (S)', value: results.disc.S, color: DISC_COLORS.S },
    { name: 'C', fullName: 'Conformidade (C)', value: results.disc.C, color: DISC_COLORS.C },
  ];

  const valueData = [
    { name: 'Político', key: 'P', value: results.values.P, color: VALUE_COLORS.P },
    { name: 'Econômico', key: 'E', value: results.values.E, color: VALUE_COLORS.E },
    { name: 'Religioso', key: 'R', value: results.values.R, color: VALUE_COLORS.R },
    { name: 'Social', key: 'S', value: results.values.S, color: VALUE_COLORS.S },
    { name: 'Estético', key: 'B', value: results.values.B, color: VALUE_COLORS.B },
    { name: 'Teórico', key: 'T', value: results.values.T, color: VALUE_COLORS.T },
  ].sort((a, b) => b.value - a.value);

  const highProfiles = discData
    .filter(d => d.value >= 51)
    .sort((a, b) => b.value - a.value);

  const highProfileString = highProfiles.map(h => h.name).join('');
  const primaryColor = highProfiles.length > 0 ? highProfiles[0].color : '#94a3b8';

  const getIntensityLabel = (score: number) => {
    if (score >= 88) return { label: 'Extremamente Alto', class: 'bg-white text-black' };
    if (score >= 70) return { label: 'Muito Alto', class: 'bg-slate-200 text-black' };
    if (score >= 51) return { label: 'Alto', class: 'bg-slate-400 text-black' };
    if (score >= 33) return { label: 'Baixo', class: 'bg-slate-600 text-white' };
    if (score >= 16) return { label: 'Muito Baixo', class: 'bg-slate-800 text-slate-300' };
    return { label: 'Extremamente Baixo', class: 'bg-zinc-900 text-slate-500' };
  };

  const handleDownloadResult = async () => {
    if (captureAreaRef.current) {
      const canvas = await html2canvas(captureAreaRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          const area = clonedDoc.getElementById('full-report-capture');
          if (area) {
            area.style.boxShadow = 'none';
          }
        }
      });
      const link = document.createElement('a');
      link.download = `Relatorio_HLA_${highProfileString || 'Perfil'}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    }
  };

  const [stars, setStars] = useState<any[]>([]);
  useEffect(() => {
    const s = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${0.5 + Math.random() * 2}px`,
      duration: `${1 + Math.random() * 3}s`,
    }));
    setStars(s);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto py-4 sm:py-10 px-3 sm:px-6 space-y-6 bg-black min-h-screen">
      {/* Botão Voltar (Aparece apenas se onBack for fornecido) */}
      {onBack && (
        <div className="flex justify-start mb-6 no-print">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-slate-400 text-xs font-bold border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:text-slate-200 transition-all"
          >
            <i className="fas fa-arrow-left"></i>
            VOLTAR
          </button>
        </div>
      )}

      {/* Área completa para captura em JPG */}
      <div id="full-report-capture" ref={captureAreaRef} className="bg-black p-4 sm:p-12 rounded-[2.5rem] space-y-8 sm:space-y-12">
        {/* LOGO NO TOPO DO JPG */}
        <div className="flex flex-col items-center mb-4">
          <img src="/Design%20sem%20nome.png" alt="Plenitude Empresarial" className="h-20 sm:h-24 object-contain" />
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-6xl font-black text-white tracking-tight">Relatório <span className="text-slate-400">HLA™</span></h1>
          <p className="text-[12px] sm:text-xl text-slate-500 uppercase tracking-[0.3em] font-bold">DNA Comportamental e Motivadores</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
          {/* DISC Section */}
          <section className="bg-zinc-900 p-6 sm:p-10 rounded-3xl border border-zinc-800 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 sm:mb-8">
              <h2 className="text-sm sm:text-2xl font-black text-white flex items-center gap-3">
                <i className="fas fa-dna text-slate-500"></i>
                DNA COMPORTAMENTAL
              </h2>
              {highProfileString && (
                <div
                  className="px-3 py-1 sm:px-6 sm:py-2 rounded-xl text-xl sm:text-3xl font-black border-2"
                  style={{ color: primaryColor, borderColor: `${primaryColor}44`, backgroundColor: `${primaryColor}11` }}
                >
                  {highProfileString}
                </div>
              )}
            </div>

            <div className="h-64 sm:h-[300px] mb-6 sm:mb-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={discData} margin={{ top: 60, right: 40, left: 40, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#333" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#666" fontSize={16} fontWeight="bold" />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip
                    cursor={{ fill: '#ffffff05' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl shadow-xl">
                            <p className="text-white font-bold">{data.fullName}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {discData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="top"
                      fill="#fff"
                      fontSize={16}
                      fontWeight="black"
                      offset={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              {discData.map((d) => {
                const info = getIntensityLabel(d.value);
                return (
                  <div key={d.name} className="p-3 sm:p-6 rounded-2xl border border-zinc-800 bg-zinc-950/30">
                    <div className="text-[10px] sm:text-sm font-bold text-slate-600 uppercase mb-1">{d.fullName.split(' ')[0]}</div>
                    <div className="text-xl sm:text-4xl font-black text-white" style={{ color: d.color }}>{d.value}</div>
                    <div className={`mt-2 text-[9px] sm:text-[11px] px-3 py-1 rounded-full inline-block font-bold ${info.class}`}>
                      {info.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Values Section */}
          <section className="bg-zinc-900 p-6 sm:p-10 rounded-3xl border border-zinc-800 flex flex-col relative overflow-hidden">
            <h2 className="text-sm sm:text-2xl font-black text-white mb-6 sm:mb-8 flex items-center gap-3">
              <i className="fas fa-compass text-slate-500"></i>
              MOTIVADORES
            </h2>
            <div className="h-[350px] sm:h-[500px] mb-4 flex relative">
              {/* Barra Lateral Corrigida - Sincronizada com margens do BarChart (top: 20, bottom: 110) */}
              <div className="w-10 sm:w-20 flex flex-col mr-1 relative pointer-events-none">
                <div className="absolute top-[0px] bottom-[110px] left-0 right-0 flex flex-col">
                  {/* Significativo (67-100) */}
                  <div className="flex-[33] flex items-center justify-center text-emerald-500/80 border-b border-zinc-800/30">
                    <span className="inline-block whitespace-nowrap text-[7px] sm:text-[12px] font-black tracking-widest uppercase origin-center rotate-[270deg]">SIGNIFICATIVO</span>
                  </div>
                  {/* Circunstancial (34-66) */}
                  <div className="flex-[33] flex items-center justify-center text-amber-500/80 border-b border-zinc-800/30 bg-zinc-800/5">
                    <span className="inline-block whitespace-nowrap text-[7px] sm:text-[12px] font-black tracking-widest uppercase origin-center rotate-[270deg]">CIRCUNSTANCIAL</span>
                  </div>
                  {/* Indiferente (0-33) */}
                  <div className="flex-[34] flex items-center justify-center text-slate-600/80">
                    <span className="inline-block whitespace-nowrap text-[7px] sm:text-[12px] font-black tracking-widest uppercase origin-center rotate-[270deg]">INDIFERENTE</span>
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valueData} margin={{ top: 20, right: 20, left: 10, bottom: 110 }}>
                    <CartesianGrid vertical={false} stroke="#222" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      stroke="#444"
                      fontSize={11}
                      fontWeight="bold"
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis domain={[0, 100]} hide />

                    <ReferenceLine y={0} stroke="#444" strokeWidth={1} strokeDasharray="4 4" label={{ position: 'left', value: '0', fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                    <ReferenceLine y={34} stroke="#444" strokeWidth={1} strokeDasharray="4 4" label={{ position: 'left', value: '34', fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                    <ReferenceLine y={67} stroke="#444" strokeWidth={1} strokeDasharray="4 4" label={{ position: 'left', value: '67', fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                    <ReferenceLine y={100} stroke="#444" strokeWidth={1} strokeDasharray="4 4" label={{ position: 'left', value: '100', fill: '#666', fontSize: 10, fontWeight: 'bold' }} />


                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {valueData.map((entry, index) => (
                        <Cell key={`cell-v-${index}`} fill={entry.color} />
                      ))}
                      <LabelList dataKey="value" position="top" fill="#fff" fontSize={13} fontWeight="black" offset={10} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-center no-print pb-4">
        <button
          onClick={handleDownloadResult}
          className="flex items-center gap-3 px-8 py-3.5 bg-zinc-900 text-slate-400 text-[12px] font-black border border-zinc-800 rounded-2xl hover:bg-zinc-800 hover:text-slate-200 transition-all shadow-xl active:scale-95"
        >
          <i className="fas fa-download"></i>
          DOWNLOAD RELATÓRIO COMPLETO (JPG)
        </button>
      </div>

      {/* AI Interpretation - AURA™ Section - Reduzida conforme solicitado anteriormente */}
      <section className="max-w-2xl mx-auto bg-white text-slate-900 p-4 rounded-[1.2rem] shadow-2xl relative overflow-hidden border border-slate-200">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="p-1.5 bg-slate-950 text-white rounded-lg">
              <i className="fas fa-sparkles text-[10px]"></i>
            </span>
            <h2 className="text-[11px] sm:text-sm font-black text-slate-950 uppercase tracking-tight">
              Análise AURA™ <span className="opacity-40 font-black ml-1 uppercase">I.A HLA</span>
            </h2>
          </div>
          <div className="py-2 text-center">
            <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.2em]">Em breve</p>
            <p className="text-slate-600 text-[9px] mt-1 italic font-medium">Análises estratégicas personalizadas.</p>
          </div>
        </div>
      </section>

      {/* Botões de Ação Final */}
      <div className="flex flex-col items-center gap-8 py-8 no-print px-4">
        <a
          href="https://cosmos.hlifeacademy.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="cosmos-btn w-full max-w-5xl flex flex-col items-center justify-center gap-1 px-8 py-6 sm:py-8 text-white rounded-[2rem] active:scale-95 shadow-[0_30px_80px_rgba(30,27,75,1)] relative overflow-hidden transition-all hover:brightness-125 border border-white/20"
          style={{
            background: 'linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #020617 100%)',
          }}
        >
          {stars.map(star => (
            <div
              key={star.id}
              className="star"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                '--duration': star.duration
              } as any}
            />
          ))}
          <span className="text-xs sm:text-sm font-black tracking-[0.4em] text-slate-500 uppercase mb-1">Conheça o</span>
          <div className="flex flex-col items-center leading-none text-center">
            <span className="text-xl sm:text-5xl font-black tracking-tighter block">COSMOS</span>
            <span className="text-xl sm:text-5xl font-black tracking-tighter block">HLA</span>
            <div className="h-1 w-12 sm:w-20 bg-indigo-500/40 rounded-full mt-4 animate-pulse mx-auto"></div>
          </div>
        </a>

        <button
          onClick={onRestart}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-zinc-950 text-slate-600 text-sm font-bold border border-zinc-900 rounded-3xl hover:text-slate-300 active:scale-95 transition-colors"
        >
          <i className="fas fa-redo"></i>
          REFAZER TESTE
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
