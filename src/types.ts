interface Position {
  x: number;
  y: number;
}

interface CanvasImage {
  id: string;
  img: HTMLImageElement;
  pos: Position;
}

export type { Position, CanvasImage };
