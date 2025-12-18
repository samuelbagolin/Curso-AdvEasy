
import React from 'react';
import { User, UserProgress, Course, VisualConfig } from '../types';

interface SidebarProps {
  progress: UserProgress;
  activeId: string;
  onSelectLesson: (id: string) => void;
  onSelectQuiz: (moduleId: string) => void;
  onSelectAdmin: (tab: string) => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
  currentUser: User;
  onLogout: () => void;
  courseData: Course;
  visualConfig: VisualConfig;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  progress, 
  activeId, 
  onSelectLesson, 
  onSelectQuiz,
  onSelectAdmin,
  isMobileOpen,
  toggleMobile,
  currentUser,
  onLogout,
  courseData,
  visualConfig
}) => {
  const isLessonComplete = (id: string) => progress.completedLessons.includes(id);
  const isQuizPassed = (id: string) => progress.passedQuizzes.includes(id);

  const checkModuleAccess = (index: number) => {
    if (currentUser.role === 'admin' || index === 0) return true;
    return isQuizPassed(courseData.modules[index - 1]?.id);
  };

  return (
    <aside className={`sidebar-light fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        {/* Brand Section */}
        <div className="p-8 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-slate-50 p-3 rounded-xl">
              <img src={visualConfig.logoUrl} alt="LMS Logo" className="h-8 w-auto object-contain" />
            </div>
            <button onClick={toggleMobile} className="lg:hidden text-slate-400 hover:text-slate-600"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <h1 className="text-xl font-bold font-serif text-slate-900 leading-tight">Advocacia Pro</h1>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">PLATAFORMA PREMIUM</p>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 overflow-y-auto custom-scroll p-4 space-y-8">
          
          {currentUser.role === 'admin' && (
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Gestão Master</h3>
              <ul className="space-y-1">
                {[
                  { id: 'content', label: 'Curso & Conteúdo' },
                  { id: 'users', label: 'Usuários' },
                  { id: 'visual', label: 'Identidade Visual' },
                  { id: 'reports', label: 'Progresso Geral' }
                ].map(tab => (
                  <li key={tab.id}>
                    <button
                      onClick={() => { onSelectAdmin(tab.id); toggleMobile(); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeId === `admin_${tab.id}` ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                      style={{ borderLeftColor: activeId === `admin_${tab.id}` ? visualConfig.primaryColor : 'transparent', borderLeftWidth: activeId === `admin_${tab.id}` ? '4px' : '0' }}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Módulos do Curso</h3>
            <div className="space-y-6">
              {courseData.modules.map((module, idx) => {
                const hasAccess = checkModuleAccess(idx);
                return (
                  <div key={module.id} className={hasAccess ? 'opacity-100' : 'opacity-40 grayscale'}>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3 px-3">Módulo {module.order}</p>
                    <ul className="space-y-1">
                      {module.lessons.map(lesson => (
                        <li key={lesson.id}>
                          <button
                            onClick={() => { if (hasAccess) onSelectLesson(lesson.id); toggleMobile(); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all text-left ${activeId === lesson.id ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
                          >
                            <span className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${isLessonComplete(lesson.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}>
                              {isLessonComplete(lesson.id) && <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                            </span>
                            <span className="truncate">{lesson.title}</span>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => { if (hasAccess) onSelectQuiz(module.id); toggleMobile(); }}
                          className={`w-full py-2.5 mt-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isQuizPassed(module.id) ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : activeId === `quiz_${module.id}` ? 'border-amber-400 text-amber-600' : 'border-slate-100 text-slate-300 hover:border-slate-200 hover:text-slate-500'}`}
                        >
                          {isQuizPassed(module.id) ? '✓ AVALIAÇÃO CONCLUÍDA' : 'REALIZAR AVALIAÇÃO'}
                        </button>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer User Section */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="mb-4">
            <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Sessão Ativa</p>
          </div>
          <button onClick={onLogout} className="w-full py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-rose-500 hover:border-rose-200 transition-all">Encerrar Sessão</button>
        </div>
      </div>
    </aside>
  );
};
