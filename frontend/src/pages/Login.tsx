import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Spinner from '../components/Spinner';

interface ErrorResponse {
   error: string;
   details?: string[];
}

const Login = () => {
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
         await axios.post('http://localhost:3000/login',
            { email, password: senha },
            { withCredentials: true }
         );
         // Login bem-sucedido, redirecionar para dashboard
         window.location.href = '/dashboard';
      } catch (err: unknown) {
         console.error(err);
         const axiosError = err as AxiosError<ErrorResponse>;
         const details = axiosError.response?.data?.details;
         const errorMsg = axiosError.response?.data?.error || 'Erro ao fazer login';
         setError(details ? `${errorMsg}: ${details.join(', ')}` : errorMsg);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex min-h-full flex-col justify-center px-4 py-12 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Logo" className="mx-auto h-10 w-auto" />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Faça login com sua conta</h2>
         </div>
         <p className="mt-10 text-center text-sm/6 text-gray-400">
            Não tem login?
            <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300"> Registre-se</Link>
         </p>
         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleLogin} className="space-y-6">
               <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-left text-gray-100">Email</label>
                  <div className="mt-2">
                     <input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                     />
                  </div>
               </div>


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
                        Entrar
                     </button>
                  )}
               </div>
            </form>

            {error && <p className="text-red-500 py-2 text-sm">{error}</p>}





         </div>
      </div>
   );
};

export default Login;
