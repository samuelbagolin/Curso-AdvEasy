
import React, { useState } from 'react';
import { Quiz, Question } from '../types';

interface QuizViewProps {
  quiz: Quiz;
  moduleTitle: string;
  onPass: (quizId: string) => void;
  primaryColor: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz, moduleTitle, onPass, primaryColor }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  const calculateResult = () => {
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    
    const score = (correct / quiz.questions.length) * 100;
    const passed = score >= 70;
    
    setResult({ score, passed });
    if (passed) onPass(quiz.moduleId);
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center fade-in">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 ${result.passed ? 'bg-emerald-100 text-emerald-600 shadow-emerald-200' : 'bg-rose-100 text-rose-600 shadow-rose-200'} shadow-lg`}>
          {result.passed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h2 className="text-4xl font-serif font-bold text-slate-800 mb-4">
          {result.passed ? 'Excelente Resultado!' : 'Quase lá...'}
        </h2>
        <p className="text-slate-600 mb-10 text-lg leading-relaxed">
          Você atingiu <span className="font-bold text-slate-900">{result.score}%</span> de acerto. 
          A aprovação exige no mínimo 70%.
        </p>
        
        {result.passed ? (
          <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl mb-10 max-w-md mx-auto">
            <p className="text-emerald-800 font-bold">Módulo Concluído com Sucesso!</p>
            <p className="text-emerald-700 text-sm mt-2">Os próximos conteúdos foram liberados para você.</p>
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl mb-10 max-w-md mx-auto">
            <p className="text-rose-800 font-bold">Aproveite para revisar as aulas.</p>
            <p className="text-rose-700 text-sm mt-2">Volte ao conteúdo do módulo para garantir o aprendizado.</p>
          </div>
        )}

        <button 
          onClick={restart}
          className="px-12 py-4 rounded-xl font-bold text-white shadow-xl hover:opacity-90 transition-all transform hover:scale-105"
          style={{ backgroundColor: primaryColor }}
        >
          {result.passed ? 'Refazer Teste' : 'Tentar Novamente'}
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentStep];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 fade-in">
      <div className="mb-10">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Avaliação de Módulo</span>
        <h2 className="text-3xl font-serif font-bold text-slate-800 leading-tight">{moduleTitle}</h2>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pergunta {currentStep + 1} de {quiz.questions.length}</span>
          <div className="flex gap-1.5">
            {quiz.questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentStep ? 'w-6' : 'bg-slate-200'}`} style={{ backgroundColor: i === currentStep ? primaryColor : undefined }} />
            ))}
          </div>
        </div>
        
        <div className="p-10">
          <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">{currentQuestion.text}</h3>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(currentStep, idx)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center gap-5 group ${answers[currentStep] === idx ? 'border-amber-500 bg-amber-50/30 shadow-inner' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
              >
                <span className={`w-8 h-8 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${answers[currentStep] === idx ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-200 text-slate-400 group-hover:border-slate-300'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className={`text-lg transition-all ${answers[currentStep] === idx ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-10 py-8 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-6 py-3 rounded-lg font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all uppercase text-xs tracking-widest"
          >
            Anterior
          </button>
          
          {currentStep === quiz.questions.length - 1 ? (
            <button
              disabled={answers[currentStep] === undefined}
              onClick={calculateResult}
              className="px-10 py-3 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 transition-all hover:opacity-90 transform active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              FINALIZAR AVALIAÇÃO
            </button>
          ) : (
            <button
              disabled={answers[currentStep] === undefined}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-10 py-3 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 transition-all hover:opacity-90 transform active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              PRÓXIMA PERGUNTA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
