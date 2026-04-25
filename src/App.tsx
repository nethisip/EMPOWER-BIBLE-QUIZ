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
  XCircle,
  Award
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
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const levelQuestions = QUESTIONS.filter(q => q.level === selectedLevel);
  const currentQuestion = levelQuestions[currentQuestionIndex];

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

  const startGame = (level: 1 | 2 | 3) => {
    setSelectedLevel(level);
    setCurrentQuestionIndex(0);
    setTeams(INITIAL_TEAMS.map(t => ({ ...t, score: 0 })));
    setStatus('playing');
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setTimeLeft(TIMER_DURATION);
    setIsTimerRunning(true);
    setShowAnswer(false);
    setWinners(new Set());
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
    // Award points to all selected winners
    const points = selectedLevel === 1 ? 10 : selectedLevel === 2 ? 20 : 30;
    setTeams(prev => prev.map(t => {
      if (winners.has(t.id)) {
        return { ...t, score: t.score + points };
      }
      return t;
    }));

    // Proceed to next
    if (currentQuestionIndex < levelQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      setStatus('finished');
      setIsTimerRunning(false);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < levelQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4 selection:bg-red-500 selection:text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full bg-white text-black p-8 md:p-16 text-center border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(239,68,68,1)]"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-red-600">Presenting</h2>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter leading-none flex flex-wrap items-center justify-center gap-x-4">
            <span>EMP</span>
            <span className="text-red-600">
              <Power className="w-16 h-16 md:w-24 md:h-24 stroke-[4]" />
            </span>
            <span>WER</span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tight bg-black text-white px-6 py-2 inline-block">
            BIBLE QUIZ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { lv: 1, label: 'EASY', pts: '10 PTS', desc: 'Basics' },
              { lv: 2, label: 'HARD', pts: '20 PTS', desc: 'Details' },
              { lv: 3, label: 'VERY HARD', pts: '30 PTS', desc: 'Lore' }
            ].map((item) => (
              <button
                key={item.lv}
                onClick={() => startGame(item.lv as 1|2|3)}
                className="group relative border-4 border-black p-8 bg-white hover:bg-red-600 transition-colors text-left"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black tracking-widest text-red-600 group-hover:text-white uppercase transition-colors">{item.pts}</span>
                  <Play className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                </div>
                <span className="text-3xl font-black group-hover:text-white transition-colors uppercase italic">{item.label}</span>
                <p className="mt-2 text-sm font-bold text-gray-500 group-hover:text-white/80 transition-colors uppercase tracking-widest">{item.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>
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
          className="max-w-4xl w-full bg-white border-[12px] border-red-600 p-12 text-center shadow-[24px_24px_0px_0px_rgba(255,255,255,1)]"
        >
          <Trophy className="w-24 h-24 text-red-600 mx-auto mb-6" />
          <h2 className="text-6xl font-black text-black mb-2 uppercase tracking-tighter italic">Victory Reclamed</h2>
          <div className="h-2 bg-black w-32 mx-auto mb-10"></div>
          
          <div className="bg-red-600 text-white p-8 mb-12 transform -rotate-2 border-4 border-black inline-block px-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-5xl font-black uppercase tracking-widest leading-none">{winner.name}</h3>
            <p className="text-2xl font-bold mt-2">{winner.score} TOTAL POINTS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {sortedTeams.slice(1).map((team, idx) => (
              <div key={team.id} className="border-4 border-black p-4 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="font-black text-xl italic text-red-600">#{idx + 2}</span>
                  <span className="font-black uppercase tracking-tight text-lg">{team.name}</span>
                </div>
                <span className="text-2xl font-black">{team.score}</span>
              </div>
            ))}
          </div>

          <button
            onClick={restartGame}
            className="flex items-center justify-center gap-4 bg-black text-white px-12 py-6 text-xl font-black hover:bg-red-600 transition-all w-full uppercase italic tracking-widest shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]"
          >
            <RotateCcw className="w-6 h-6" /> Reset Board
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Header Bar */}
      <header className="p-6 border-b-[6px] border-black bg-white flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button 
            onClick={restartGame}
            className="p-3 bg-black text-white hover:bg-red-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-1">
               EMP<Power className="w-6 h-6 text-red-600 stroke-[4]" />WER 
               <span className="bg-black text-white px-2 py-0.5 ml-1 italic">QUIZ</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Time Remaining</span>
            <div className={`text-4xl font-mono font-black tabular-nums flex items-center gap-3 ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
               {timeLeft.toString().padStart(2, '0')}<span className="text-lg opacity-50 font-sans">s</span>
            </div>
          </div>
          
          <div className="hidden lg:block w-32 bg-gray-100 h-12 border-2 border-black relative overflow-hidden">
            <motion.div 
               className="absolute top-0 left-0 bottom-0 bg-red-600"
               initial={{ width: '100%' }}
               animate={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
               transition={{ ease: 'linear' }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
        {/* Left Column: The Board */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <section className="bg-white border-[6px] border-black p-10 md:p-16 relative overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex-1 min-h-[500px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 bg-red-600 text-white px-8 py-3 font-black uppercase tracking-widest text-sm transform -skew-x-12 translate-x-2">
              {currentQuestion.level === 1 ? 'Easy' : currentQuestion.level === 2 ? 'Hard' : 'Very Hard'} • Q{currentQuestionIndex + 1}
            </div>

            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-16 uppercase break-words">
              {currentQuestion.text}
            </h2>

            {!showAnswer ? (
              <button 
                onClick={() => { setShowAnswer(true); setIsTimerRunning(false); }}
                className="group relative flex items-center justify-center gap-4 bg-black text-white p-6 md:p-10 text-3xl font-black hover:bg-red-600 transition-all uppercase italic tracking-widest w-full"
              >
                Reveal Answer <CheckCircle2 className="w-10 h-10 stroke-[3]" />
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-600 text-white p-10 md:p-14 border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
              >
                 <span className="block text-xs font-black uppercase tracking-[0.3em] mb-4 text-black/60">Correct Answer</span>
                 <p className="text-4xl md:text-6xl font-black uppercase tracking-tight">{currentQuestion.answer}</p>
              </motion.div>
            )}
          </section>

          {/* Controls bar */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button
                onClick={handleSkipQuestion}
                className="border-4 border-black p-6 font-black text-xl hover:bg-gray-100 flex items-center justify-center gap-3 uppercase transition-all"
             >
                <SkipForward className="w-6 h-6" /> Skip Question
             </button>
             <button
                onClick={handleAwardPointsAndNext}
                disabled={!showAnswer}
                className={`
                   p-6 font-black text-xl flex items-center justify-center gap-3 uppercase transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                   ${showAnswer ? 'bg-black text-white hover:bg-red-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed border-4 border-gray-300 shadow-none'}
                `}
             >
                Confirm points & next <ChevronRight className="w-6 h-6" />
             </button>
          </section>
        </div>

        {/* Right Column: Scoreboard & Point Assignment */}
        <div className="md:col-span-4 flex flex-col gap-6">
           <div className="bg-black text-white p-8 border-[6px] border-black flex-1 flex flex-col shadow-[16px_16px_0px_0px_rgba(239,68,68,1)]">
              <h3 className="text-2xl font-black mb-8 border-b-2 border-white/20 pb-4 flex items-center gap-3">
                 <Users className="w-6 h-6 text-red-600" />
                 TEAM STANDINGS
              </h3>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                 {teams.map(team => (
                   <button
                     key={team.id}
                     onClick={() => toggleWinner(team.id)}
                     className={`
                        w-full p-6 border-4 flex justify-between items-center transition-all group
                        ${winners.has(team.id) ? 'bg-red-600 border-white ring-4 ring-red-600 ring-offset-2 ring-offset-black scale-[1.02]' : 'bg-white/10 border-white/20 hover:border-white/40'}
                        ${!showAnswer ? 'cursor-pointer hover:bg-white/20' : 'cursor-pointer'}
                     `}
                   >
                     <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] border-2 border-white"
                          style={{ backgroundColor: team.color }}
                        />
                        <div className="text-left leading-none">
                           <span className="text-[10px] font-black uppercase text-white/50 block mb-1">TEAM {team.id}</span>
                           <span className="text-lg font-black uppercase tracking-tight group-hover:text-red-500 transition-colors">{team.name}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-3xl font-black">{team.score}</span>
                        {winners.has(team.id) && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-3 -right-3 bg-white text-black p-1 rounded-full border-2 border-black">
                            <Award className="w-5 h-5 text-red-600" />
                          </motion.div>
                        )}
                     </div>
                   </button>
                 ))}
              </div>

              {showAnswer && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-white/10 border-2 border-dashed border-red-600 text-center"
                >
                   <p className="text-sm font-bold uppercase tracking-widest text-red-500 mb-2">Select Correct Teams</p>
                   <p className="text-[10px] text-white/60 uppercase">Click on team boxes to mark them correct</p>
                </motion.div>
              )}
           </div>

           <div className="bg-white border-4 border-black p-6 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-gray-500 italic font-mono">Board Status</span>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                 <span className="font-black text-xl uppercase tracking-tighter">Live Broadcast</span>
              </div>
           </div>
        </div>
      </main>

      {/* Extreme Branding Footer */}
      <footer className="p-10 bg-black text-white/40 text-[10px] font-black uppercase tracking-[0.5em] flex flex-wrap justify-between items-center gap-4">
        <div>Board ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
        <div className="flex items-center gap-10">
           <span>Bible Knowledge League</span>
           <span className="text-red-600">Established 2026</span>
           <span className="flex items-center gap-2">
              Quest {currentQuestionIndex + 1} / {levelQuestions.length}
           </span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-4 h-4 bg-red-600" />
           <div className="w-4 h-4 bg-white" />
           <div className="w-4 h-4 bg-gray-800" />
        </div>
      </footer>
    </div>
  );
}
