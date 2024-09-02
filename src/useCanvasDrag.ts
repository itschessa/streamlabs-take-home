import { useRef, useEffect, useCallback } from "react";
import { CanvasImage, ImageSource, Position } from "./types";
import { ASPECT_RATIO, SCALE_FACTOR } from "./constants";
import {
  isPointInImage,
  clamp,
  getRandomPosition,
  getMousePosition,
} from "./helpers";

function useCanvasDrag(imageSources: ImageSource[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef<string | null>(null);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });
  const canvasImagesRef = useRef<CanvasImage[]>([]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.height = window.innerHeight;
    canvas.width = canvas.height * ASPECT_RATIO;
  }, []);

  const loadImages = useCallback(async () => {
    const newCanvasImages: CanvasImage[] = [];

    for (const { id, src } of imageSources) {
      const img = new Image();
      img.src = src;
      await new Promise((resolve) => (img.onload = resolve));
      const pos = getRandomPosition(img, canvasRef.current!);
      newCanvasImages.push({ id, img, pos });
    }

    canvasImagesRef.current = newCanvasImages;
  }, [imageSources]);

  const drawImages = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    canvasImagesRef.current.forEach(({ id, img, pos }) => {
      if (draggingRef.current === id) {
        context.strokeStyle = "green";
        context.lineWidth = 2;
        context.strokeRect(
          pos.x - 1,
          pos.y - 1,
          img.width * SCALE_FACTOR + 2,
          img.height * SCALE_FACTOR + 2
        );
      }

      context.drawImage(
        img,
        pos.x,
        pos.y,
        img.width * SCALE_FACTOR,
        img.height * SCALE_FACTOR
      );
    });
  }, []);

  const handleDragStart = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { x, y } = getMousePosition(e, canvas);

      for (const { id, img, pos } of canvasImagesRef.current) {
        if (isPointInImage(pos, img, x, y)) {
          draggingRef.current = id;
          offsetRef.current = { x: x - pos.x, y: y - pos.y };
          break;
        }
      }

      drawImages();
    },
    [drawImages]
  );

  const handleDragging = useCallback(
    (e: MouseEvent) => {
      if (!draggingRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const { x, y } = getMousePosition(e, canvas);
      const draggedImage = canvasImagesRef.current.find(
        (img) => img.id === draggingRef.current
      );

      if (draggedImage) {
        const newX = x - offsetRef.current.x;
        const newY = y - offsetRef.current.y;
        draggedImage.pos = {
          x: clamp(
            newX,
            0,
            canvas.width - draggedImage.img.width * SCALE_FACTOR
          ),
          y: clamp(
            newY,
            0,
            canvas.height - draggedImage.img.height * SCALE_FACTOR
          ),
        };
      }

      drawImages();
    },
    [drawImages]
  );

  const handleDragEnd = useCallback(() => {
    draggingRef.current = null;
    drawImages();
  }, [drawImages]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      setupCanvas();
      await loadImages();
      drawImages();
    };

    init();

    canvas.addEventListener("mousedown", handleDragStart);
    canvas.addEventListener("mousemove", handleDragging);
    canvas.addEventListener("mouseup", handleDragEnd);
    canvas.addEventListener("mouseleave", handleDragEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleDragStart);
      canvas.removeEventListener("mousemove", handleDragging);
      canvas.removeEventListener("mouseup", handleDragEnd);
      canvas.removeEventListener("mouseleave", handleDragEnd);
    };
  }, [
    imageSources,
    setupCanvas,
    loadImages,
    drawImages,
    handleDragStart,
    handleDragging,
    handleDragEnd,
  ]);

  return { canvasRef };
}

export default useCanvasDrag;
