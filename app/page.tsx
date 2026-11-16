"use client";

import { useState, useCallback, useEffect } from "react";

const COLORS = ["#1a1a1a", "#ff5500", "#00ff41", "#0055ff", "#ffea00", "#ff00cc", "#00ffff", "#ffffff"];
const GRID_SIZE = 16;
const MAX_HISTORY = 20;

const createEmptyGrid = () => 
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill("#ffffff"));

export default function PixelCanvas() {
  const [grid, setGrid] = useState<string[][]>(createEmptyGrid());
  const [history, setHistory] = useState<string[][][]>([]);
  const [currentColor, setCurrentColor] = useState<string>("#1a1a1a");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const saveToHistory = useCallback((currentGrid: string[][]) => {
    setHistory((prev) => {
      const newHistory = [...prev, currentGrid];
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return newHistory;
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const previousGrid = newHistory.pop();
      if (previousGrid) setGrid(previousGrid);
      return newHistory;
    });
  }, []);

  const paintPixel = useCallback((rowIndex: number, colIndex: number, colorToPaint: string) => {
    setGrid((prevGrid) => {
      if (prevGrid[rowIndex][colIndex] === colorToPaint) return prevGrid;
      saveToHistory(prevGrid);
      const newGrid = prevGrid.map((row, rI) => 
        rI === rowIndex ? row.map((col, cI) => cI === colIndex ? colorToPaint : col) : row
      );
      return newGrid;
    });
  }, [saveToHistory]);

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    paintPixel(rowIndex, colIndex, currentColor);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isDrawing) paintPixel(rowIndex, colIndex, currentColor);
  };

  const clearCanvas = () => {
    saveToHistory(grid);
    setGrid(createEmptyGrid());
  };

  // Hardware Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        undo();
      }
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 8) {
        setCurrentColor(COLORS[keyNum - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo]);

  return (
    <div 
      className="min-h-screen bg-[#f4f4f4] font-mono text-[#1a1a1a] flex flex-col items-center py-12 select-none"
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
    >
      {/* Hardware Layout Header */}
      <div className="w-full max-w-[512px] flex justify-between items-end border-b-2 border-[#1a1a1a] pb-2 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tighter uppercase">pixel_canvas //</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Shortcuts: [1-8] Colors | [CTRL+Z] Undo</p>
        </div>
        <span className="text-xs font-bold tracking-widest text-gray-500">v1.1.0</span>
      </div>
      
      {/* Control Deck */}
      <div className="flex w-full max-w-[512px] justify-between mb-8 items-center bg-[#e5e5e5] border-2 border-[#1a1a1a] p-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <div className="flex gap-2 relative">
          {COLORS.map((color, idx) => (
            <div key={color} className="flex flex-col items-center gap-1">
              <button
                onClick={() => setCurrentColor(color)}
                className={`w-8 h-8 rounded-full border-2 border-[#1a1a1a] transition-all ${
                  currentColor === color 
                    ? 'scale-110 ring-2 ring-offset-2 ring-offset-[#e5e5e5] ring-[#1a1a1a]' 
                    : 'opacity-90 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
              <span className="text-[8px] font-bold text-gray-400">{idx + 1}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={undo}
            disabled={history.length === 0}
            className="px-3 py-2 bg-transparent text-[#1a1a1a] border-2 border-[#1a1a1a] text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1a1a1a]"
          >
            Undo
          </button>
          <button 
            onClick={clearCanvas}
            className="px-3 py-2 bg-[#ff5500] text-white border-2 border-[#1a1a1a] text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#ff5500] transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Screen / Matrix */}
      <div 
        className="bg-white border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] cursor-crosshair"
        style={{ touchAction: 'none' }}
        onDragStart={(e) => e.preventDefault()}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((color, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                className="w-8 h-8 border-r border-b border-gray-100 last:border-r-0"
                style={{ backgroundColor: color }}
                draggable={false}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}