"use client";

import { useState } from "react";

const COLORS = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF"];
const GRID_SIZE = 16;

export default function PixelCanvas() {
  const [grid, setGrid] = useState<string[][]>(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill("#FFFFFF")));
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const paintPixel = (rowIndex: number, colIndex: number) => {
    const newGrid = grid.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((color, cIdx) => (cIdx === colIndex ? currentColor : color))
        : row
    );
    setGrid(newGrid);
  };

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    paintPixel(rowIndex, colIndex);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isDrawing) paintPixel(rowIndex, colIndex);
  };

  const clearCanvas = () => {
    setGrid(Array(GRID_SIZE).fill(Array(GRID_SIZE).fill("#FFFFFF")));
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center py-10 select-none"
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Retro Pixel Canvas</h1>

      {/* Palette */}
      <div className="flex gap-2 mb-6 bg-white p-4 rounded shadow">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setCurrentColor(color)}
            className={`w-10 h-10 rounded border-2 ${currentColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'}`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
        <button
          onClick={clearCanvas}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div className="bg-white border-4 border-gray-800 shadow-xl cursor-crosshair">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((color, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                className="w-8 h-8 border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
