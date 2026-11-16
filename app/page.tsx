// Tells Next.js to render on client side, allowing for use of React hooks.
"use client";

import { useState, useCallback, useEffect } from "react";

// The color palette:
const COLORS = ["#1a1a1a", "#ff5500", "#00ff41", "#0055ff", "#ffea00", "#ff00cc", "#00ffff", "#ffffff"];
const GRID_SIZE = 16;
const MAX_HISTORY = 20; // Cap the undo history because memory leaks are bad

// Helper function to generate 16x16 grid.
// Using Array.from helps each row be a unique array reference in memory.
const createEmptyGrid = () => 
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill("#ffffff"));

export default function PixelCanvas() {
  // Main state. Holds 2D array of colors
  const [grid, setGrid] = useState<string[][]>(createEmptyGrid());
  
  // State stack. Keeps track of previous grid states for Undo feature
  const [history, setHistory] = useState<string[][][]>([]);
  
  // State for currently selected drawing color
  const [currentColor, setCurrentColor] = useState<string>("#1a1a1a");
  
  // Boolean flag tracking if user's mouse button is currently held down
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Saves snapshot of current grid to history stack before making a change.
  // useCallback to prevent function from being recreated on every render.
  const saveToHistory = useCallback((currentGrid: string[][]) => {
    setHistory((prev) => {
      const newHistory = [...prev, currentGrid];
      // Shift off (remove) the oldest state if exceed maximum history limit
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return newHistory;
    });
  }, []);

  // Pops most recent state off history stack, sets it as current grid
  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const previousGrid = newHistory.pop();
      if (previousGrid) setGrid(previousGrid);
      return newHistory;
    });
  }, []);

  // Core drawing logic: updates specific pixel immutably (without mutating the React state directly).
  const paintPixel = useCallback((rowIndex: number, colIndex: number, colorToPaint: string) => {
    setGrid((prevGrid) => {
      // If pixel is already selected color, do nothing. Helps some save performance
      if (prevGrid[rowIndex][colIndex] === colorToPaint) return prevGrid;
      
      // Save state before changing it
      saveToHistory(prevGrid);
      
      // Map over grid to create fresh copy. Update only target cell
      const newGrid = prevGrid.map((row, rI) => 
        rI === rowIndex ? row.map((col, cI) => cI === colIndex ? colorToPaint : col) : row
      );
      return newGrid;
    });
  }, [saveToHistory]);

  // Triggers when user first clicks on pixel
  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    paintPixel(rowIndex, colIndex, currentColor);
  };

  // Triggers when user hovers over a pixel. If holding mouse down, it paints.
  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isDrawing) paintPixel(rowIndex, colIndex, currentColor);
  };

  // Resets grid to initial state, but saves current canvas to history so they can undo clear.
  const clearCanvas = () => {
    saveToHistory(grid);
    setGrid(createEmptyGrid());
  };

  // Hardware Keyboard Shortcuts Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Checks for CMD+Z/CTRL+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        undo();
      }
      
      // Checks if user pressed a number key 1-8 to quickly swap colors
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 8) {
        setCurrentColor(COLORS[keyNum - 1]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function automatically removes event listener when component unmounts
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo]);

  return (
    <div 
      // Make layout more fun to look at
      className="min-h-screen bg-[#f4f4f4] font-mono text-[#1a1a1a] flex flex-col items-center py-12 select-none"
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
    >
      {/* Hardware Layout Header */}
      <div className="w-full max-w-[512px] flex justify-between items-end border-b-2 border-[#1a1a1a] pb-2 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tighter uppercase">pixel_canvas //</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Shortcuts: [1-8] Colors | [CMD+Z] Undo</p>
        </div>
        <span className="text-xs font-bold tracking-widest text-gray-500">v1.1.1</span>
      </div>
      
      {/* Palette and Buttons */}
      <div className="flex w-full max-w-[512px] justify-between mb-8 items-center bg-[#e5e5e5] border-2 border-[#1a1a1a] p-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        
        {/* Color Palette Array */}
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
              {/* Number labels beneath each color */}
              <span className="text-[8px] font-bold text-gray-400">{idx + 1}</span>
            </div>
          ))}
        </div>
        
        {/* Action Buttons */}
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

      {/* Screen / Matrix Container */}
      <div 
        className="bg-white border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] cursor-crosshair"
        style={{ touchAction: 'none' }} // For mobile/trackpad: prevents browser window from scrolling while drawing
        onDragStart={(e) => e.preventDefault()} // For desktop: prevents HTML5 browser dragging bug 
      >
        {/* Maps over 2D grid array to draw rows and cells */}
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((color, colIndex) => (
              <div
                // Make each pixel interactive and colorful
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                // Faint inner grid lines
                className="w-8 h-8 border-r border-b border-gray-100 last:border-r-0"
                style={{ backgroundColor: color }}
                draggable={false} // Prevents HTML5 browser dragging bug
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}