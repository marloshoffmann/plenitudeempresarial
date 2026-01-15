
import React, { useEffect, useState } from 'react';

interface SidebarProps {
    activeTab: 'dashboard' | 'profile' | 'reports';
    onTabChange: (tab: 'dashboard' | 'profile' | 'reports') => void;
    onLogout: () => void;
    user: { name: string; email: string; photo?: string };
    isOpen: boolean;    // New prop for mobile state
    onClose: () => void; // New prop to close sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout, user, isOpen, onClose }) => {
    // Close sidebar on tab change (mobile UX)
    const handleTabChange = (tab: 'dashboard' | 'profile' | 'reports') => {
        onTabChange(tab);
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm pointer-events-auto"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 
                    z-50 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col
                    ${isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none md:pointer-events-auto'}
                `}
            >
                {/* Mobile Close Button */}
                <div className="md:hidden absolute top-4 right-4">
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center justify-center border-b border-zinc-800">
                    <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 mb-4 overflow-hidden relative group">
                        {user.photo ? (
                            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <i className="fas fa-user text-3xl text-slate-500"></i>
                        )}
                    </div>
                    <h3 className="text-white font-bold text-base text-center leading-tight mb-1">{user.name}</h3>
                    <p className="text-slate-500 text-xs">{user.email}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => handleTabChange('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'dashboard'
                            ? 'bg-slate-200 text-black font-bold shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-zinc-800'
                            }`}
                    >
                        <i className="fas fa-chart-pie w-5 text-center"></i>
                        <span>Meu DNA</span>
                    </button>

                    <button
                        onClick={() => handleTabChange('reports')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'reports'
                            ? 'bg-slate-200 text-black font-bold shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-zinc-800'
                            }`}
                    >
                        <i className="fas fa-file-alt w-5 text-center"></i>
                        <span>Meus Relatórios</span>
                    </button>

                    <button
                        onClick={() => handleTabChange('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === 'profile'
                            ? 'bg-slate-200 text-black font-bold shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-zinc-800'
                            }`}
                    >
                        <i className="fas fa-user-cog w-5 text-center"></i>
                        <span>Perfil</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-medium"
                    >
                        <i className="fas fa-sign-out-alt w-5 text-center"></i>
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
