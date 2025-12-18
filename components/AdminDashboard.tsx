
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { User, Course, Module, Lesson, VisualConfig } from '../types';

interface AdminDashboardProps {
  activeTab: string;
  course: Course;
  onCourseUpdate: (course: Course) => void;
  visualConfig: VisualConfig;
  onVisualUpdate: (config: VisualConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab, course, onCourseUpdate, visualConfig, onVisualUpdate }) => {
  const [users, setUsers] = useState(storageService.getUsers());
  const [editingLesson, setEditingLesson] = useState<{modId: string, lesson: Lesson} | null>(null);

  // --- Usuários ---
  const handleAddUser = () => {
    const name = prompt('Nome:');
    const user = prompt('Login:');
    const pass = prompt('Senha:');
    if (name && user && pass) {
      const newUsers = [...users, { id: Date.now().toString(), name, username: user, password: pass, role: 'student' as const }];
      storageService.saveUsers(newUsers);
      setUsers(newUsers);
    }
  };

  const handleUserDelete = (id: string) => {
    if (id === 'admin') return alert('Não exclua o ADM!');
    if (confirm('Excluir este usuário?')) {
      const newUsers = users.filter(u => u.id !== id);
      storageService.saveUsers(newUsers);
      setUsers(newUsers);
    }
  };

  // --- Conteúdo ---
  const handleAddModule = () => {
    const title = prompt('Título do Módulo:');
    if (!title) return;
    const newModule: Module = {
      id: 'm' + Date.now(),
      order: course.modules.length + 1,
      title,
      summary: 'Resumo do novo módulo',
      lessons: [],
      quiz: { id: 'q' + Date.now(), moduleId: 'm' + Date.now(), passingScore: 70, questions: [] }
    };
    onCourseUpdate({ ...course, modules: [...course.modules, newModule] });
  };

  const handleDeleteModule = (id: string) => {
    if (confirm('Excluir este módulo inteiro?')) {
      onCourseUpdate({ ...course, modules: course.modules.filter(m => m.id !== id) });
    }
  };

  const handleAddLesson = (modId: string) => {
    const title = prompt('Título da Aula:');
    if (!title) return;
    
    const newModules = course.modules.map(m => {
      if (m.id === modId) {
        const newLesson: Lesson = { 
          id: 'l' + Date.now(), 
          title, 
          order: m.lessons.length + 1, 
          content: 'Novo conteúdo' 
        };
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    });
    
    onCourseUpdate({ ...course, modules: newModules });
  };

  const handleLessonSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    const newModules = course.modules.map(m => {
      if (m.id === editingLesson.modId) {
        const newLessons = m.lessons.map(l => 
          l.id === editingLesson.lesson.id ? editingLesson.lesson : l
        );
        return { ...m, lessons: newLessons };
      }
      return m;
    });

    onCourseUpdate({ ...course, modules: newModules });
    setEditingLesson(null);
  };

  if (activeTab === 'users') {
    return (
      <div className="fade-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold">Usuários & Acessos</h2>
          <button onClick={handleAddUser} className="px-6 py-2 rounded-xl text-white font-bold text-xs btn-primary shadow-lg">ADICIONAR ADVOGADO</button>
        </div>
        <div className="card-light overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Nome</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Login</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700">{u.name} {u.role === 'admin' && '⭐'}</td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{u.username}</td>
                  <td className="p-4 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => handleUserDelete(u.id)} className="text-rose-500 font-black text-[10px] hover:underline">REMOVER</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 'content') {
    return (
      <div className="fade-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold">Estrutura do Curso</h2>
          <button onClick={handleAddModule} className="px-6 py-2 rounded-xl text-white font-bold text-xs btn-primary shadow-lg">NOVO MÓDULO</button>
        </div>
        <div className="space-y-8">
          {course.modules.map(m => (
            <div key={m.id} className="card-light p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Módulo {m.order}: {m.title}</h3>
                  <p className="text-xs text-slate-400 italic">Módulo de nível {m.order}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleDeleteModule(m.id)} className="text-[10px] font-black text-rose-500 px-3 py-1 border border-rose-100 rounded hover:bg-rose-50 transition-colors">EXCLUIR MÓDULO</button>
                   <button onClick={() => handleAddLesson(m.id)} className="text-[10px] font-black text-emerald-600 px-3 py-1 border border-emerald-100 rounded hover:bg-emerald-50 transition-colors">+ AULA</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {m.lessons.map(l => (
                  <div key={l.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group transition-all">
                    <span className="text-xs font-bold text-slate-600 truncate mr-2"> Aula {l.order}: {l.title}</span>
                    <button onClick={() => setEditingLesson({ modId: m.id, lesson: l })} className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">EDITAR</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {course.modules.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-medium">Nenhum módulo criado. Comece adicionando o primeiro!</p>
            </div>
          )}
        </div>

        {editingLesson && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="card-light w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl">
              <h2 className="text-3xl font-serif font-bold mb-8">Editor de Aula</h2>
              <form onSubmit={handleLessonSave} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Título da Aula</label>
                  <input value={editingLesson.lesson.title} onChange={e => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, title: e.target.value}})} className="w-full border-2 border-slate-100 p-3 rounded-xl outline-none focus:border-slate-300" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Conteúdo Educacional</label>
                  <textarea rows={10} value={editingLesson.lesson.content} onChange={e => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, content: e.target.value}})} className="w-full border-2 border-slate-100 p-3 rounded-xl outline-none focus:border-slate-300 text-sm leading-relaxed" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-xs tracking-widest hover:opacity-90 transition-opacity">SALVAR ALTERAÇÕES</button>
                  <button type="button" onClick={() => setEditingLesson(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-xs tracking-widest hover:bg-slate-200 transition-colors">CANCELAR</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'visual') {
    return (
      <div className="fade-in max-w-2xl">
        <h2 className="text-3xl font-serif font-bold mb-8">Identidade Visual</h2>
        <div className="card-light p-10 space-y-8">
           <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3">URL da Logomarca (SVG/PNG)</label>
              <input type="text" value={visualConfig.logoUrl} onChange={e => onVisualUpdate({ ...visualConfig, logoUrl: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl outline-none" />
              <div className="mt-4 p-4 bg-slate-50 rounded-xl flex justify-center border border-slate-100"><img src={visualConfig.logoUrl} alt="Preview" className="h-10 object-contain" /></div>
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3">Cor de Destaque (Principal)</label>
                <div className="flex items-center gap-4">
                  <input type="color" value={visualConfig.primaryColor} onChange={e => onVisualUpdate({ ...visualConfig, primaryColor: e.target.value })} className="h-12 w-20 rounded-xl cursor-pointer" />
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">{visualConfig.primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3">Cor de Fundo da Área de Estudo</label>
                <div className="flex items-center gap-4">
                  <input type="color" value={visualConfig.backgroundColor} onChange={e => onVisualUpdate({ ...visualConfig, backgroundColor: e.target.value })} className="h-12 w-20 rounded-xl cursor-pointer" />
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">{visualConfig.backgroundColor}</span>
                </div>
              </div>
           </div>
           <div className="p-4 border-l-4 border-amber-400 bg-amber-50 rounded-r-xl">
             <p className="text-xs text-amber-800 font-medium">As alterações visuais são aplicadas instantaneamente e refletidas para todos os alunos.</p>
           </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'reports') {
    const allProgress = storageService.getAllProgress();
    const students = users.filter(u => u.role === 'student');
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

    return (
      <div className="fade-in">
        <h2 className="text-3xl font-serif font-bold mb-8">Progresso dos Advogados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {students.map(s => {
             const prog = allProgress[s.id] || { completedLessons: [], passedQuizzes: [] };
             const perc = totalLessons > 0 ? Math.round((prog.completedLessons.length / totalLessons) * 100) : 0;
             return (
               <div key={s.id} className="card-light p-6 flex items-center justify-between">
                 <div>
                   <h4 className="font-bold text-slate-800">{s.name}</h4>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Aulas: {prog.completedLessons.length}/{totalLessons}</p>
                 </div>
                 <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">{perc}%</span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden"><div className="h-full btn-primary" style={{ width: `${perc}%` }}></div></div>
                 </div>
               </div>
             );
           })}
           {students.length === 0 && (
             <div className="col-span-full text-center py-20 text-slate-400">Nenhum aluno cadastrado.</div>
           )}
        </div>
      </div>
    );
  }

  return null;
};
