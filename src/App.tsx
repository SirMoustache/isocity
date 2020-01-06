import React, { useRef, useState, useEffect, useCallback } from 'react';
import './App.css';
import texturesImg from './textures/01_130x66_130x230.png';

const tileWidth = 128;
const tileHeight = 64;

export const useRefCallback = <T extends {}>() => {
  const ref = useRef<T | null>(null);
  const setRef = useCallback((node: T) => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
    }

    // Save a reference to the node
    ref.current = node;
  }, []);

  return [ref, setRef] as const;
};

const createMap = (rows: number, columns: number) =>
  Array.from({ length: rows }, row =>
    Array.from({ length: columns }, column => [0, 0]),
  );

const getPosition = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
  const ntiles = 7;

  const _y = (e.nativeEvent.offsetY - tileHeight * 2) / tileHeight;
  const _x = e.nativeEvent.offsetX / tileWidth - ntiles / 2;

  const x = Math.floor(_y - _x);
  const y = Math.floor(_x + _y);

  return { x, y };
};

const drawImageTile = (
  context: CanvasRenderingContext2D,
  texture: HTMLImageElement,
  x: number,
  y: number,
  i: number,
  j: number,
) => {
  context.save();
  context.translate(((y - x) * tileWidth) / 2, ((x + y) * tileHeight) / 2);
  j *= 130;
  i *= 230;
  context.drawImage(texture, j, i, 130, 230, -65, -130, 130, 230);
  context.restore();
};

const drawTile = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
) => {
  //context.translate(910 / 2, tileHeight * 2);

  context.save();
  context.translate(((y - x) * tileWidth) / 2, ((x + y) * tileHeight) / 2);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(tileWidth / 2, tileHeight / 2);
  context.lineTo(0, tileHeight);
  context.lineTo(-tileWidth / 2, tileHeight / 2);
  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.restore();
};

export type AppProps = {
  w?: number;
  h?: number;
  canvasHeight?: number;
  ntiles?: number;
  texWidth?: number;
  texHeight?: number;
  rows?: number;
  columns?: number;
};

const App = ({
  h = 462,
  w = 910,
  canvasHeight = 666,
  ntiles = 7,
  rows = 7,
  columns = 7,
  texWidth = 12,
  texHeight = 6,
}: AppProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fgRef = useRef<HTMLCanvasElement>(null);
  const [ref, setRef] = useRefCallback<HTMLCanvasElement>();
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const worldMap = createMap(rows, columns);
  const toolMap = createMap(texHeight, texWidth);

  const handeToolClick = (toolId: string) => {
    setActiveToolId(toolId);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    //if (isPlacing) click(e);
    const pos = getPosition(e);
    const cf = ref.current?.getContext('2d');
    cf?.clearRect(-w, -h, w * 2, h * 2);

    if (!cf) {
      return;
    }

    if (pos.x >= 0 && pos.x < ntiles && pos.y >= 0 && pos.y < ntiles) {
      console.log('drawTile');
      drawTile(cf, pos.x, pos.y, 'rgba(0,0,0,0.2)');
    }
  };

  // ex drawMap
  // useEffect(() => {
  //   if (!canvasRef.current || isLoading) {
  //     return;
  //   }

  //   const bg = canvasRef.current.getContext('2d');

  //   if (!bg) {
  //     return;
  //   }

  //   bg.clearRect(-w, -h, w * 2, h * 2);

  //   for (let i = 0; i < ntiles; i++) {
  //     for (let j = 0; j < ntiles; j++) {
  //       drawImageTile(bg, i, j, map[i][j][0], map[i][j][1]);
  //     }
  //   }
  // }, [isLoading]);

  useEffect(() => {
    const texture = new Image();
    texture.src = texturesImg; //'textures/01_130x66_130x230.png';
    texture.onload = () => {
      setIsLoading(false);
      if (!canvasRef.current) {
        return;
      }

      const bg = canvasRef.current.getContext('2d');

      if (!bg) {
        return;
      }

      bg.translate(w / 2, tileHeight * 2);
      bg.clearRect(-w, -h, w * 2, h * 2);

      worldMap.forEach((row, rowIndex) =>
        row.forEach((column, columnIndex) => {
          drawImageTile(bg, texture, rowIndex, columnIndex, 0, 0);
        }),
      );

      // for (let i = 0; i < ntiles; i++) {
      //   for (let j = 0; j < ntiles; j++) {
      //     drawImageTile(
      //       bg,
      //       texture,
      //       i,
      //       j,
      //       0,
      //       0,
      //       //worldMap[i][j][0],
      //       //worldMap[i][j][1],
      //     );
      //   }
      // }
    };
  }, []);

  useEffect(() => {
    if (!fgRef.current) {
      return;
    }
    console.log('!fgRef.current');

    const cf = fgRef.current.getContext('2d');

    if (!cf) {
      return;
    }
    console.log('cf.translate');
    //cf.translate(w / 2, tileHeight * 2);
  }, [w]);

  useEffect(() => {
    const test = ref.current;
    const cf = ref.current?.getContext('2d');
    console.log(' ref.current');
    cf?.translate(w / 2, tileHeight * 2);
  }, [ref.current]);

  if (isLoading) {
    return <h2>'Loading...'</h2>;
  }

  return (
    <>
      <div id="tools">
        {toolMap.map((row, rowIndex) =>
          row.map((column, columnIndex) => (
            <div
              id={`tool_${rowIndex}-${columnIndex}`}
              className={
                `tool_${rowIndex}-${columnIndex}` === activeToolId
                  ? 'selected'
                  : ''
              }
              onClick={() => handeToolClick(`tool_${rowIndex}-${columnIndex}`)}
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
          width={w}
          height={canvasHeight}
          //style={{ width: w, height: h }}
        ></canvas>
        <canvas
          id="fg"
          ref={setRef}
          width={w}
          height={canvasHeight}
          onMouseMove={handleMouseMove}
          // style={{ width: w, height: h }}
        ></canvas>
      </div>
    </>
  );
};

export default App;
