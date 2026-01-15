
import React from 'react';
import { AssessmentResult } from '../types';

interface DashboardProps {
    results: AssessmentResult | null;
    lastTestDate: string | null;
    onRetake: () => void;
    onViewReport: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ results, lastTestDate, onRetake, onViewReport }) => {
    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center space-y-6">
                <div className="text-6xl text-slate-600 mb-4"><i className="fas fa-clipboard-list"></i></div>
                <h2 className="text-3xl font-black text-white">Nenhum teste realizado</h2>
                <p className="text-slate-400 max-w-md">Você ainda não realizou o DNA Comportamental. Inicie agora para descobrir seu perfil.</p>
                <button onClick={onRetake} className="px-8 py-4 bg-slate-200 text-black font-black rounded-full hover:bg-white transition-all shadow-lg">
                    INICIAR TESTE
                </button>
            </div>
        );
    }

    // Calculate Insights
    const discEntries = Object.entries(results.disc).sort((a, b) => Number(b[1]) - Number(a[1]));
    const highProfile = discEntries[0];
    const highFactor = highProfile[0]; // D, I, S, or C

    const valueEntries = Object.entries(results.values).sort((a, b) => Number(b[1]) - Number(a[1]));
    const mainMotivator = valueEntries[0]; // [Factor, Score]

    const valueNames: Record<string, string> = {
        P: 'Político', E: 'Econômico', R: 'Religioso', S: 'Social', B: 'Estético', T: 'Teórico'
    };

    const getInsights = (factor: string) => {
        switch (factor) {
            case 'D': return {
                profileName: 'Dominante',
                strengths: ['Determinação', 'Foco em resultados', 'Rapidez na decisão', 'Competitividade'],
                leadership: ['Líder comando-controle', 'Visionário e estrategista', 'Exigente com prazos', 'Assume riscos']
            };
            case 'I': return {
                profileName: 'Influente',
                strengths: ['Comunicação persuasiva', 'Entusiasmo', 'Criatividade', 'Networking'],
                leadership: ['Líder inspirador', 'Motivador de equipas', 'Aberto a inovações', 'Promove colaboração']
            };
            case 'S': return {
                profileName: 'Estável',
                strengths: ['Paciência', 'Lealdade', 'Planejamento e organização', 'Escuta ativa'],
                leadership: ['Líder servidor', 'Focado em processos', 'Consensual e conciliador', 'Transmite segurança']
            };
            case 'C': return {
                profileName: 'Conforme',
                strengths: ['Precisão e qualidade', 'Análise crítica', 'Disciplina', 'Rigor técnico'],
                leadership: ['Líder especialista', 'Baseado em dados', 'Cauteloso e estruturado', 'Alto padrão de qualidade']
            };
            default: return { profileName: '', strengths: [], leadership: [] };
        }
    };

    const getMotivatorDescription = (factor: string) => {
        switch (factor) {
            case 'P': return "Busca poder, liderança e controle sobre o próprio destino. Ambicioso, deseja se destacar e alcançar status. Valoriza a ascensão profissional e gosta de liderar, comandar e guiar pessoas rumo a objetivos grandiosos. Seu foco é no sucesso e no reconhecimento.";
            case 'E': return "Valoriza a utilidade prática e o retorno sobre o investimento de seus recursos (tempo, dinheiro, energia). Foca na relação custo-benefício, na eficiência e no acúmulo de bens. Busca sempre fazer mais com menos e odeia desperdícios. É prático e pragmático.";
            case 'R': return "Guiado por um sistema de princípios, crenças e valores rígidos (religiosos ou éticos). Busca sentido na vida e age de acordo com suas convicções morais. Valoriza a tradição e tende a querer viver de forma alinhada com o que acredita ser o 'certo'.";
            case 'S': return "Movido pelo altruísmo e pelo desejo de contribuir para um mundo melhor. Coloca os interesses dos outros à frente dos seus e se dedica a ajudar, servir e desenvolver pessoas. É generoso, empático e busca eliminar a dor e o conflito social.";
            case 'B': return "Busca harmonia, equilíbrio e apreciação da beleza e da forma. Valoriza a estética e as experiências subjetivas. Deseja qualidade de vida e expressar sua criatividade. Para este perfil, a forma e a experiência são tão importantes quanto a função.";
            case 'T': return "Buscador insaciável da verdade e do conhecimento. Racional e investigativo, quer entender o 'porquê' das coisas. Valoriza o aprendizado contínuo, a sistematização de saberes e a análise lógica. Prioriza a educação e a competência técnica.";
            default: return "";
        }
    };

    const getCombinationDescription = (f1: string, f2: string) => {
        const key = f1 + f2;
        switch (key) {
            // D + X
            case 'DI': return "É objetivo e direto, mas consegue envolver as pessoas com sua capacidade de persuasão e argumentação. A combinação da coragem e ousadia do Alto D com o otimismo do Alto I contribuem para ter facilidade para conduzir as pessoas de forma inspiradora. Tende a ser visionário e criativo, com boa capacidade para formular novas ideias, porém com certa dificuldade para terminá-las. Será mais sério e formal ou mais relaxado e sorridente, dependendo da situação. Tende ao hábito de interromper os outros, principalmente quando não concorda com eles.";
            case 'DS': return "Perfil incomum. Parece relaxado e tranquilo, mas a mente está a mil, sempre buscando alcançar os resultados que almeja. Gosta de desafios e é ousado, no entanto, sem ansiedade, aflição ou excitação evidente. Tende a ser paternalista em relação às pessoas que o cercam, defendendo-as e protegendo-as. Devido à combinação de perfis dicotômicos, pode apresentar atitudes opostas: por exemplo, tranquilidade em certos momentos e agitação em outros.";
            case 'DC': return "Lógico, racional, pragmático e impessoal. Totalmente voltado para tarefas, com pouco interesse em pessoas. Muito exigente consigo e com os outros, tem baixa tolerância a erros. Corre riscos, porém de maneira calculada. Pode se sobrecarregar, pois tende a centralizar decisões e tarefas. É um perfil de muita execução.";

            // I + X
            case 'ID': return "Tem um forte perfil motivador e inspirador, com mais habilidade de cativar as pessoas que o perfil DI. Sonhador e carismático, conquista as pessoas e as convence de seu ponto de vista. Tende a ser visionário e criativo, com boa capacidade para formular novas ideias, porém com certa dificuldade para terminá-las. De perfil generalista, põe tarefas mais detalhistas e processuais em segundo plano.";
            case 'IS': return "Totalmente voltado para pessoas e relacionamentos, podendo até deixar as tarefas de lado para satisfazer a sua necessidade de conexão. Amistoso e sociável, tem facilidade para lidar com as emoções dos outros. Muito comunicativo, tende a falar mais do que ouvir, embora também seja um bom ouvinte. Pode ter dificuldade para se impor e dizer não, tanto por querer evitar conflitos (Alto S) quanto por desejar ser querido (Alto I).";
            case 'IC': return "Perfil incomum. Persuasivo e bom comunicador, argumenta com base em fatos e dados. Num primeiro contato, aparenta ser mais reservado, no entanto, logo se mostra aberto, comunicativo e sociável. Interage de forma equilibrada, sem excessos ou indiscrições. Facilidade em atividades que exijam lidar com pessoas e com assuntos técnicos, como suporte ou treinamentos especializados.";

            // S + X
            case 'SD': return "Perfil incomum. Gosta de ter o poder de decisão para implantar suas próprias ideias da sua forma: com método, planejamento e dentro do seu próprio ritmo. Incomoda-se com supervisão (Alto D) e com pressão de tempo (Alto S). Tem aparência relaxada e tranquila, mas a mente está a mil. É calmo e paciente, mas pode se exaltar quando sua autoridade ou autonomia forem questionadas. Devido à combinação de perfis dicotômicos, pode apresentar atitudes opostas: por exemplo, tranquilidade em certos momentos e agitação em outros.";
            case 'SI': return "Totalmente voltado para pessoas e relacionamentos, podendo até deixar as tarefas de lado para satisfazer a sua necessidade de conexão. Pode ser necessário maior direcionamento para conseguir manter o foco em suas atividades. Gosta de dar e de receber apoio, valoriza muito o trabalho em equipe. Pensativo, tende a ouvir mais do que falar, embora também se expresse bem. Pode ter dificuldade para se impor e dizer não, tanto por querer evitar conflitos (Alto S), quanto por desejar ser querido (Alto I).";
            case 'SC': return "Tende a apresentar um perfil mais técnico e especialista, com grande facilidade com planejamento, organização, coordenação e atenção a detalhes e pormenores. Busca segurança em dados e informações. Toma decisões com muita cautela e após refletir bastante. É bom ouvinte e muito observador. Tende a evitar o confronto, mesmo quando discorda das decisões. Quando inicia um projeto, esforça-se para concluí-lo com o máximo de qualidade possível.";

            // C + X
            case 'CD': return "Está mais voltado a tarefas e procedimentos do que a assuntos emocionais e pessoais. Busca alto nível de qualidade, com forte tendência para atividades de controle. Possui habilidade com tarefas que exijam atenção aos detalhes e se adequem a altos padrões. Tende a usar as estruturas e as regras como fator de controle sobre o ambiente para alcançar seus objetivos. O relacionamento interpessoal não é prioridade desse estilo, seu foco é a realização de suas metas. Possui forte tendência a corrigir as outras pessoas, dando muita ênfase nas falhas que cometeram, mesmo que outros as considerem insignificantes.";
            case 'CI': return "Perfil incomum. É analítico, racional e tende a ser mais reservado. No entanto, em ambientes que já conhece bem, é aberto, comunicativo e sociável. Possui habilidades com tarefas que exijam precisão e atenção aos detalhes, com grande potencial para atuar em treinamentos técnicos, como multiplicador de projetos que exijam qualidade. É organizado e cauteloso, mesmo nos relacionamentos pessoais, buscando falar a coisa certa na hora certa.";
            case 'CS': return "Possui estilo reservado e cauteloso. Leva tempo para confiar e se envolver com as pessoas. Sempre alerta a possíveis erros, busca segurança no acúmulo de informações e decide apenas após analisar os dados e as possíveis consequências. Tende a apresentar um perfil mais técnico e especialista, com grande facilidade com planejamento, organização, coordenação e atenção a detalhes e pormenores. Capaz de produzir trabalhos minuciosos que outros estilos não teriam paciência para conduzir até o fim. Quando inicia um projeto, esforça-se para concluí-lo com excelência e dentro do prazo estabelecido.";

            default: return "";
        }
    };

    const getPureProfileDescription = (factor: string) => {
        switch (factor) {
            case 'D': return "Dominância é o fator do controle e da assertividade. Pessoas com alta intensidade 'D' são diretas, ousadas, competitivas e focadas em resultados. Lutam energicamente para atingir seus objetivos e acreditam ser necessário estar no controle. Tendem a ser determinadas, decididas e visionárias, às vezes parecendo rígidas ou severas devido à sua postura firme. Para elas, o desejo de ganhar é maior que o medo de perder.";
            case 'I': return "Influência é o jeito como se comunica e interage. Pessoas com alta intensidade 'I' são extrovertidas, otimistas, sociáveis e persuasivas. Trabalham bem em equipe, contagiando o ambiente com entusiasmo. Valorizam o reconhecimento social e status, gostam de compartilhar ideias e de serem queridas por todos. São criativas e rápidas para agir, mas podem ter dificuldade em focar em uma coisa só até o fim.";
            case 'S': return "Estabilidade é a capacidade de manter o equilíbrio, empatia e lealdade. Pessoas com alta intensidade 'S' são boas ouvintes, atenciosas e valorizam relacionamentos duradouros. Preferem rotina, previsibilidade e planejamento, evitando mudanças bruscas. São pacientes, perseverantes e buscam consenso. Preocupam-se genuinamente com o bem-estar dos outros e estão sempre prontas para ajudar/servir.";
            case 'C': return "Conformidade é o fator da estrutura, detalhes e regras. Pessoas com alta intensidade 'C' são lógicas, analíticas, precisas e disciplinadas. Tomam decisões cautelosas baseadas em fatos e dados. Valorizam a qualidade, o perfeccionismo e a organização. Tendem a ser mais reservadas e formais. Seu foco é a excelência e evitar erros, o que pode torná-las críticas e exigentes consigo e com os outros.";
            default: return "";
        }
    };

    // Calculate High Profile (Combinations >= 51)
    const discScores = [
        { factor: 'D', value: results.disc.D },
        { factor: 'I', value: results.disc.I },
        { factor: 'S', value: results.disc.S },
        { factor: 'C', value: results.disc.C }
    ].sort((a, b) => b.value - a.value);

    // Filter factors >= 51 to match report logic
    let highFactors = discScores.filter(d => d.value >= 51);
    // Fallback if none (rare, but possible if all are low/mid)
    if (highFactors.length === 0) {
        highFactors = [discScores[0]];
    }

    const profileCode = highFactors.map(h => h.factor).join('');

    // Aggregate data
    let combinedStrengths: string[] = [];
    let combinedLeadership: string[] = [];
    let fullProfileNames: string[] = [];

    highFactors.forEach(h => {
        const insight = getInsights(h.factor);
        fullProfileNames.push(insight.profileName);
        combinedStrengths = [...combinedStrengths, ...insight.strengths];
        combinedLeadership = [...combinedLeadership, ...insight.leadership];
    });

    const displayProfileName = fullProfileNames.join(' - ');

    // Check date logic
    const canRetake = () => {
        if (!lastTestDate) return true;
        const lastDate = new Date(lastTestDate);
        const sixMonthsLater = new Date(lastDate);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        return new Date() >= sixMonthsLater;
    };

    const daysRemaining = () => {
        if (!lastTestDate) return 0;
        const lastDate = new Date(lastTestDate);
        const sixMonthsLater = new Date(lastDate);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        const diff = sixMonthsLater.getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    return (
        <div className="w-full space-y-6 sm:space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">Meu DNA</h1>
                    <p className="text-slate-500 text-sm">Resumo da sua análise comportamental</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onViewReport} className="px-4 py-2 bg-zinc-800 text-slate-300 rounded-lg hover:bg-zinc-700 text-xs font-bold border border-zinc-700 transition-all">
                        <i className="fas fa-eye mr-2"></i> VER RELATÓRIO COMPLETO
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* High Profile Card */}
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <i className="fas fa-dna text-9xl"></i>
                    </div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Perfil Predominante</h3>
                    <div className="flex flex-col gap-1 mb-6">
                        <span className="text-5xl lg:text-7xl font-black text-white">{profileCode}</span>
                        <span className="text-lg text-slate-400 font-medium">{displayProfileName}</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2"><i className="fas fa-check-circle text-emerald-500 mr-2"></i>Pontos Fortes</h4>
                            <div className="flex flex-wrap gap-2">
                                {combinedStrengths.map((s, i) => (
                                    <span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-slate-300 border border-zinc-700">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2"><i className="fas fa-crown text-amber-500 mr-2"></i>Liderança</h4>
                            <div className="flex flex-wrap gap-2">
                                {combinedLeadership.map((l, i) => (
                                    <span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-slate-300 border border-zinc-700">{l}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                        <p className="text-xs text-slate-400 italic leading-relaxed">
                            {highFactors.length >= 2
                                ? getCombinationDescription(highFactors[0].factor, highFactors[1].factor)
                                : getPureProfileDescription(highFactors[0].factor)
                            }
                        </p>
                    </div>
                </div>

                {/* Left Col - Motivator + Retake Button */}
                <div className="flex flex-col gap-6">
                    {/* Motivator */}
                    {/* Motivator */}
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <i className="fas fa-compass text-8xl"></i>
                        </div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Maior Motivador</h3>
                        <div className="text-4xl lg:text-5xl font-black text-white mb-2">
                            {valueNames[mainMotivator[0]]}
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, Number(mainMotivator[1]))}%` }}></div>
                        </div>
                        <p className="text-right text-indigo-400 font-bold mt-1">{Math.round(Number(mainMotivator[1]))}%</p>
                        <div className="mt-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 space-y-2">
                            <p className="text-xs text-slate-300 font-bold">
                                {getMotivatorDescription(mainMotivator[0])}
                            </p>
                            <p className="text-[10px] text-slate-500 leading-tight">
                                (Não quer dizer que é o único, mas é o que você mais sente que precisa quando busca por algo, por alguma motivação para uma escolha ou uma decisão).
                            </p>
                        </div>
                    </div>

                    {/* Retake Control */}
                    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-slate-400 uppercase">Próxima Avaliação</h3>
                            {canRetake() ? (
                                <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">DISPONÍVEL</span>
                            ) : (
                                <span className="text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded">BLOQUEADO</span>
                            )}
                        </div>

                        {canRetake() ? (
                            <button onClick={onRetake} className="w-full py-4 mt-2 bg-white text-black font-black rounded-xl hover:bg-slate-200 transition-all shadow-lg active:scale-95">
                                REFAZER TESTE AGORA
                            </button>
                        ) : (
                            <div className="mt-2">
                                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                                    <p className="text-slate-500 text-sm mb-1">Disponível em</p>
                                    <p className="text-2xl font-black text-white">{daysRemaining()} dias</p>
                                    <p className="text-[10px] text-slate-600 mt-2 leading-tight px-4">
                                        A mudança de perfil ocorre em fases. Recomendamos um intervalo de 6 meses entre as avaliações para garantir precisão, salvo forte impacto emocional recente.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
