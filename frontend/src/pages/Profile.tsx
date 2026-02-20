import { useState, useEffect } from 'react';
import axios, { type AxiosError } from 'axios';
import Navbar from '../components/Navbar';
import Toast, { type ToastMessage } from '../components/Toast';

interface User {
   id: number;
   name: string;
   email: string;
}

interface ProfilePageProps {
   user: User | null;
   onBack: () => void;
   onUpdateUser: (updatedUser: User) => void;
}

interface UpdateUserData {
   name: string;
   email: string;
   password?: string;
}

export default function ProfilePage({ user, onBack, onUpdateUser }: ProfilePageProps) {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const [toasts, setToasts] = useState<ToastMessage[]>([]);

   useEffect(() => {
      if (user) {
         setName(user.name);
         setEmail(user.email);
         setPassword('');
         setConfirmPassword('');
         setErrors({});
      }
   }, [user]);

   const addToast = (message: string, type: 'success' | 'error' = 'success') => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message, type }]);
   };

   const removeToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
   };

   const validateForm = (): boolean => {
      const newErrors: { [key: string]: string } = {};

      if (!name.trim()) {
         newErrors.name = 'Nome é obrigatório';
      }

      if (!email.trim()) {
         newErrors.email = 'E-mail é obrigatório';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         newErrors.email = 'E-mail inválido';
      }

      if (password && confirmPassword && password !== confirmPassword) {
         newErrors.confirmPassword = 'As senhas não conferem';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm() || !user) return;

      try {
         setIsSubmitting(true);

         const updateData: UpdateUserData = {
            name: name.trim(),
            email: email.trim(),
         };

         if (password) {
            updateData.password = password;
         }

         await axios.put(`http://localhost:3000/users/${user.id}`, updateData, {
            withCredentials: true,
         });

         const updatedUser = { ...user, name: name.trim(), email: email.trim() };
         onUpdateUser(updatedUser);
         addToast('Perfil atualizado com sucesso!', 'success');
         setPassword('');
         setConfirmPassword('');

         setTimeout(() => {
            onBack();
         }, 1500);
      } catch (err: unknown) {
         console.error('Erro ao atualizar perfil:', err);

         const error = err as AxiosError;
         if (error.response?.status === 409) {
            addToast('Este e-mail já está em uso', 'error');
            setErrors({ email: 'E-mail já está em uso' });
         } else {
            addToast('Erro ao atualizar perfil', 'error');
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="min-h-full">
         <Toast toasts={toasts} onRemove={removeToast} />
         <Navbar user={user} onProfileClick={onBack} showNewTaskButton={false} />

         <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
               <h1 className="text-3xl font-bold tracking-tight text-white">Meu Perfil</h1>
            </div>
         </header>

         <main>
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
               {/* User Info Card */}
               <div className="rounded-lg bg-gray-900/50 border border-white/10 p-6 mb-8">
                  <div className="flex items-center gap-4">
                     <div className="size-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
                        {user?.name?.[0].toUpperCase()}
                     </div>
                     <div>
                        <p className="text-sm text-gray-400">Usuário</p>
                        <p className="text-xl font-semibold text-white">{user?.name}</p>
                     </div>
                  </div>
               </div>

               {/* Form */}
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div>
                     <label htmlFor="name" className="block text-sm font-medium text-gray-100 mb-2">
                        Nome Completo
                     </label>
                     <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                           setName(e.target.value);
                           if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder="Seu nome"
                        className={`w-full rounded-lg bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-1 -outline-offset-1 transition ${errors.name
                           ? 'outline-red-500 focus:outline-red-600'
                           : 'outline-white/10 focus:outline-indigo-500 focus:-outline-offset-2'
                           }`}
                        disabled={isSubmitting}
                     />
                     {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                  </div>

                  {/* E-mail */}
                  <div>
                     <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-2">
                        E-mail
                     </label>
                     <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                           setEmail(e.target.value);
                           if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        placeholder="seu@email.com"
                        className={`w-full rounded-lg bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-1 -outline-offset-1 transition ${errors.email
                           ? 'outline-red-500 focus:outline-red-600'
                           : 'outline-white/10 focus:outline-indigo-500 focus:-outline-offset-2'
                           }`}
                        disabled={isSubmitting}
                     />
                     {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10 pt-6">
                     <h3 className="text-lg font-semibold text-white mb-4">Alterar Senha</h3>
                     <p className="text-sm text-gray-400 mb-4">Deixe em branco para manter a senha atual</p>

                     {/* Nova Senha */}
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-100 mb-2">
                           Nova Senha
                        </label>
                        <input
                           id="password"
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="••••••••"
                           className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 transition"
                           disabled={isSubmitting}
                        />
                     </div>

                     {/* Confirmar Senha */}
                     <div className="mt-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-100 mb-2">
                           Confirmar Senha
                        </label>
                        <input
                           id="confirmPassword"
                           type="password"
                           value={confirmPassword}
                           onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                           }}
                           placeholder="••••••••"
                           className={`w-full rounded-lg bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-1 -outline-offset-1 transition ${errors.confirmPassword
                              ? 'outline-red-500 focus:outline-red-600'
                              : 'outline-white/10 focus:outline-indigo-500 focus:-outline-offset-2'
                              }`}
                           disabled={isSubmitting}
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                     </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3 pt-6 border-t border-white/10">
                     <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 rounded-lg bg-gray-700 px-6 py-3 font-semibold text-gray-100 hover:bg-gray-600 transition disabled:opacity-50"
                        disabled={isSubmitting}
                     >
                        Voltar
                     </button>
                     <button
                        type="submit"
                        className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? 'Salvando...' : 'Salvar Mudanças'}
                     </button>
                  </div>
               </form>
            </div>
         </main>
      </div>
   );
}
