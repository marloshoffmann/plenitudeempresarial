
import React, { useState } from 'react';

interface ProfileProps {
    user: { name: string; email: string; phone: string; photo?: string };
    userId: string;
    onUpdate: (data: any) => void;
}

import { supabase } from '../lib/supabase';

const Profile: React.FC<ProfileProps> = ({ user, userId, onUpdate }) => {
    const [formData, setFormData] = useState(user);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${userId}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData({ ...formData, photo: publicUrl });
            onUpdate({ ...formData, photo: publicUrl });
        } catch (error: any) {
            alert('Erro ao carregar imagem: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
        alert('Perfil atualizado com sucesso!');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in w-full">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-user-edit text-slate-400"></i>
                    Editar Perfil
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-700 flex items-center justify-center text-slate-500 cursor-pointer hover:border-slate-400 hover:text-slate-200 transition-all relative overflow-hidden group">
                            {uploading ? (
                                <i className="fas fa-spinner fa-spin text-2xl"></i>
                            ) : formData.photo ? (
                                <img src={formData.photo} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <i className="fas fa-camera text-2xl"></i>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                title="Alterar foto"
                            />
                        </div>
                        <span className="text-xs text-slate-500 mt-2">
                            {uploading ? 'Carregando...' : 'Clique para alterar a foto'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 ml-1">Nome Completo</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-slate-400 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 ml-1">Telefone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-slate-400 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 ml-1">E-mail</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-slate-400 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 ml-1">Nova Senha</label>
                        <input
                            type="password"
                            placeholder="Deixe em branco para manter"
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-slate-400 outline-none"
                        />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-4 bg-slate-200 text-black font-black rounded-xl hover:bg-white transition-all shadow-lg active:scale-95">
                            SALVAR ALTERAÇÕES
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
