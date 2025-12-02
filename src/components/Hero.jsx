// src/components/Hero.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

const Hero = () => {
  const heroRef = useRef(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // evaluate winner
  const evalBoard = (b) => {
    for (const combo of WIN_COMBOS) {
      const [a, c, d] = combo;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { winner: b[a], line: combo };
      }
    }
    if (b.every((v) => v !== null)) return { winner: "draw", line: null };
    return { winner: null, line: null };
  };

  // smarter bot: win → block → center → random
  const botMove = (b) => {
    const me = "O";
    const you = "X";
    const empties = b
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);
    if (!empties.length) return b;

    // try to win
    for (const i of empties) {
      const copy = [...b];
      copy[i] = me;
      if (evalBoard(copy).winner === me) return copy;
    }
    // block player
    for (const i of empties) {
      const copy = [...b];
      copy[i] = you;
      if (evalBoard(copy).winner === you) {
        const real = [...b];
        real[i] = me;
        return real;
      }
    }
    // center
    if (b[4] === null) {
      const copy = [...b];
      copy[4] = me;
      return copy;
    }
    // random
    const choice = empties[Math.floor(Math.random() * empties.length)];
    const copy = [...b];
    copy[choice] = me;
    return copy;
  };

  // player click
  const handleCellClick = (idx) => {
    if (!isPlayerTurn || winner || board[idx] === "X" || board[idx] === "O")
      return;
    const copy = [...board];
    copy[idx] = "X";
    setBoard(copy);
    const res = evalBoard(copy);
    if (res.winner) {
      setWinner(res.winner);
      setWinLine(res.line);
    } else {
      setIsPlayerTurn(false);
    }
  };

  // bot turn
  useEffect(() => {
    if (!showGrid || winner || isPlayerTurn) return;
    const t = setTimeout(() => {
      const after = botMove(board);
      setBoard(after);
      const res = evalBoard(after);
      if (res.winner) {
        setWinner(res.winner);
        setWinLine(res.line);
      } else {
        setIsPlayerTurn(true);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [isPlayerTurn, winner, board, showGrid]);

  // click hero → place big grid, random who starts
  const handleHeroClick = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    const randomPlayerStarts = Math.random() < 0.5; // true = player, false = bot
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinLine(null);
    setShowGrid(true);
    setIsPlayerTurn(randomPlayerStarts);
  };

  return (
    <motion.section
      id="home"
      ref={heroRef}
      className="relative flex min-h-screen items-end rounded-[0.9rem] border-4 border-white bg-black p-0 overflow-hidden"
      onClick={handleHeroClick}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Name stays as-is */}
      <h1
        className="w-full pb-8 font-inter text-white md:pb-4 pointer-events-none"
        style={{
          fontSize: "clamp(3rem, 12vw, 15rem)",
          lineHeight: "0.9",
          letterSpacing: "-0.05em",
        }}
      >
        Muhammed Umar
      </h1>

      {/* Neon grid only */}
      <AnimatePresence>
        {showGrid && (
          <motion.div
            className="absolute z-20"
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80 w-80 rounded-3xl bg-black/90 flex items-center justify-center">
              {/* neon grid */}
              <div className="pointer-events-none absolute inset-8">
                <div className="absolute left-1/3 top-0 h-full w-[3px] bg-sky-400 shadow-[0_0_16px_#38bdf8]" />
                <div className="absolute left-2/3 top-0 h-full w-[3px] bg-sky-400 shadow-[0_0_16px_#38bdf8]" />
                <div className="absolute left-0 top-1/3 h-[3px] w-full bg-sky-400 shadow-[0_0_16px_#38bdf8]" />
                <div className="absolute left-0 top-2/3 h-[3px] w-full bg-sky-400 shadow-[0_0_16px_#38bdf8]" />
              </div>

              <div className="absolute inset-8 grid grid-cols-3 grid-rows-3">
                {board.map((cell, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    className="flex items-center justify-center"
                  >
                    <AnimatePresence>
                      {cell && (
                        <motion.span
                          initial={{ scale: 0.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.3, opacity: 0 }}
                          className={`text-6xl font-bold ${
                            cell === "X"
                              ? "text-red-500 drop-shadow-[0_0_26px_#ef4444]"
                              : "text-sky-400 drop-shadow-[0_0_26px_#38bdf8]"
                          }`}
                        >
                          {cell}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                ))}
              </div>

              {/* winning line */}
              {winLine && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.35 }}
                  className="pointer-events-none absolute bg-sky-200 shadow-[0_0_26px_#38bdf8]"
                  style={lineStyle(winLine)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

// positions tuned for 80x80 inner grid (inset-8) inside 320x320 card
function lineStyle(combo) {
  const k = combo.join(",");
  // horizontals
  if (k === "0,1,2") return { left: "12%", right: "12%", top: "23%", height: 3 };
  if (k === "3,4,5") return { left: "12%", right: "12%", top: "50%", height: 3 };
  if (k === "6,7,8") return { left: "12%", right: "12%", top: "77%", height: 3 };
  // verticals
  if (k === "0,3,6")
    return { top: "12%", bottom: "12%", left: "23%", width: 3 };
  if (k === "1,4,7")
    return { top: "12%", bottom: "12%", left: "50%", width: 3 };
  if (k === "2,5,8")
    return { top: "12%", bottom: "12%", left: "77%", width: 3 };
  // diagonals
  if (k === "0,4,8")
    return {
      left: "12%",
      right: "12%",
      top: "50%",
      height: 3,
      transform: "rotate(45deg)",
      transformOrigin: "center center",
    };
  if (k === "2,4,6")
    return {
      left: "12%",
      right: "12%",
      top: "50%",
      height: 3,
      transform: "rotate(-45deg)",
      transformOrigin: "center center",
    };
  return {};
}

export default Hero;
