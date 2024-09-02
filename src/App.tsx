import { useEffect } from "react";
import { StyledCanvas } from "./App.styles";

interface Position {
  x: number;
  y: number;
}

function App() {
  useEffect(() => {
    const draw = async () => {
      const catImg = new Image();
      const dogImg = new Image();
      catImg.src = "./cat.png";
      dogImg.src = "./dog.png";

      await Promise.all([
        new Promise((resolve) => (catImg.onload = resolve)),
        new Promise((resolve) => (dogImg.onload = resolve)),
      ]);

      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      if (context === null) {
        return;
      }

      let catPos: Position = { x: 0, y: 0 };
      let dogPos: Position = { x: 100, y: 100 };
      let dragging: "cat" | "dog" | null = null;
      let offsetX = 0;
      let offsetY = 0;

      const drawImages = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
          catImg,
          catPos.x,
          catPos.y,
          catImg.width * 0.15,
          catImg.height * 0.15
        );
        context.drawImage(
          dogImg,
          dogPos.x,
          dogPos.y,
          dogImg.width * 0.15,
          dogImg.height * 0.15
        );
      };

      const isPointInImage = (
        pos: Position,
        img: HTMLImageElement,
        x: number,
        y: number
      ) => {
        return (
          x >= pos.x &&
          x <= pos.x + img.width &&
          y >= pos.y &&
          y <= pos.y + img.height
        );
      };

      const clamp = (value: number, min: number, max: number) => {
        return Math.max(min, Math.min(max, value));
      };

      canvas.addEventListener("mousedown", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (isPointInImage(catPos, catImg, x, y)) {
          dragging = "cat";
          offsetX = x - catPos.x;
          offsetY = y - catPos.y;
        } else if (isPointInImage(dogPos, dogImg, x, y)) {
          dragging = "dog";
          offsetX = x - dogPos.x;
          offsetY = y - dogPos.y;
        }
      });

      canvas.addEventListener("mousemove", (e) => {
        if (dragging) {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          if (dragging === "cat") {
            const newX = x - offsetX;
            const newY = y - offsetY;
            catPos = {
              x: clamp(newX, 0, canvas.width - catImg.width * 0.15),
              y: clamp(newY, 0, canvas.height - catImg.height * 0.15),
            };
          } else if (dragging === "dog") {
            const newX = x - offsetX;
            const newY = y - offsetY;
            dogPos = {
              x: clamp(newX, 0, canvas.width - dogImg.width * 0.15),
              y: clamp(newY, 0, canvas.height - dogImg.height * 0.15),
            };
          }

          drawImages();
        }
      });

      canvas.addEventListener("mouseup", () => {
        dragging = null;
      });

      canvas.addEventListener("mouseleave", () => {
        dragging = null;
      });

      drawImages();
    };

    draw();
  }, []);

  return <StyledCanvas id="canvas" />;
}

export default App;
