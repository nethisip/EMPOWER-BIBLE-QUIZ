/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Timer, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  SkipForward, 
  Users,
  Power,
  Award,
  CircleDot
} from 'lucide-react';
import { QUESTIONS, INITIAL_TEAMS, TIMER_DURATION, type Team, type Question } from './constants';

type GameStatus = 'idle' | 'playing' | 'finished';

export default function App() {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [winners, setWinners] = useState<Set<string>>(new Set());
  
  // New States for requested features
  const [preQuestionCountdown, setPreQuestionCountdown] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const levelQuestions = QUESTIONS.filter(q => q.level === selectedLevel);
  const currentQuestion = levelQuestions[currentQuestionIndex];

  // Main Timer Logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsTimerRunning(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  // Pre-Question Countdown Logic (5 seconds)
  useEffect(() => {
    if (preQuestionCountdown !== null && preQuestionCountdown > 0) {
      countdownRef.current = setTimeout(() => {
        setPreQuestionCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (preQuestionCountdown === 0) {
      setPreQuestionCountdown(null);
      setIsTimerRunning(true);
      // Staggered reveal of options is handled by animation
      setShowOptions(true);
    }
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [preQuestionCountdown]);

  const startGame = (level: 1 | 2 | 3) => {
    setSelectedLevel(level);
    setCurrentQuestionIndex(0);
    setStatus('playing');
    triggerNewQuestion();
  };

  const triggerNewQuestion = () => {
    setPreQuestionCountdown(3);
    setTimeLeft(TIMER_DURATION);
    setIsTimerRunning(false); // Wait for countdown
    setShowAnswer(false);
    setShowOptions(false);
    setWinners(new Set());
  };

  const resetScores = () => {
    setTeams(INITIAL_TEAMS.map(t => ({ ...t, score: 0 })));
  };

  const toggleWinner = (teamId: string) => {
    setWinners(prev => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      return next;
    });
  };

  const handleAwardPointsAndNext = () => {
    const points = selectedLevel === 1 ? 10 : selectedLevel === 2 ? 20 : 30;
    setTeams(prev => prev.map(t => {
      if (winners.has(t.id)) {
        return { ...t, score: t.score + points };
      }
      return t;
    }));

    if (currentQuestionIndex < levelQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      triggerNewQuestion();
    } else {
      setStatus('finished');
      setIsTimerRunning(false);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < levelQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      triggerNewQuestion();
    } else {
      setStatus('finished');
      setIsTimerRunning(false);
    }
  };

  const restartGame = () => {
    setStatus('idle');
  };

  if (status === 'idle') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-red-600 selection:text-white overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full bg-white text-black p-8 md:p-16 text-center border-[12px] border-black shadow-[20px_20px_0px_0px_rgba(239,68,68,1)] relative z-10"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-1 bg-black flex-1"></div>
            <h2 className="text-xl font-black tracking-[0.4em] uppercase text-red-600 italic">Official Board</h2>
            <div className="h-1 bg-black flex-1"></div>
          </div>
          
          <div className="relative mb-12">
            <h1 className="text-6xl md:text-9xl font-black mb-0 tracking-tighter leading-none flex flex-wrap items-center justify-center gap-x-2 md:gap-x-4">
              <span>EMP</span>
              <span className="text-red-600 relative">
                <Power className="w-20 h-20 md:w-32 md:h-32 stroke-[5] animate-pulse" />
              </span>
              <span>WER</span>
            </h1>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight bg-black text-gold px-8 py-2 inline-block transform -skew-x-6 border-4 border-red-600 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] mt-4">
              BIBLE QUIZ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((lv) => (
              <button
                key={lv}
                onClick={() => startGame(lv as 1|2|3)}
                className="group relative border-[6px] border-black p-8 bg-white hover:bg-black transition-all text-center flex flex-col items-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                <span className="text-sm font-black text-red-600 group-hover:text-gold uppercase mb-2">Level 0{lv}</span>
                <span className="text-4xl font-black group-hover:text-white uppercase transition-colors italic">{lv === 1 ? 'EASY' : lv === 2 ? 'HARD' : 'ELITE'}</span>
                <Play className="mt-4 w-8 h-8 text-black group-hover:text-red-600 transition-colors" />
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={resetScores}
              className="px-8 py-4 bg-gray-100 border-[4px] border-black font-black text-lg hover:bg-red-600 hover:text-white transition-all uppercase italic tracking-widest"
            >
              Reset Global Scores
            </button>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-[20px] border-t-[20px] border-red-600 m-8"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-[20px] border-b-[20px] border-gold m-8"></div>
      </div>
    );
  }

  if (status === 'finished') {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    const winner = sortedTeams[0];
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full bg-white border-[12px] border-gold p-12 text-center shadow-[32px_32px_0px_0px_rgba(239,68,68,1)]"
        >
          <Trophy className="w-24 h-24 text-red-600 mx-auto mb-6" />
          <h2 className="text-7xl font-black text-black mb-2 uppercase tracking-tighter italic leading-none">Victory Decided</h2>
          <div className="h-4 bg-black w-48 mx-auto mb-10"></div>
          
          <div className="bg-red-600 text-white p-10 mb-12 transform -rotate-1 border-[6px] border-black inline-block px-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-6xl font-black uppercase tracking-widest leading-none">{winner.name}</h3>
            <p className="text-3xl font-bold mt-4 tracking-tighter">DOMINATED WITH {winner.score} POINTS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {sortedTeams.slice(1).map((team, idx) => (
              <div key={team.id} className="border-4 border-black p-6 flex justify-between items-center bg-gray-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-4">
                  <span className="font-black text-2xl italic text-red-600">#{idx + 2}</span>
                  <span className="font-black uppercase tracking-tight text-xl">{team.name}</span>
                </div>
                <span className="text-3xl font-black">{team.score}</span>
              </div>
            ))}
          </div>

          <button
            onClick={restartGame}
            className="flex items-center justify-center gap-6 bg-black text-white px-12 py-8 text-2xl font-black hover:bg-red-600 transition-all w-full uppercase italic tracking-[0.2em] shadow-[12px_12px_0px_0px_rgba(255,215,0,1)]"
          >
            <RotateCcw className="w-8 h-8" /> Return to Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Dynamic Header */}
      <header className="px-8 py-6 border-b-[8px] border-black bg-white flex justify-between items-center sticky top-0 z-40 bg-white">
        <div className="flex-1 flex justify-start">
          <button 
            onClick={restartGame}
            className="p-4 bg-black text-white hover:bg-red-600 transition-all shadow-[4px_4px_0px_0px_rgba(212,175,55,1)]"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex justify-center">
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-1 group">
               EMP<Power className="w-8 h-8 text-red-600 stroke-[5] group-hover:scale-110 transition-transform" />WER 
               <span className="bg-black text-gold px-3 py-1 ml-2 italic text-2xl">QUIZ</span>
            </h1>
        </div>

        <div className="flex-1 flex justify-end gap-12 items-center">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest mb-1 italic">Battle Timer</span>
            <div className={`text-5xl font-mono font-black tabular-nums flex items-center gap-3 ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
               {timeLeft.toString().padStart(2, '0')}<span className="text-2xl opacity-30 font-sans italic">S</span>
            </div>
          </div>
          
          <div className="hidden lg:block w-32 bg-gray-200 h-16 border-[4px] border-black relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <motion.div 
               className="absolute top-0 left-0 bottom-0 bg-red-600"
               initial={{ width: '100%' }}
               animate={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
               transition={{ ease: 'linear' }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-10 p-6 lg:p-12 max-w-[1700px] mx-auto w-full relative">
        
        {/* Left Column: The Action Board */}
        <div className="md:col-span-8 flex flex-col gap-10">
          <section className="bg-white border-[8px] border-black p-10 md:p-20 relative overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex-1 min-h-[600px] flex flex-col justify-center items-center text-center">
            
            {/* The 5s Countdown Screen */}
            <AnimatePresence>
              {preQuestionCountdown !== null && (
                <motion.div 
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 bg-black z-30 flex flex-col items-center justify-center"
                >
                  <span className="text-red-600 font-black text-2xl uppercase tracking-[0.5em] mb-8 animate-pulse italic">Get Ready</span>
                  <span className="text-[15rem] font-black text-white leading-none italic">{preQuestionCountdown}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-0 right-0 bg-red-600 text-gold px-10 py-4 font-black uppercase tracking-widest text-lg transform -skew-x-12 translate-x-4 border-b-4 border-l-4 border-black">
              LEVEL {selectedLevel} • Q{currentQuestionIndex + 1}
            </div>

            <AnimatePresence mode="wait">
              {preQuestionCountdown === null && (
                <motion.div 
                  key="question-box"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col items-center"
                >
                  <h2 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-16 uppercase italic break-words max-w-5xl">
                    {currentQuestion.text}
                  </h2>

                  {/* Multiple Choice Options - Revealed Staggered */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-12">
                    {currentQuestion.options.map((option, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={showOptions ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: idx * 0.4 }}
                        className={`
                          flex items-center gap-6 p-6 border-4 border-black bg-white text-left transition-all
                          ${showAnswer && option === currentQuestion.answer ? 'bg-red-600 border-gold text-white scale-[1.05] z-10 shadow-[10px_10px_0px_0px_rgba(212,175,55,1)]' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]'}
                        `}
                      >
                        <span className={`
                          w-14 h-14 flex-shrink-0 flex items-center justify-center text-2xl font-black border-4 border-black
                          ${showAnswer && option === currentQuestion.answer ? 'bg-gold text-black' : 'bg-black text-white'}
                        `}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none italic">{option}</span>
                      </motion.div>
                    ))}
                  </div>

                  {!showAnswer ? (
                    <button 
                      onClick={() => { setShowAnswer(true); setIsTimerRunning(false); }}
                      className="group relative flex items-center justify-center gap-6 bg-black text-white p-8 md:p-12 text-4xl font-black hover:bg-gold hover:text-black transition-all uppercase italic tracking-[0.1em] w-full max-w-5xl shadow-[12px_12px_0px_0px_rgba(239,68,68,1)]"
                    >
                      ANSWER <CheckCircle2 className="w-12 h-12 stroke-[4]" />
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-600 text-white p-12 md:p-16 border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(212,175,55,1)] w-full max-w-5xl relative"
                    >
                       <div className="absolute -top-6 -left-6 bg-gold text-black px-4 py-1 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Correct!</div>
                       <p className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">{currentQuestion.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Controls bar */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <button
                onClick={handleSkipQuestion}
                className="border-[6px] border-black p-8 font-black text-2xl hover:bg-gray-100 flex items-center justify-center gap-4 uppercase transition-all italic tracking-widest bg-white"
             >
                <SkipForward className="w-8 h-8" /> Skip
             </button>
             <button
                onClick={handleAwardPointsAndNext}
                disabled={!showAnswer}
                className={`
                   p-8 font-black text-2xl flex items-center justify-center gap-4 uppercase transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] italic tracking-widest
                   ${showAnswer ? 'bg-black text-gold hover:bg-red-600 hover:text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed border-[6px] border-gray-300 shadow-none'}
                `}
             >
                Next Challenge <ChevronRight className="w-8 h-8" />
             </button>
          </section>
        </div>

        {/* Right Column: High-Stakes Scoreboard */}
        <div className="md:col-span-4 flex flex-col gap-8">
           <div className="bg-black text-white p-10 border-[8px] border-black flex-1 flex flex-col shadow-[20px_20px_0px_0px_rgba(239,68,68,1)] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <CircleDot className="w-6 h-6 text-red-600 animate-pulse" />
              </div>
              <h3 className="text-3xl font-black mb-10 border-b-4 border-gold pb-4 flex items-center gap-4 italic tracking-tighter">
                 <Users className="w-10 h-10 text-red-600" />
                 LIVE SCORE
              </h3>

              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {teams.map(team => (
                   <button
                     key={team.id}
                     onClick={() => toggleWinner(team.id)}
                     className={`
                        w-full p-6 border-[4px] relative flex justify-between items-center transition-all group overflow-hidden
                        ${winners.has(team.id) ? 'bg-red-600 border-gold ring-4 ring-black scale-[1.04] z-10' : 'bg-white/5 border-white/10 hover:border-gold/50'}
                     `}
                   >
                     <div className="flex items-center gap-5">
                        <div 
                          className="w-12 h-12 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] border-4 border-black group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: team.color }}
                        />
                        <div className="text-left leading-none uppercase">
                           <span className="text-[10px] font-black text-gold block mb-1 opacity-60 tracking-[0.2em]">{team.id} UNIT</span>
                           <span className="text-xl font-black italic tracking-tighter group-hover:text-gold transition-colors">{team.name}</span>
                        </div>
                     </div>
                     <div className="text-right relative z-10">
                        <span className="text-4xl font-black italic leading-none">{team.score}</span>
                        {winners.has(team.id) && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} className="absolute -top-8 -right-4 text-gold">
                            <Award className="w-10 h-10 fill-gold text-black stroke-[2]" />
                          </motion.div>
                        )}
                     </div>
                     {winners.has(team.id) && (
                       <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-white/10 skew-x-12"
                       />
                     )}
                   </button>
                 ))}
              </div>

              {showAnswer && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 p-6 bg-red-950 border-4 border-gold text-center relative"
                >
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black px-4 py-0.5 border-2 border-gold text-[10px] font-black uppercase text-gold">Action Required</div>
                   <p className="text-sm font-black uppercase tracking-[0.2em] text-gold mb-3 italic">TAP CORRECT TEAMS ABOVE</p>
                   <p className="text-[10px] text-white/40 uppercase font-bold">Assign +{selectedLevel === 1 ? 10 : selectedLevel === 2 ? 20 : 30} Points</p>
                </motion.div>
              )}
           </div>

           <div className="bg-white border-[6px] border-black p-8 flex flex-col items-center justify-center text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-3 text-red-600 block italic">System Integrity</span>
              <div className="flex items-center gap-4">
                 <div className="w-4 h-4 bg-black flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-600 animate-ping" />
                 </div>
                 <span className="font-black text-2xl uppercase tracking-tighter italic">Broadcasting Live</span>
              </div>
           </div>
        </div>
      </main>

      {/* Industrial Footer */}
      <footer className="p-12 bg-black text-white/30 text-[11px] font-black uppercase tracking-[0.6em] flex flex-wrap justify-between items-center gap-8 border-t-[10px] border-red-600 mt-auto">
        <div className="flex items-center gap-4">
           <div className="w-3 h-3 bg-gold" />
           SESSION_LOG_{selectedLevel}_0X{currentQuestionIndex + 10}
        </div>
        <div className="flex items-center gap-16">
           <span className="hover:text-white transition-colors cursor-default">Empower Kingdom Alliance</span>
           <span className="text-red-600 italic">Established MMXXVI</span>
           <span className="flex items-center gap-2 text-white">
              <span className="opacity-30">TRIAL</span> {currentQuestionIndex + 1} OF {levelQuestions.length}
           </span>
        </div>
        <div className="flex items-center gap-3">
           {[...Array(6)].map((_, i) => (
             <div key={i} className={`w-3 h-3 ${i % 2 === 0 ? 'bg-red-600' : 'bg-gold'}`} />
           ))}
        </div>
      </footer>

      {/* Global CSS for custom scrollbar hidden in Tailwind but useful for board feel */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,215,0,0.2); }
      `}</style>
    </div>
  );
}
