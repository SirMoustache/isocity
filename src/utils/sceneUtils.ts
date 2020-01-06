export const createMap = (rows: number, columns: number) =>
  Array.from({ length: rows }, row =>
    Array.from({ length: columns }, column => [0, 0]),
  );

export const drawImageTile = (
  c: CanvasRenderingContext2D,
  texture: HTMLImageElement,
  x: number,
  y: number,
  i: number,
  j: number,
  tileWidth: number,
  tileHeight: number,
) => {
  c.save();
  c.translate(((y - x) * tileWidth) / 2, ((x + y) * tileHeight) / 2);
  j *= 130;
  i *= 230;
  c.drawImage(texture, j, i, 130, 230, -65, -130, 130, 230);
  c.restore();
};
