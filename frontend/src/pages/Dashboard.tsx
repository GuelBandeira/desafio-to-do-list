/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Toast, { type ToastMessage } from '../components/Toast';
import ProfilePage from './Profile';
import Navbar from '../components/Navbar';

interface Task {
   id: number;
   title: string;
   description: string;
   completed: number;
   user_id: number;
   created_at: string;
   updated_at: string;
}

interface User {
   id: number;
   name: string;
   email: string;
}

export default function Dashboard() {
   const [user, setUser] = useState<User | null>(null);
   const [tasks, setTasks] = useState<Task[]>([]);
   const [filter, setFilter] = useState<'pending' | 'completed'>('pending');
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [editingTask, setEditingTask] = useState<Task | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');
   const [toasts, setToasts] = useState<ToastMessage[]>([]);
   const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile'>('dashboard');
   const [taskFormErrors, setTaskFormErrors] = useState<string[]>([]);

   useEffect(() => {
      const checkAuth = async () => {
         try {
            const response = await axios.get('http://localhost:3000/auth/check', {
               withCredentials: true
            });
            if (response.data.authenticated) {
               setUser(response.data.user);
               fetchTasks(response.data.user.id);
            } else {
               window.location.href = '/login';
            }
         } catch (err) {
            console.error('Erro ao verificar autenticação:', err);
            window.location.href = '/login';
         }
      };

      checkAuth();
   }, []);

   const fetchTasks = async (userId: number) => {
      try {
         setIsLoading(true);
         const response = await axios.get(`http://localhost:3000/tasks/${userId}`, {
            withCredentials: true
         });
         setTasks(response.data || []);
         setError('');
      } catch (err) {
         console.error('Erro ao buscar tarefas:', err);
         setError('Erro ao carregar tarefas');
      } finally {
         setIsLoading(false);
      }
   };

   const addToast = (message: string, type: 'success' | 'error' = 'success') => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message, type }]);
   };

   const removeToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
   };

   const handleUpdateUserProfile = (updatedUser: User) => {
      setUser(updatedUser);
      setCurrentPage('dashboard');
   };

   const handleCreateTask = async (data: { title: string; description: string; completed: number }) => {
      if (!user) return;

      try {
         setIsSubmitting(true);
         setTaskFormErrors([]);
         await axios.post(`http://localhost:3000/tasks/${user.id}`, data, {
            withCredentials: true
         });
         setIsFormOpen(false);
         setEditingTask(null);
         fetchTasks(user.id);
         addToast('Tarefa criada com sucesso!', 'success');
      } catch (err: any) {
         console.error('Erro ao criar tarefa:', err);
         if (err.response?.data && Array.isArray(err.response.data)) {
            setTaskFormErrors(err.response.data);
         } else {
            addToast('Erro ao criar tarefa', 'error');
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleEditTask = async (data: { title: string; description: string; completed: number }) => {
      if (!user || !editingTask) return;

      try {
         setIsSubmitting(true);
         setTaskFormErrors([]);
         await axios.put(`http://localhost:3000/tasks/${editingTask.id}`, data, {
            withCredentials: true
         });
         setIsFormOpen(false);
         setEditingTask(null);
         fetchTasks(user.id);
         addToast('Tarefa atualizada com sucesso!', 'success');
      } catch (err: any) {
         console.error('Erro ao atualizar tarefa:', err);
         if (err.response?.data && Array.isArray(err.response.data)) {
            setTaskFormErrors(err.response.data);
         } else {
            addToast('Erro ao atualizar tarefa', 'error');
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDeleteTask = async (taskId: number) => {
      if (!user || !confirm('Tem certeza que deseja deletar esta tarefa?')) return;

      try {
         await axios.delete(`http://localhost:3000/tasks/${taskId}`, {
            withCredentials: true
         });
         fetchTasks(user.id);
         addToast('Tarefa deletada com sucesso!', 'success');
      } catch (err) {
         console.error('Erro ao deletar tarefa:', err);
         addToast('Erro ao deletar tarefa', 'error');
      }
   };

   const handleToggleComplete = async (taskId: number, isCompleted: boolean) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      try {
         await axios.put(`http://localhost:3000/tasks/${taskId}`, {
            title: task.title,
            description: task.description,
            completed: isCompleted ? 1 : 0
         }, {
            withCredentials: true
         });
         fetchTasks(user!.id);
         addToast(isCompleted ? 'Tarefa marcada como completa!' : 'Tarefa marcada como pendente!', 'success');
      } catch (err) {
         console.error('Erro ao atualizar tarefa:', err);
         addToast('Erro ao atualizar tarefa', 'error');
      }
   };

   const handleOpenFormForEdit = (task: Task) => {
      setEditingTask(task);
      setIsFormOpen(true);
   };

   const handleCloseForm = () => {
      setIsFormOpen(false);
      setEditingTask(null);
      setTaskFormErrors([]);
   };

   const handleFormSubmit = (data: { title: string; description: string; completed: number }) => {
      if (editingTask) {
         handleEditTask(data);
      } else {
         handleCreateTask(data);
      }
   };

   const filteredTasks = tasks.filter(task => {
      if (filter === 'completed') return task.completed === 1;
      return task.completed === 0;
   });

   const pendingCount = tasks.filter(t => t.completed === 0).length;
   const completedCount = tasks.filter(t => t.completed === 1).length;

   return (
      <>
         <Toast toasts={toasts} onRemove={removeToast} />
         {currentPage === 'profile' && user ? (
            <ProfilePage
               user={user}
               onBack={() => setCurrentPage('dashboard')}
               onUpdateUser={handleUpdateUserProfile}
            />
         ) : (
            <div className="min-h-full">
               <Navbar user={user} onProfileClick={() => setCurrentPage('profile')} onNewTaskClick={() => {
                  setEditingTask(null);
                  setIsFormOpen(true);
               }} />

               <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
                  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                     <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Lista de tarefas</h1>
                        <button
                           onClick={() => {
                              setEditingTask(null);
                              setIsFormOpen(true);
                           }}
                           className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 transition"
                        >
                           <PlusIcon className="h-5 w-5" />
                           Nova Tarefa
                        </button>
                     </div>
                  </div>
               </header>

               <main>
                  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                     {error && (
                        <div className="mb-4 rounded-lg bg-red-900/30 border border-red-800 p-4 text-red-400">
                           {error}
                        </div>
                     )}

                     {/* Filtros */}
                     <div className="mb-6 flex flex-wrap gap-2">
                        <button
                           onClick={() => setFilter('pending')}
                           className={`rounded-lg px-4 py-2 font-medium transition ${filter === 'pending'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                        >
                           Pendente ({pendingCount})
                        </button>
                        <button
                           onClick={() => setFilter('completed')}
                           className={`rounded-lg px-4 py-2 font-medium transition ${filter === 'completed'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                        >
                           Completas ({completedCount})
                        </button>
                     </div>

                     {isLoading ? (
                        <div className="text-center text-gray-400">Carregando tarefas...</div>
                     ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                           <p className="text-gray-400 text-lg">
                              {tasks.length === 0 ? 'Nenhuma tarefa criada ainda' : 'Nenhuma tarefa neste filtro'}
                           </p>
                        </div>
                     ) : (
                        <div className="grid gap-4">
                           {filteredTasks.map(task => (
                              <TaskCard
                                 key={task.id}
                                 task={task}
                                 onEdit={handleOpenFormForEdit}
                                 onDelete={handleDeleteTask}
                                 onToggleComplete={handleToggleComplete}
                              />
                           ))}
                        </div>
                     )}
                  </div>
               </main>

               <TaskForm
                  isOpen={isFormOpen}
                  onClose={handleCloseForm}
                  onSubmit={handleFormSubmit}
                  editingTask={editingTask}
                  isSubmitting={isSubmitting}
                  errors={taskFormErrors}
               />
            </div>
         )}
      </>
   )
}

export function TodoForm() {
   const [task, setTask] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!task.trim()) {
         setError("Informe uma tarefa antes de salvar.");
         return;
      }

      setError(""); // limpa erro quando válido
      setTask("");
   };

   return (
      <form onSubmit={handleSubmit}>
         <input
            value={task}
            onChange={(e) => {
               setTask(e.target.value);
               if (error) setError("");
            }}
            placeholder="Digite uma tarefa"
         />

         {error && <p className="text-red-500 mt-2">{error}</p>}

         <button type="submit">Adicionar</button>
      </form>
   );
}
