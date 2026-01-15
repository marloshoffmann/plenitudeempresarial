
import React, { useState, useEffect } from 'react';
import { DNA_ADJECTIVE_GROUPS, VALUES_GROUPS } from './constants';
import { DISC_FACTOR, VALUE_FACTOR, Adjective, ValuePhrase, AssessmentResult } from './types';
import Ranker from './components/Ranker';
import ResultsView from './components/ResultsView';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Reports from './components/Reports';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

type AuthMode = 'login' | 'signup' | 'forgot';
type AppStep = 'auth' | 'welcome' | 'instructions_dna' | 'dna_test' | 'instructions_values' | 'values_test' | 'results' | 'dashboard' | 'profile' | 'reports';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('auth');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastDashboardStep, setLastDashboardStep] = useState<AppStep>('dashboard');

  // User State
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    photo: '',
    gender: '',
    birthDate: ''
  });

  const [savedResults, setSavedResults] = useState<AssessmentResult | null>(null);
  const [allAssessments, setAllAssessments] = useState<any[]>([]);
  const [lastTestDate, setLastTestDate] = useState<string | null>(null);

  // Auth Form State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Password Requirements State
  const passReqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const [discScores, setDiscScores] = useState<Record<DISC_FACTOR, number>>({ D: 0, I: 0, S: 0, C: 0 });
  const [valueScores, setValueScores] = useState<Record<VALUE_FACTOR, number>>({ P: 0, E: 0, R: 0, S: 0, B: 0, T: 0 });

  const [currentOrder, setCurrentOrder] = useState<any[]>([]);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const shuffle = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const maskPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    }
    return value.substring(0, 15);
  };

  // Supabase Auth and Data Loading
  useEffect(() => {
    // 1. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session) {
        // Load Profile
        loadUserData(session.user.id);
        // Load Results
        loadLatestAssessment(session.user.id);
      } else {
        setStep('auth');
        setSavedResults(null);
        setLastTestDate(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUser({
        name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        photo: data.avatar_url || '',
        gender: data.gender || '',
        birthDate: data.birth_date || ''
      });
    }
  };

  const loadLatestAssessment = async (userId: string) => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setAllAssessments(data);
      // Latest is the first one
      setSavedResults({
        disc: data[0].disc_results,
        values: data[0].values_results
      });
      setLastTestDate(data[0].created_at);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'signup') {
      if (!passReqs.length || !passReqs.upper || !passReqs.special) {
        setAuthError('A senha não atende aos requisitos mínimos de segurança.');
        return;
      }
      if (password !== confirmPassword) {
        setAuthError('As senhas não coincidem.');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: password,
        options: {
          data: {
            full_name: user.name,
            phone: user.phone,
            gender: user.gender,
            birth_date: user.birthDate
          }
        }
      });

      if (error) {
        let msg = error.message;
        if (msg === 'Invalid login credentials') msg = 'Credenciais de login inválidas. Verifique seu e-mail e senha.';
        if (msg === 'User already registered') msg = 'Este e-mail já está cadastrado.';
        setAuthError(msg);
        return;
      }
    } else if (authMode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (error) {
        let msg = error.message;
        if (msg === 'Invalid login credentials') msg = 'E-mail ou senha incorretos. Por favor, tente novamente.';
        if (msg === 'Email not confirmed') msg = 'Por favor, confirme seu e-mail para acessar.';
        setAuthError(msg);
        return;
      }
    } else if (authMode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        setAuthError('Erro ao enviar e-mail: ' + error.message);
        return;
      } else {
        setAuthSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        return;
      }
    }

    setStep('dashboard');
  };

  const handleUpdateProfile = async (data: any) => {
    if (!session) return;

    const updates = {
      id: session.user.id,
      full_name: data.name || user.name,
      phone: data.phone || user.phone,
      email: data.email || user.email,
      avatar_url: data.photo || user.photo,
      updated_at: new Date()
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (!error) {
      setUser({ ...user, ...data });
    }
  };

  const startDNA = () => {
    setStep('instructions_dna');
  };

  const beginDNATest = () => {
    setCurrentGroupIndex(0);
    setDiscScores({ D: 0, I: 0, S: 0, C: 0 });
    setCurrentOrder(shuffle(DNA_ADJECTIVE_GROUPS[0].adjectives));
    setHasInteracted(false);
    setShowWarning(false);
    setStep('dna_test');
  };

  const handleDNANext = () => {
    if (!hasInteracted && !showWarning) {
      setShowWarning(true);
      return;
    }
    const points = [9.6, 6.4, 3, 1];
    const newScores = { ...discScores };
    currentOrder.forEach((adj: Adjective, idx) => {
      newScores[adj.factor] += points[idx];
    });
    setDiscScores(newScores);
    if (currentGroupIndex < DNA_ADJECTIVE_GROUPS.length - 1) {
      const nextIdx = currentGroupIndex + 1;
      setCurrentGroupIndex(nextIdx);
      setCurrentOrder(shuffle(DNA_ADJECTIVE_GROUPS[nextIdx].adjectives));
      setHasInteracted(false);
      setShowWarning(false);
    } else {
      setStep('instructions_values');
    }
  };

  const beginValuesTest = () => {
    setCurrentGroupIndex(0);
    setValueScores({ P: 0, E: 0, R: 0, S: 0, B: 0, T: 0 });
    setCurrentOrder(shuffle(VALUES_GROUPS[0].phrases));
    setHasInteracted(false);
    setShowWarning(false);
    setStep('values_test');
  };

  const handleValuesNext = () => {
    if (!hasInteracted && !showWarning) {
      setShowWarning(true);
      return;
    }
    const points = [10, 8, 6, 3.8, 2.2, 1];
    const newScores = { ...valueScores };
    currentOrder.forEach((phrase: ValuePhrase, idx) => {
      newScores[phrase.factor] += points[idx];
    });
    setValueScores(newScores);
    if (currentGroupIndex < VALUES_GROUPS.length - 1) {
      const nextIdx = currentGroupIndex + 1;
      setCurrentGroupIndex(nextIdx);
      setCurrentOrder(shuffle(VALUES_GROUPS[nextIdx].phrases));
      setHasInteracted(false);
      setShowWarning(false);
    } else {
      finishTest(newScores);
    }
  };

  const finishTest = async (finalValueScores: Record<VALUE_FACTOR, number>) => {
    const roundedDisc = {
      D: Math.round(discScores.D),
      I: Math.round(discScores.I),
      S: Math.round(discScores.S),
      C: Math.round(discScores.C),
    };
    const roundedValues = {
      P: Math.round(finalValueScores.P),
      E: Math.round(finalValueScores.E),
      R: Math.round(finalValueScores.R),
      S: Math.round(finalValueScores.S),
      B: Math.round(finalValueScores.B),
      T: Math.round(finalValueScores.T),
    };

    const result = { disc: roundedDisc, values: roundedValues };
    setSavedResults(result);
    const date = new Date().toISOString();
    setLastTestDate(date);

    // Save to Supabase
    if (session) {
      const { error } = await supabase.from('assessments').insert({
        user_id: session.user.id,
        disc_results: roundedDisc,
        values_results: roundedValues
      });

      if (!error) {
        loadLatestAssessment(session.user.id);
      }
    }

    setStep('results');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStep('auth');
    setAuthMode('login');
    setSavedResults(null);
    setLastTestDate(null);
    setUser({
      name: 'Usuário HLA',
      email: '',
      phone: '',
      photo: ''
    });
  };

  const restart = () => {
    setDiscScores({ D: 0, I: 0, S: 0, C: 0 });
    setValueScores({ P: 0, E: 0, R: 0, S: 0, B: 0, T: 0 });
    // Go to welcome to start over? Or dashboard? 
    // The Dashboard now handles the "Start Test" button.
    setStep('dashboard');
  };

  const handleOrderChange = (newOrder: any[]) => {
    setCurrentOrder(newOrder);
    setHasInteracted(true);
    setShowWarning(false);
  };

  // Helper for rendering results view with correct data
  const getResultsData = () => {
    if (savedResults) return savedResults;
    // Fallback if viewing results without saving (shouldn't happen in new flow but safe to keep)
    return {
      disc: {
        D: Math.round(discScores.D),
        I: Math.round(discScores.I),
        S: Math.round(discScores.S),
        C: Math.round(discScores.C),
      },
      values: {
        P: Math.round(valueScores.P),
        E: Math.round(valueScores.E),
        R: Math.round(valueScores.R),
        S: Math.round(valueScores.S),
        B: Math.round(valueScores.B),
        T: Math.round(valueScores.T),
      }
    };
  };

  const toggleAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError('');
    setAuthSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-4"></div>
        <img src="/Design%20sem%20nome.png" alt="Loading" className="h-8 object-contain opacity-20 animate-pulse" />
      </div>
    );
  }

  // Dashboard Layout
  if (step === 'dashboard' || step === 'profile' || step === 'reports') {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-black text-slate-200 font-sans relative overflow-x-hidden">
        <Sidebar
          activeTab={step === 'reports' ? 'reports' : step === 'profile' ? 'profile' : 'dashboard'}
          onTabChange={(t) => {
            setStep(t);
            setLastDashboardStep(t);
          }}
          onLogout={handleLogout}
          user={user}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto min-h-screen relative z-0">
          {/* Mobile Menu Button */}
          <div className="md:hidden mb-6 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
            <img src="/Design%20sem%20nome.png" alt="Logo" className="h-8 object-contain opacity-50" />
          </div>

          <div className="max-w-[1400px] mx-auto pt-2 md:pt-0">
            {step === 'dashboard' && (
              <Dashboard
                results={savedResults}
                lastTestDate={lastTestDate}
                onRetake={() => {
                  // Reset scores before retaking
                  setDiscScores({ D: 0, I: 0, S: 0, C: 0 });
                  setValueScores({ P: 0, E: 0, R: 0, S: 0, B: 0, T: 0 });
                  setStep('welcome');
                }}
                onViewReport={() => setStep('results')}
              />
            )}
            {step === 'reports' && (
              <Reports
                assessments={allAssessments}
                onViewReport={(res) => {
                  setSavedResults(res);
                  setStep('results');
                }}
              />
            )}
            {step === 'profile' && (
              <Profile user={user} userId={session?.user.id || ''} onUpdate={handleUpdateProfile} />
            )}
          </div>
        </main>
      </div>
    );
  }

  // Normal Layout (Auth, Test, Results)
  return (
    <div className="min-h-screen bg-black text-slate-200 flex flex-col items-center p-3 sm:p-4 relative">
      {/* Hide Header only on results page to focus on the report card */}
      {step !== 'results' && (
        <header className="w-full max-w-[1400px] pt-4 sm:pt-8 pb-3 sm:pb-4 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <img src="/Design%20sem%20nome.png" alt="Plenitude Empresarial" className="h-16 sm:h-20 object-contain" />
          </div>
        </header>
      )}

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-[1400px] py-4 sm:py-8 relative z-10">
        {step === 'auth' && (
          <div className="max-w-md w-full bg-zinc-900 p-8 sm:p-10 rounded-3xl border border-zinc-800 shadow-2xl space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {authMode === 'login' ? 'Bem-vindo' : authMode === 'signup' ? 'Crie sua conta' : 'Recuperar senha'}
              </h2>
              <p className="text-slate-500 text-sm">
                {authMode === 'login' ? 'Entre com suas credenciais para acessar' : authMode === 'signup' ? 'Preencha os dados abaixo para começar' : 'Enviaremos um link para o seu e-mail'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 focus:border-slate-400 outline-none transition-all text-white placeholder:text-zinc-700"
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Telefone</label>
                      <input
                        type="tel"
                        required
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: maskPhone(e.target.value) })}
                        className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 focus:border-slate-400 outline-none transition-all text-white placeholder:text-zinc-700"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Sexo</label>
                      <select
                        required
                        value={user.gender}
                        onChange={(e) => setUser({ ...user, gender: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 focus:border-slate-400 outline-none transition-all text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-zinc-700">Selecione</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="O">Outro</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Data de Nascimento</label>
                    <input
                      type="date"
                      required
                      value={user.birthDate}
                      onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 focus:border-slate-400 outline-none transition-all text-white color-scheme-dark"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 focus:border-slate-400 outline-none transition-all text-white placeholder:text-zinc-700"
                  placeholder="exemplo@email.com"
                />
              </div>

              {authMode !== 'forgot' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Senha</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 focus:border-slate-400 outline-none transition-all text-white placeholder:text-zinc-700"
                      placeholder="Sua senha forte"
                    />

                    {authMode === 'signup' && (
                      <div className="grid grid-cols-1 gap-2 p-3 bg-black/40 rounded-2xl border border-zinc-800/50 mt-2">
                        <div className="flex items-center gap-2">
                          <i className={`fas ${passReqs.length ? 'fa-check-circle text-emerald-500' : 'fa-circle text-zinc-700'} text-[10px] transition-colors`}></i>
                          <span className={`text-[10px] font-bold uppercase tracking-tighter ${passReqs.length ? 'text-emerald-500/80' : 'text-zinc-500'}`}>Mínimo 8 caracteres</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className={`fas ${passReqs.upper ? 'fa-check-circle text-emerald-500' : 'fa-circle text-zinc-700'} text-[10px] transition-colors`}></i>
                          <span className={`text-[10px] font-bold uppercase tracking-tighter ${passReqs.upper ? 'text-emerald-500/80' : 'text-zinc-500'}`}>Uma letra MAIÚSCULA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className={`fas ${passReqs.special ? 'fa-check-circle text-emerald-500' : 'fa-circle text-zinc-700'} text-[10px] transition-colors`}></i>
                          <span className={`text-[10px] font-bold uppercase tracking-tighter ${passReqs.special ? 'text-emerald-500/80' : 'text-zinc-500'}`}>Um caractere especial (@, #, $)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {authMode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Confirmar Senha</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-black border ${confirmPassword ? (password === confirmPassword ? 'border-emerald-500/50' : 'border-red-500/50') : 'border-zinc-800'} rounded-2xl px-5 py-3.5 focus:border-slate-400 outline-none transition-all text-white placeholder:text-zinc-700`}
                        placeholder="Repita sua senha"
                      />
                    </div>
                  )}
                </div>
              )}

              {authError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-xl border border-red-500/20 animate-shake">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xs"></i>
                  <p className="text-red-500 text-[10px] font-black uppercase leading-tight">{authError}</p>
                </div>
              )}

              {authSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <i className="fas fa-check-circle text-emerald-500 text-xs"></i>
                  <p className="text-emerald-500 text-[10px] font-black uppercase leading-tight">{authSuccess}</p>
                </div>
              )}

              {authMode === 'login' && (
                <div className="text-right">
                  <button type="button" onClick={() => toggleAuthMode('forgot')} className="text-[10px] font-bold uppercase text-slate-500 hover:text-slate-300 transition-colors">
                    Esqueci minha senha
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={authMode === 'signup' && (!user.name || !user.email || !user.phone || !user.gender || !user.birthDate || !password || password !== confirmPassword || !passReqs.length || !passReqs.upper || !passReqs.special)}
                className={`w-full py-4 font-black rounded-2xl transition-all shadow-xl mt-4 active:scale-[0.98] ${(authMode === 'signup' && (!user.name || !user.email || !user.phone || !user.gender || !user.birthDate || !password || password !== confirmPassword || !passReqs.length || !passReqs.upper || !passReqs.special))
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  : 'bg-slate-200 text-black hover:bg-white'
                  }`}
              >
                {authMode === 'login' ? 'ENTRAR' : authMode === 'signup' ? 'CRIAR CONTA' : 'ENVIAR LINK'}
              </button>
            </form>

            <div className="text-center pt-4">
              {authMode === 'login' ? (
                <p className="text-xs text-slate-500">
                  Ainda não tem conta?{' '}
                  <button onClick={() => toggleAuthMode('signup')} className="text-white font-bold underline">Cadastre-se</button>
                </p>
              ) : (
                <button onClick={() => toggleAuthMode('login')} className="text-xs text-white font-bold underline">Voltar para o Login</button>
              )}
            </div>
          </div>
        )}

        {step === 'welcome' && (
          <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8 bg-zinc-900 p-6 sm:p-12 rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-800 animate-fade-in">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-200 text-black flex items-center justify-center rounded-2xl sm:rounded-3xl mx-auto shadow-[0_0_20px_rgba(255,255,255,0.1)] rotate-3 mb-4 sm:mb-6">
              <i className="fas fa-fingerprint text-3xl sm:text-5xl"></i>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              DNA Comportamental <span className="text-slate-400 text-lg sm:text-2xl">HLA™</span>
            </h1>
            <p className="text-sm sm:text-xl text-slate-400 leading-relaxed">
              Descubra sua identidade prática e seus motivadores internos através de uma análise profunda de perfil comportamental e valores humanos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={startDNA}
                className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 bg-slate-200 text-black text-base sm:text-lg font-bold rounded-full hover:bg-white transition-all shadow-lg active:scale-95"
              >
                Começar Avaliação
              </button>
              <button
                onClick={() => setStep('dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 bg-zinc-800 text-white text-base sm:text-lg font-bold rounded-full hover:bg-zinc-700 transition-all shadow-lg active:scale-95 border border-zinc-700"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {step === 'instructions_dna' && (
          <div className="max-w-3xl w-full bg-zinc-900 p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-800 space-y-4 sm:space-y-6 animate-fade-in flex flex-col">
            <h2 className="text-xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <i className="fas fa-info-circle text-slate-400"></i>
              Teste: Bloco 1
            </h2>

            <button
              onClick={beginDNATest}
              className="w-full py-3 sm:py-4 bg-slate-200 text-black text-sm sm:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-white transition-all shadow-xl active:scale-95 my-4 order-1 sm:order-none"
            >
              INICIAR DNA COMPORTAMENTAL
            </button>

            <div className="space-y-3 sm:space-y-4 text-slate-300 leading-relaxed text-xs sm:text-base border-t border-zinc-800 pt-6">
              <p className="font-semibold text-white">Instruções:</p>
              <p>Ao clicar em INICIAR você encontrará 10 grupos com quatro adjetivos cada um.</p>
              <p>Leia atentamente um grupo de cada vez e defina quais são os adjetivos com os quais você mais se identifica.</p>

              <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-xl border border-zinc-700/50 space-y-2">
                <p className="text-white font-medium text-xs sm:text-sm italic">Ordene seguindo os critérios:</p>
                <ul className="space-y-1 sm:space-y-2 pl-3 sm:pl-4 border-l-2 border-slate-600 text-[10px] sm:text-sm">
                  <li><span className="text-slate-100 font-bold">1º (primeiro) superior:</span> mais se identifica;</li>
                  <li>Siga até o <span className="text-slate-100 font-bold">4º (quarto) inferior:</span> menos se identifica.</li>
                </ul>
              </div>

              <div className="space-y-2 text-[10px] sm:text-sm">
                <div className="flex justify-center mb-4">
                  <img src="/instrução.png" alt="Instrução" className="max-w-[200px] h-auto rounded-lg border border-zinc-700 opacity-60 brightness-75 mix-blend-screen" />
                </div>
                <p>Utilize os <strong>botões de ação</strong> ou <strong>clique e arraste</strong>.</p>
                <p className="p-2 sm:p-3 bg-zinc-800/30 rounded-lg border-l-4 border-slate-500 italic">
                  O objetivo é retratar como você verdadeiramente É e não como gostaria de SER.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 'dna_test' && (
          <div className="max-w-2xl w-full space-y-4 sm:space-y-8 animate-fade-in">
            <div className="flex justify-between items-center px-2">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">DNA Comportamental</span>
              <span className="bg-zinc-800 text-slate-200 px-2.5 py-1 rounded-full font-bold text-[10px] sm:text-sm border border-zinc-700">
                {currentGroupIndex + 1} / {DNA_ADJECTIVE_GROUPS.length}
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-1 sm:h-2 rounded-full overflow-hidden">
              <div
                className="bg-slate-300 h-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                style={{ width: `${((currentGroupIndex + 1) / DNA_ADJECTIVE_GROUPS.length) * 100}%` }}
              ></div>
            </div>

            <Ranker
              items={currentOrder}
              onOrderChange={handleOrderChange}
              renderItem={(item: Adjective) => (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-200 text-xs sm:text-base">{item.text}</span>
                  <button
                    onClick={() => setTooltip(tooltip === item.text ? null : item.text)}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-800 text-slate-500 text-[10px] flex items-center justify-center hover:bg-zinc-700 hover:text-slate-300"
                  >
                    <i className="fas fa-question"></i>
                  </button>
                  {tooltip === item.text && (
                    <div className="absolute z-20 mt-10 right-0 max-w-[200px] sm:max-w-xs bg-slate-200 text-black text-[10px] sm:text-xs p-2 sm:p-3 rounded-xl shadow-xl animate-fade-in border border-white">
                      {item.description}
                    </div>
                  )}
                </div>
              )}
            />

            {showWarning && (
              <p className="text-center text-slate-500 text-[10px] sm:text-sm italic py-1">
                Caso deseje manter a ordem, clique em AVANÇAR
              </p>
            )}

            <button
              onClick={handleDNANext}
              className="w-full py-3 sm:py-4 bg-slate-200 text-black text-sm sm:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-white transition-all shadow-lg active:scale-95"
            >
              AVANÇAR
            </button>
          </div>
        )}

        {step === 'instructions_values' && (
          <div className="max-w-3xl w-full bg-zinc-900 p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-zinc-800 space-y-4 sm:space-y-8 animate-fade-in flex flex-col">
            <h2 className="text-xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <i className="fas fa-list-ol text-slate-400"></i>
              Teste: Bloco 2
            </h2>

            <button
              onClick={beginValuesTest}
              className="w-full py-3 sm:py-4 bg-slate-200 text-black text-sm sm:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-white transition-all shadow-lg active:scale-95 my-4 order-1 sm:order-none"
            >
              INICIAR VALORES
            </button>

            <div className="space-y-4 text-slate-300 leading-relaxed text-xs sm:text-base border-t border-zinc-800 pt-6">
              <p className="font-semibold text-white text-sm sm:text-lg">Instruções: Valores Motivacionais HLA™</p>
              <p>
                Classifique 10 grupos de 6 frases. <span className="text-white font-bold italic">Do mais significativo para o menos relevante!</span>
              </p>
              <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                <p className="text-slate-200 italic">Pense nos princípios que movem suas principais escolhas e ações.</p>
              </div>
            </div>
          </div>
        )}

        {step === 'values_test' && (
          <div className="max-w-3xl w-full space-y-4 sm:space-y-8 animate-fade-in">
            <div className="flex justify-between items-center px-2">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Valores Motivacionais</span>
              <span className="bg-zinc-800 text-slate-200 px-2.5 py-1 rounded-full font-bold text-[10px] sm:text-sm border border-zinc-700">
                {currentGroupIndex + 1} / {VALUES_GROUPS.length}
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-1 sm:h-2 rounded-full overflow-hidden">
              <div
                className="bg-slate-300 h-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                style={{ width: `${((currentGroupIndex + 1) / VALUES_GROUPS.length) * 100}%` }}
              ></div>
            </div>

            <Ranker
              items={currentOrder}
              onOrderChange={handleOrderChange}
              renderItem={(item: ValuePhrase) => <span className="text-slate-200 text-xs sm:text-base leading-tight block pr-4">{item.text}</span>}
            />

            {showWarning && (
              <p className="text-center text-slate-500 text-[10px] sm:text-sm italic py-1">
                Caso deseje manter a ordem, clique em AVANÇAR
              </p>
            )}

            <button
              onClick={handleValuesNext}
              className="w-full py-3 sm:py-4 bg-slate-200 text-black text-sm sm:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-white transition-all shadow-lg active:scale-95"
            >
              {currentGroupIndex === VALUES_GROUPS.length - 1 ? 'GERAR RELATÓRIO FINAL' : 'AVANÇAR'}
            </button>
          </div>
        )}

        {step === 'results' && (
          <div className="w-full animate-fade-in flex flex-col items-center">
            <ResultsView
              results={getResultsData()}
              onRestart={restart}
              onBack={() => {
                // If we viewed a historical report, when going back we should reset savedResults to the LATEST one.
                if (allAssessments.length > 0) {
                  setSavedResults({
                    disc: allAssessments[0].disc_results,
                    values: allAssessments[0].values_results
                  });
                  setLastTestDate(allAssessments[0].created_at);
                }
                setStep(lastDashboardStep);
              }}
            />
          </div>
        )}
      </main>

      {/* Hide Footer on Dashboard steps as it has Sidebar */}
      {step !== 'dashboard' && step !== 'profile' && step !== 'reports' && (
        <footer className="w-full max-w-[1400px] py-4 mt-auto no-print">
          <p className="text-center text-[0.65rem] sm:text-xs text-slate-600 tracking-wider font-medium px-4 leading-relaxed">
            DNA Comportamental é disponibilizado pela<br />
            <span className="font-bold">Hoffmann Life Academy</span>
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
