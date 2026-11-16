"use client";

import { useState, useCallback, useEffect } from "react";

const COLORS = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF"];
const GRID_SIZE = 16;

// Helper to safely create a fresh grid without tangling array references
const createEmptyGrid = () =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill("#FFFFFF"));

export default function PixelCanvas() {
  const [grid, setGrid] = useState<string[][]>(createEmptyGrid());
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Using a callback with prevGrid ensures we never miss a pixel if the user drags fast
  const paintPixel = useCallback((rowIndex: number, colIndex: number, colorToPaint: string) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[rowIndex] = [...newGrid[rowIndex]];
      newGrid[rowIndex][colIndex] = colorToPaint;
      return newGrid;
    });
  }, []);

  const handleMouseDown = (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    paintPixel(rowIndex, colIndex, currentColor);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    if (isDrawing || e.buttons === 1) {
      paintPixel(rowIndex, colIndex, currentColor);
    }
  };

  const clearCanvas = () => {
    setGrid(createEmptyGrid());
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center py-10 select-none"
      onMouseUp={() => setIsDrawing(false)}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Retro Pixel Canvas</h1>

      {/* Palette */}
      <div className="flex gap-2 mb-6 bg-white p-4 rounded shadow">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setCurrentColor(color)}
            // Selected color gets a bold dark grey border and ring to clearly indicate selection
            className={`w-10 h-10 rounded border-4 transition-all cursor-pointer ${
              currentColor === color
                ? "border-gray-800 scale-110 shadow-md ring-2 ring-offset-2 ring-gray-800"
                : "border-gray-300 hover:border-gray-400"
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
        <button
          type="button"
          onClick={clearCanvas}
          className="ml-4 px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div
        className="bg-white border-4 border-gray-800 shadow-xl cursor-crosshair select-none"
        style={{ touchAction: "none" }} // Stops trackpads from scrolling while drawing
        onDragStart={(e) => e.preventDefault()} // Kills the HTML5 ghost-drag bug
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((color, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                onMouseEnter={(e) => handleMouseEnter(rowIndex, colIndex, e)}
                onClick={() => paintPixel(rowIndex, colIndex, currentColor)}
                className="w-8 h-8 border border-gray-200"
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
