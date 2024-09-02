import { useRef, useEffect, useCallback } from "react";
import { CanvasImage, ImageSource, Position } from "./types";
import { ASPECT_RATIO, SCALE_FACTOR } from "./constants";
import {
  isPointInImage,
  clamp,
  getRandomPosition,
  getMousePosition,
  sortImagesByZIndex,
  resetZIndexes,
} from "./helpers";

/**
 * A custom React hook for implementing drag-and-drop functionality on a canvas.
 * This hook manages the canvas setup, image loading, and drag interactions for multiple images.
 *
 * @param {ImageSource[]} imageSources - An array of image sources to be loaded and rendered on the canvas.
 * @returns {React.RefObject<HTMLCanvasElement>} A ref object for the canvas element.
 *
 * @example
 * const imageSources = [
 *   { id: "image1", src: "./image1.png" },
 *   { id: "image2", src: "./image2.png" }
 * ];
 * const canvasRef = useCanvasDrag(imageSources);
 *
 * // In your component's JSX:
 * <canvas ref={canvasRef} />
 */
function useCanvasDrag(imageSources: ImageSource[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef<string | null>(null);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });
  const canvasImagesRef = useRef<CanvasImage[]>([]);

  const getCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error("Canvas is not available");
    }
    return canvas;
  }, []);

  const setupCanvas = useCallback(() => {
    const canvas = getCanvas();
    canvas.height = window.innerHeight;
    canvas.width = canvas.height * ASPECT_RATIO;
  }, [getCanvas]);

  const loadImages = useCallback(async () => {
    const canvas = getCanvas();
    const newCanvasImages: CanvasImage[] = [];
    let zIndex = 0;

    for (const { id, src } of imageSources) {
      const img = new Image();
      img.src = src;
      await new Promise((resolve) => (img.onload = resolve));
      const pos = getRandomPosition(img, canvas);
      newCanvasImages.push({ id, img, pos, zIndex: zIndex++ });
    }

    canvasImagesRef.current = newCanvasImages;
  }, [imageSources, getCanvas]);

  const drawImages = useCallback(() => {
    const canvas = getCanvas();
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const { id, img, pos } of canvasImagesRef.current) {
      // highlight the image being dragged
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
    }
  }, [getCanvas]);

  const handleDragStart = useCallback(
    (e: MouseEvent) => {
      const canvas = getCanvas();
      const mousePosition = getMousePosition(e, canvas);
      const sortedImages = sortImagesByZIndex(canvasImagesRef.current, false);

      for (const image of sortedImages) {
        if (isPointInImage(image, mousePosition)) {
          draggingRef.current = image.id;
          offsetRef.current = {
            x: mousePosition.x - image.pos.x,
            y: mousePosition.y - image.pos.y,
          };
          // Reset z-indexes, ensuring the dragged image is on top
          canvasImagesRef.current = resetZIndexes(
            canvasImagesRef.current,
            image.id
          );

          drawImages();
          break;
        }
      }
    },
    [drawImages, getCanvas]
  );

  const handleDragging = useCallback(
    (e: MouseEvent) => {
      if (!draggingRef.current) return;

      const draggedImage = canvasImagesRef.current.find(
        (img) => img.id === draggingRef.current
      );

      if (!draggedImage) return;

      const canvas = getCanvas();
      const { x, y } = getMousePosition(e, canvas);
      const newX = x - offsetRef.current.x;
      const newY = y - offsetRef.current.y;
      const maxX = canvas.width - draggedImage.img.width * SCALE_FACTOR;
      const maxY = canvas.height - draggedImage.img.height * SCALE_FACTOR;

      draggedImage.pos = {
        x: clamp(newX, 0, maxX),
        y: clamp(newY, 0, maxY),
      };

      drawImages();
    },
    [drawImages, getCanvas]
  );

  const handleDragEnd = useCallback(() => {
    draggingRef.current = null;
    drawImages();
  }, [drawImages]);

  useEffect(() => {
    const init = async () => {
      setupCanvas();
      await loadImages();
      drawImages();
    };

    init();

    const canvas = getCanvas();
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
    getCanvas,
  ]);

  return canvasRef;
}

export default useCanvasDrag;
