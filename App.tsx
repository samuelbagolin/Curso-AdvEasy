
import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProgressBar } from './components/ProgressBar';
import { QuizView } from './components/QuizView';
import { storageService } from './services/storageService';
import { User, UserProgress, VisualConfig, Course } from './types';
import { AdminDashboard } from './components/AdminDashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [course, setCourse] = useState(storageService.getCourse());
  const [visualConfig, setVisualConfig] = useState<VisualConfig>(storageService.getVisualConfig());
  const [progress, setProgress] = useState<UserProgress>({ completedLessons: [], passedQuizzes: [] });
  const [activeContent, setActiveContent] = useState<{ type: 'lesson' | 'quiz' | 'admin', id: string }>({ 
    type: 'lesson', 
    id: '' 
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Injetar variáveis de CSS para controle dinâmico de cores
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', visualConfig.primaryColor);
    root.style.setProperty('--bg-color', visualConfig.backgroundColor);
  }, [visualConfig]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;
    const users = storageService.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setProgress(storageService.getProgress(user.id));
      if (user.role === 'admin') {
        setActiveContent({ type: 'admin', id: 'content' });
      } else {
        setActiveContent({ type: 'lesson', id: course.modules[0]?.lessons[0]?.id || '' });
      }
    } else {
      alert('Login ou senha inválidos!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveContent({ type: 'lesson', id: '' });
  };

  const handleCompleteLesson = (id: string) => {
    if (!currentUser) return;
    const newProgress = storageService.markLessonComplete(currentUser.id, id);
    setProgress({ ...newProgress });
  };

  const handlePassQuiz = (moduleId: string) => {
    if (!currentUser) return;
    const newProgress = storageService.markQuizPassed(currentUser.id, moduleId);
    setProgress({ ...newProgress });
  };

  const currentLesson = useMemo(() => {
    if (activeContent.type !== 'lesson') return null;
    for (const m of course.modules) {
      const lesson = m.lessons.find(l => l.id === activeContent.id);
      if (lesson) return { lesson, module: m };
    }
    return null;
  }, [activeContent, course]);

  const currentQuizModule = useMemo(() => {
    if (activeContent.type !== 'quiz') return null;
    return course.modules.find(m => m.id === activeContent.id);
  }, [activeContent, course]);

  const totalLessons = useMemo(() => {
    return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  }, [course]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 max-w-md w-full p-10 fade-in border border-slate-100">
          <div className="text-center mb-10">
            <div className="bg-slate-50 p-4 rounded-2xl inline-block mb-6">
              <img src={visualConfig.logoUrl} alt="Logo" className="h-10 mx-auto object-contain" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-800">Acesso Restrito</h1>
            <p className="text-slate-400 text-sm mt-2">Plataforma Educacional Premium</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Usuário</label>
              <input name="username" type="text" className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-slate-300 outline-none transition-all text-sm font-medium" required />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Senha</label>
              <input name="password" type="password" className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-slate-300 outline-none transition-all text-sm font-medium" required />
            </div>
            <button type="submit" className="w-full py-4 rounded-xl font-black text-white shadow-lg transition-all active:scale-95" style={{ backgroundColor: visualConfig.primaryColor }}>
              ENTRAR NA PLATAFORMA
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Demonstração</p>
            <p className="text-xs text-slate-400 mt-1">Admin: <b>admin/123</b> | Aluno: <b>advogado/123</b></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        progress={progress}
        activeId={activeContent.type === 'lesson' ? activeContent.id : activeContent.type === 'quiz' ? `quiz_${activeContent.id}` : `admin_${activeContent.id}`}
        onSelectLesson={(id) => setActiveContent({ type: 'lesson', id })}
        onSelectQuiz={(id) => setActiveContent({ type: 'quiz', id })}
        onSelectAdmin={(id) => setActiveContent({ type: 'admin', id })}
        isMobileOpen={isMobileMenuOpen}
        toggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        currentUser={currentUser}
        onLogout={handleLogout}
        courseData={course}
        visualConfig={visualConfig}
      />

      <main className="flex-1 lg:ml-80 transition-all duration-300">
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
             </button>
             <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block truncate max-w-md">{course.title}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            {currentUser.role === 'student' && (
              <div className="w-32 lg:w-48">
                 <ProgressBar current={progress.completedLessons.length} total={totalLessons} />
              </div>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-700">{currentUser.name}</p>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{currentUser.role === 'admin' ? 'Curador' : 'Advogado'}</p>
            </div>
          </div>
        </header>

        <div className="px-6 py-10 lg:p-12 max-w-5xl mx-auto">
          {activeContent.type === 'admin' && currentUser.role === 'admin' && (
            <AdminDashboard 
              activeTab={activeContent.id} 
              course={course}
              onCourseUpdate={(c) => { storageService.saveCourse(c); setCourse(c); }}
              visualConfig={visualConfig}
              onVisualUpdate={(v) => { storageService.saveVisualConfig(v); setVisualConfig(v); }}
            />
          )}

          {activeContent.type === 'lesson' && currentLesson && (
            <div className="fade-in max-w-4xl mx-auto">
              <nav className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                <span>{currentLesson.module.title}</span>
                <span className="text-slate-200">/</span>
                <span className="text-slate-400">Aula {currentLesson.lesson.order}</span>
              </nav>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">{currentLesson.lesson.title}</h1>
              
              <div className="card-light p-8 lg:p-12 mb-12">
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                  {currentLesson.lesson.content.split('\n').map((p, i) => <p key={i} className="mb-6">{p}</p>)}
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-6 items-center justify-between pt-10 border-t border-slate-50">
                  <div className="text-slate-400 text-xs italic font-medium">LMS Education Premium — Copyright 2024</div>
                  <button
                    onClick={() => handleCompleteLesson(currentLesson.lesson.id)}
                    className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-xs tracking-widest transition-all shadow-lg ${progress.completedLessons.includes(currentLesson.lesson.id) ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none' : 'text-white hover:opacity-90 active:scale-95'}`}
                    style={{ backgroundColor: progress.completedLessons.includes(currentLesson.lesson.id) ? undefined : visualConfig.primaryColor }}
                  >
                    {progress.completedLessons.includes(currentLesson.lesson.id) ? '✓ CONCLUÍDA' : 'MARCAR COMO CONCLUÍDA'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeContent.type === 'quiz' && currentQuizModule && (
            <QuizView quiz={currentQuizModule.quiz} moduleTitle={currentQuizModule.title} onPass={handlePassQuiz} primaryColor={visualConfig.primaryColor} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
