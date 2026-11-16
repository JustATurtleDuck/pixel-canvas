"use client";

import { useState, useCallback } from "react";

// Adjusted palette to feature TE's signature stark, highly saturated accent colors
const COLORS = ["#1a1a1a", "#ff5500", "#00ff41", "#0055ff", "#ffea00", "#ff00cc", "#00ffff", "#ffffff"];
const GRID_SIZE = 16;

const createEmptyGrid = () => 
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill("#ffffff"));

export default function PixelCanvas() {
  const [grid, setGrid] = useState<string[][]>(createEmptyGrid());
  const [currentColor, setCurrentColor] = useState<string>("#1a1a1a");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const paintPixel = useCallback((rowIndex: number, colIndex: number, colorToPaint: string) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[rowIndex] = [...newGrid[rowIndex]];
      newGrid[rowIndex][colIndex] = colorToPaint;
      return newGrid;
    });
  }, []);

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    paintPixel(rowIndex, colIndex, currentColor);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isDrawing) {
      paintPixel(rowIndex, colIndex, currentColor);
    }
  };

  const clearCanvas = () => {
    setGrid(createEmptyGrid());
  };

  return (
    <div 
      className="min-h-screen bg-[#f4f4f4] font-mono text-[#1a1a1a] flex flex-col items-center py-12 select-none"
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
    >
      {/* Hardware Layout Header */}
      <div className="w-full max-w-[512px] flex justify-between items-end border-b-2 border-[#1a1a1a] pb-2 mb-6">
        <h1 className="text-xl font-bold tracking-tighter uppercase">pixel_canvas //</h1>
        <span className="text-xs font-bold tracking-widest text-gray-500">v1.0.1</span>
      </div>
      
      {/* Control Deck */}
      <div className="flex w-full max-w-[512px] justify-between mb-8 items-center bg-[#e5e5e5] border-2 border-[#1a1a1a] p-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-8 h-8 rounded-full border-2 border-[#1a1a1a] transition-all ${
                currentColor === color 
                  ? 'scale-110 ring-2 ring-offset-2 ring-offset-[#e5e5e5] ring-[#1a1a1a]' 
                  : 'opacity-90 hover:opacity-100'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
        <button 
          onClick={clearCanvas}
          className="px-4 py-2 bg-[#ff5500] text-white border-2 border-[#1a1a1a] text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#ff5500] transition-colors"
        >
          Reset
        </button>
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
                // Faint graph-paper lines for the grid interior, hard edge for the exterior
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