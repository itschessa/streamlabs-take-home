import { useRef, useEffect } from "react";
import { ImageSource, Position } from "./types";
import { ASPECT_RATIO, SCALE_FACTOR } from "./constants";
import {
  isPointInImage,
  clamp,
  getRandomPosition,
  getMousePosition,
} from "./helpers";

function useCanvasDrag(imageSources: ImageSource[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = async () => {
      const images = imageSources.map(({ id, src }) => {
        const img = new Image();
        img.src = src;
        return { id, img };
      });

      await Promise.all(
        images.map(
          ({ img }) => new Promise((resolve) => (img.onload = resolve))
        )
      );
      
      const context = canvas.getContext("2d");
      if (context === null) {
        return;
      }

      canvas.height = window.innerHeight;
      canvas.width = canvas.height * ASPECT_RATIO;

      const imagePositions = images.reduce((acc, { id, img }) => {
        acc[id] = getRandomPosition(img, canvas);
        return acc;
      }, {} as Record<string, Position>);

      let dragging: string | null = null;
      let offsetX = 0;
      let offsetY = 0;

      const drawImages = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        images.forEach(({ id, img }) => {
          const pos = imagePositions[id];
          if (dragging === id) {
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
      };

      const handleDragStart = (e: MouseEvent) => {
        const { x, y } = getMousePosition(e, canvas);

        for (const { id, img } of images) {
          const pos = imagePositions[id];
          if (isPointInImage(pos, img, x, y)) {
            dragging = id;
            offsetX = x - pos.x;
            offsetY = y - pos.y;
            break;
          }
        }

        drawImages();
      };

      const handleDragging = (e: MouseEvent) => {
        if (dragging) {
          const { x, y } = getMousePosition(e, canvas);

          const draggedImage = images.find((img) => img.id === dragging);
          if (draggedImage) {
            const newX = x - offsetX;
            const newY = y - offsetY;
            imagePositions[dragging] = {
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
        }
      };

      const handleDragEnd = () => {
        dragging = null;
        drawImages();
      };

      canvas.addEventListener("mousedown", handleDragStart);
      canvas.addEventListener("mousemove", handleDragging);
      canvas.addEventListener("mouseup", handleDragEnd);
      canvas.addEventListener("mouseleave", handleDragEnd);

      drawImages();
    };

    draw();
  }, [imageSources]);

  return { canvasRef };
}

export default useCanvasDrag;
