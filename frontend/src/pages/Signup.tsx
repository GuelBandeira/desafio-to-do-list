/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Signup = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');
   const [confirmSenha, setConfirmSenha] = useState('');
   const [errors, setErrors] = useState<string[]>([]);
   const [loading, setLoading] = useState(false);

   const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors([]);

      if (senha !== confirmSenha) {
         setErrors(['As senhas não coincidem']);
         return;
      }

      setLoading(true);

      try {
         const response = await axios.post('http://localhost:3000/register', {
            name,
            email,
            password: senha
         });

         if (response.status === 201) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            window.location.href = '/login';
         }
      } catch (err: any) {
         console.error(err);
         if (Array.isArray(err.response?.data?.details)) {
            setErrors(err.response.data.details);
         } else if (err.response?.data?.error) {
            setErrors([err.response.data.error]);
         } else {
            setErrors(['Erro ao cadastrar usuário. Tente novamente.']);
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex min-h-full flex-col justify-center px-4 py-12 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Logo" className="mx-auto h-10 w-auto" />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Faça cadastro com sua conta</h2>
         </div>
         <p className="mt-10 text-center text-sm/6 text-gray-400">
            Já tem login?
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300"> Faça login</Link>
         </p>
         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSignup} className="space-y-6">
               <div>
                  <label htmlFor="name" className="block text-sm/6 font-medium text-left text-gray-100">Nome</label>
                  <div className="mt-2">
                     <input
                        id="name"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => {
                           setName(e.target.value);
                           if (errors.length) setErrors([]);
                        }}
                        required
                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                     />
                  </div>
               </div>

               <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-left text-gray-100">Email</label>
                  <div className="mt-2">
                     <input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                           setEmail(e.target.value);
                           if (errors.length) setErrors([]);
                        }}
                        required
                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                     />
                  </div>
               </div>

               <div>
                  <div className="flex items-center justify-between">
                     <label htmlFor="password" className="block text-sm/6 font-medium text-left text-gray-100">Senha</label>
                  </div>
                  <div className="mt-2">
                     <input
                        id="password"
                        type="password"
                        name="password"
                        value={senha}
                        onChange={(e) => {
                           setSenha(e.target.value);
                           if (errors.length) setErrors([]);
                        }}
                        required
                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                     />
                  </div>
               </div>

               <div>
                  <div className="flex items-center justify-between">
                     <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-left text-gray-100">Confirmar Senha</label>
                  </div>
                  <div className="mt-2">
                     <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={confirmSenha}
                        onChange={(e) => {
                           setConfirmSenha(e.target.value);
                           if (errors.length) setErrors([]);
                        }}
                        required
                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                     />
                  </div>
               </div>

               {errors.length > 0 && (
                  <div className="space-y-1">
                     {errors.map((error, index) => (
                        <p key={index} className="text-red-500 text-sm">{error}</p>
                     ))}
                  </div>
               )}

               <div>
                  {loading ? (
                     <button
                        type="submit"
                        className=" items-center flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                     >
                        Carregando
                        <Spinner />
                     </button>
                  ) : (
                     <button
                        type="submit"
                        className=" items-centerflex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                     >
                        Cadastrar
                     </button>
                  )}
               </div>
            </form>


         </div>
      </div>
   );
};

export default Signup;
