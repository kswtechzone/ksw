'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Clock,
  HeadphonesIcon,
  Lightbulb,
  TrendingDown,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Skilled professionals with years of experience in cutting-edge technologies.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality First',
    description: 'Rigorous quality assurance processes ensuring enterprise-grade deliverables.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description: 'Agile methodology ensures projects are delivered on schedule and within budget.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and maintenance for all our solutions.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Driven',
    description: 'Constantly exploring new technologies to deliver innovative solutions.',
  },
  {
    icon: TrendingDown,
    title: 'Cost-Effective',
    description: 'Competitive pricing without compromising on quality or performance.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function WhyChooseUs() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 bg-muted/30">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">KSW TechZone?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine technical excellence with business acumen to deliver 
            solutions that make a real difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {features.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="flex gap-4 mb-8 last:mb-0"
              >
                <div className="h-12 w-12 rounded-xl bg-ksw-500/10 flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6 text-ksw-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <TicTacToe />
        </div>
      </div>
    </section>
  );
}

const WIN_PATTERNS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWinner(board: (string|null)[]): string | null {
  for (const [a,b,c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(Boolean) ? 'draw' : null;
}

const memo = new Map<string, number>();

function minimax(board: (string|null)[], depth: number, isMax: boolean, alpha: number, beta: number): number {
  const result = checkWinner(board);
  if (result === 'O') return 10 - depth;
  if (result === 'X') return depth - 10;
  if (result === 'draw') return 0;

  const key = board.join('|') + (isMax ? '1' : '0');
  const cached = memo.get(key);
  if (cached !== undefined) return cached;

  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = [...board];
    next[i] = isMax ? 'O' : 'X';
    const score = minimax(next, depth + 1, !isMax, alpha, beta);
    best = isMax ? Math.max(best, score) : Math.min(best, score);
    if (isMax) { alpha = Math.max(alpha, score); } else { beta = Math.min(beta, score); }
    if (beta <= alpha) break;
  }
  memo.set(key, best);
  return best;
}

function getBestMove(board: (string|null)[]): number {
  memo.clear();
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = [...board];
    next[i] = 'O';
    const score = minimax(next, 0, false, -Infinity, Infinity);
    if (score > bestScore) { bestScore = score; move = i; }
  }
  return move;
}

function TicTacToe() {
  const [board, setBoard] = React.useState<(string|null)[]>(Array(9).fill(null));
  const [isX, setIsX] = React.useState(true);
  const [thinking, setThinking] = React.useState(false);
  const boardRef = React.useRef(board);
  boardRef.current = board;
  const winner = checkWinner(board);

  React.useEffect(() => {
    if (!isX && !winner) {
      setThinking(true);
      const timer = setTimeout(() => {
        const current = boardRef.current;
        const move = getBestMove(current);
        if (move >= 0) {
          setBoard(prev => { const next = [...prev]; next[move] = 'O'; return next; });
          setIsX(true);
        }
        setThinking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isX, winner]);

  const handleClick = React.useCallback((i: number) => {
    if (boardRef.current[i] || !isX || winner || thinking) return;
    const next = [...boardRef.current];
    next[i] = 'X';
    setBoard(next);
    setIsX(false);
  }, [isX, winner, thinking]);

  const reset = React.useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setThinking(false);
  }, []);

  const status = winner === 'draw'
    ? "It's a draw!"
    : winner
    ? `${winner === 'O' ? 'Computer' : 'You'} win!`
    : thinking
    ? 'Computer thinking...'
    : 'Your turn — tap a cell';

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative rounded-2xl overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-ksw-500/20 via-ksw-700/20 to-ksw-900/20 rounded-2xl border border-ksw-500/10 flex items-center justify-center p-8">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-ksw-500/40 mx-auto mb-3" />
            <div className="grid grid-cols-3 gap-3 max-w-[220px] mx-auto">
              {board.map((cell, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleClick(i)}
                  disabled={!isX || !!winner || thinking}
                  className="aspect-square rounded-lg bg-ksw-500/10 border border-ksw-500/20 flex items-center justify-center cursor-pointer hover:bg-ksw-500/20 transition-colors disabled:cursor-not-allowed disabled:hover:bg-ksw-500/10"
                  style={{ minWidth: 60, minHeight: 60 }}
                >
                  {cell === 'X' ? (
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-full bg-ksw-500/60 rotate-45 rounded-full" />
                        <div className="w-1 h-full bg-ksw-500/60 -rotate-45 absolute rounded-full" />
                      </div>
                    </div>
                  ) : cell === 'O' ? (
                    <div className="w-7 h-7 rounded-full border-[3px] border-ksw-500/60" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-ksw-500/40" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 mt-4">
              <p className="text-sm text-muted-foreground">{status}</p>
              {(winner || thinking) && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1 text-xs text-ksw-500 hover:text-ksw-400 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  {winner ? 'Play again' : 'Reset'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-gradient-to-r from-ksw-500/10 via-transparent to-ksw-700/10 rounded-3xl blur-3xl -z-10" />
    </motion.div>
  );
}
