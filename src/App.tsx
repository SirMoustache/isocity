import React, { useRef, useState } from 'react';
import './App.css';

const createMap = (rows: number, columns: number) =>
  Array.from({ length: rows }, row =>
    Array.from({ length: columns }, column => [0, 0]),
  );

export type AppProps = {
  w?: number;
  h?: number;
  texWidth?: number;
  texHeight?: number;
};

const App = ({ h, w, texWidth = 12, texHeight = 6 }: AppProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fgRef = useRef<HTMLCanvasElement>(null);
  const [activeToolIndex, setActiveToolIndex] = useState<number | null>(null);

  const map = createMap(texHeight, texWidth);

  const handeToolClick = (toolIndex: number) => {
    setActiveToolIndex(toolIndex);
  };
  return (
    <>
      <div id="tools">
        {map.map((row, rowIndex) =>
          row.map((column, columnIndex) => (
            <div
              className={
                (rowIndex + 1) * columnIndex === activeToolIndex
                  ? 'selected'
                  : ''
              }
              onClick={() => handeToolClick((rowIndex + 1) * columnIndex)}
              style={{
                backgroundPosition: `-${columnIndex * 130 + 2}px -${rowIndex *
                  230}px`,
              }}
            ></div>
          )),
        )}
      </div>
      <div id="area">
        <canvas
          id="bg"
          ref={canvasRef}
          style={{ width: w, height: h }}
        ></canvas>
        <canvas id="fg" ref={fgRef}></canvas>
      </div>
    </>
  );
};

export default App;
