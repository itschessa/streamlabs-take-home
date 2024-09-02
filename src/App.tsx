import { useEffect } from "react";
import { Position } from "./types";

const SCALE_FACTOR = 0.15;

function App() {
  useEffect(() => {
    const draw = async () => {
      const imageSources = [
        { id: "turtle", src: "./turtle.svg" },
        { id: "frog", src: "./frog.svg" },
      ];

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

      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      if (context === null) {
        return;
      }

      canvas.height = window.innerHeight;
      canvas.width = canvas.height * (16 / 9);

      const getRandomPosition = (img: HTMLImageElement) => {
        const scaledWidth = img.width * SCALE_FACTOR;
        const scaledHeight = img.height * SCALE_FACTOR;
        const x = Math.random() * (canvas.width - scaledWidth);
        const y = Math.random() * (canvas.height - scaledHeight);
        return { x, y };
      };

      const imagePositions = images.reduce((acc, { id, img }) => {
        acc[id] = getRandomPosition(img);
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

      const isPointInImage = (
        pos: Position,
        img: HTMLImageElement,
        x: number,
        y: number
      ) => {
        return (
          x >= pos.x &&
          x <= pos.x + img.width * SCALE_FACTOR &&
          y >= pos.y &&
          y <= pos.y + img.height * SCALE_FACTOR
        );
      };

      const clamp = (value: number, min: number, max: number) => {
        return Math.max(min, Math.min(max, value));
      };

      const getMousePosition = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        return { x, y };
      };

      const handleDragStart = (e: MouseEvent) => {
        const { x, y } = getMousePosition(e);

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
          const { x, y } = getMousePosition(e);

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
  }, []);

  return <canvas id="canvas" />;
}

export default App;
