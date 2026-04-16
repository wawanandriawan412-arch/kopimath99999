import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateMathProblem, MathProblem } from './services/gemini';
import { Coffee, Leaf, Clock, Brain, ChevronRight, CheckCircle2, XCircle, ArrowRight, Loader2, Trophy } from 'lucide-react';

type ViewState = 'home' | 'loading' | 'quiz' | 'result';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userContext, setUserContext] = useState<string>('');

  const startQuiz = async () => {
    if (!userContext.trim()) {
      alert("Tuliskan sedikit kegiatanmu hari ini dulu ya!");
      return;
    }
    
    setView('loading');
    try {
      const newProblem = await generateMathProblem(userContext);
      setProblem(newProblem);
      setSelectedAnswer(null);
      setView('quiz');
    } catch (error) {
      console.error("Failed to generate problem:", error);
      setView('home');
      alert("Maaf, gagal memuat soal. Coba lagi ya!");
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (problem && answer === problem.correctAnswer) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    setView('result');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-amber-200">
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-xl tracking-tight">
          <Coffee className="w-6 h-6 text-amber-700" />
          <span>KopiMath</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-stone-600">
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-amber-700">{score}</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-700">{streak}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pt-8 pb-12">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <Brain className="w-12 h-12 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-stone-800">
                Halo, Pejuang Hebat!
              </h1>
              <p className="text-stone-600 leading-relaxed">
                Kami tahu kamu sibuk membantu orang tua memanen kopi dan mencari rumput. 
                Yuk, asah otakmu dengan 1 soal matematika singkat di sela waktu istirahatmu!
              </p>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 w-full flex items-center gap-4 text-left">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800">Sesi Kilat</h3>
                  <p className="text-sm text-stone-500">Hanya butuh 2-3 menit</p>
                </div>
              </div>

              <div className="w-full space-y-2">
                <label className="block text-sm font-semibold text-stone-700 text-left">
                  Ceritakan sedikit kegiatanmu hari ini:
                </label>
                <textarea
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder="Contoh: Hari ini saya panen 3 keranjang kopi dan cari 2 karung rumput..."
                  className="w-full p-4 rounded-2xl border border-stone-200 focus:border-amber-400 focus:ring focus:ring-amber-400/20 outline-none resize-none h-28 text-stone-700 text-sm"
                />
              </div>

              <button
                onClick={startQuiz}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-md shadow-amber-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Mulai Belajar Sekarang
                <ChevronRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-stone-400 pt-4 font-medium">
                Diciptakan oleh Fitri Handayani, dkk
              </p>
            </motion.div>
          )}

          {view === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
              <p className="text-stone-500 font-medium animate-pulse">Menyiapkan soal untukmu...</p>
            </motion.div>
          )}

          {view === 'quiz' && problem && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
                <h2 className="text-lg font-medium text-stone-800 leading-relaxed">
                  {problem.question}
                </h2>
              </div>

              <div className="space-y-3">
                {problem.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    className="w-full bg-white hover:bg-amber-50 border-2 border-stone-200 hover:border-amber-400 text-stone-700 font-medium py-4 px-6 rounded-2xl transition-all text-left flex items-center justify-between group active:scale-[0.98]"
                  >
                    <span>{opt}</span>
                    <div className="w-6 h-6 rounded-full border-2 border-stone-300 group-hover:border-amber-400 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-amber-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'result' && problem && selectedAnswer && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className={`p-6 rounded-3xl text-center ${selectedAnswer === problem.correctAnswer ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {selectedAnswer === problem.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                    <h2 className="text-2xl font-bold mb-2">Mantap Sekali!</h2>
                    <p className="font-medium">Jawabanmu benar.</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
                    <h2 className="text-2xl font-bold mb-2">Hampir Benar!</h2>
                    <p className="font-medium">Jawaban yang tepat adalah <strong>{problem.correctAnswer}</strong></p>
                  </>
                )}
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-4">
                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-600" />
                  Cara Mengerjakan:
                </h3>
                <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                  {problem.explanation}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setView('home')}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold py-4 px-4 rounded-2xl transition-all active:scale-[0.98]"
                >
                  Istirahat Dulu
                </button>
                <button
                  onClick={startQuiz}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-4 rounded-2xl shadow-md shadow-amber-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Lanjut
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
