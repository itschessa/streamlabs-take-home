interface Position {
  x: number;
  y: number;
}

interface CanvasImage {
  id: string;
  img: HTMLImageElement;
  pos: Position;
  zIndex: number;
}

interface ImageHistory {
  id: string;
  pos: Position;
}

interface ImageSource {
  id: string;
  src: string;
}
export type { Position, CanvasImage, ImageSource, ImageHistory };
