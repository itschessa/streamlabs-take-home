import { useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

const SCALE_FACTOR = 0.15;

function App() {
  useEffect(() => {
    const draw = async () => {
      const catImg = new Image();
      const dogImg = new Image();
      catImg.src = "./turtle.svg";
      dogImg.src = "./frog.svg";

      await Promise.all([
        new Promise((resolve) => (catImg.onload = resolve)),
        new Promise((resolve) => (dogImg.onload = resolve)),
      ]);

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

      let catPos: Position = getRandomPosition(catImg);
      let dogPos: Position = getRandomPosition(dogImg);
      let dragging: "cat" | "dog" | null = null;
      let offsetX = 0;
      let offsetY = 0;

      const drawImages = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (dragging === "cat") {
          context.strokeStyle = "green";
          context.lineWidth = 2;
          context.strokeRect(
            catPos.x - 1,
            catPos.y - 1,
            catImg.width * SCALE_FACTOR + 2,
            catImg.height * SCALE_FACTOR + 2
          );
        }
        if (dragging === "dog") {
          context.strokeStyle = "green";
          context.lineWidth = 2;
          context.strokeRect(
            dogPos.x - 1,
            dogPos.y - 1,
            dogImg.width * SCALE_FACTOR + 2,
            dogImg.height * SCALE_FACTOR + 2
          );
        }

        context.drawImage(
          catImg,
          catPos.x,
          catPos.y,
          catImg.width * SCALE_FACTOR,
          catImg.height * SCALE_FACTOR
        );
        context.drawImage(
          dogImg,
          dogPos.x,
          dogPos.y,
          dogImg.width * SCALE_FACTOR,
          dogImg.height * SCALE_FACTOR
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
          x <= pos.x + img.width * SCALE_FACTOR &&
          y >= pos.y &&
          y <= pos.y + img.height * SCALE_FACTOR
        );
      };

      const clamp = (value: number, min: number, max: number) => {
        return Math.max(min, Math.min(max, value));
      };

      canvas.addEventListener("mousedown", (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        console.log(`canvas upper -- ${rect.right}, ${rect.bottom}`);

        if (isPointInImage(catPos, catImg, x, y)) {
          dragging = "cat";
          offsetX = x - catPos.x;
          offsetY = y - catPos.y;
        } else if (isPointInImage(dogPos, dogImg, x, y)) {
          dragging = "dog";
          offsetX = x - dogPos.x;
          offsetY = y - dogPos.y;
        }

        drawImages();
      });

      canvas.addEventListener("mousemove", (e) => {
        if (dragging) {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          const x = (e.clientX - rect.left) * scaleX;
          const y = (e.clientY - rect.top) * scaleY;

          if (dragging === "cat") {
            const newX = x - offsetX;
            const newY = y - offsetY;
            catPos = {
              x: clamp(newX, 0, canvas.width - catImg.width * SCALE_FACTOR),
              y: clamp(newY, 0, canvas.height - catImg.height * SCALE_FACTOR),
            };
          } else if (dragging === "dog") {
            const newX = x - offsetX;
            const newY = y - offsetY;
            dogPos = {
              x: clamp(newX, 0, canvas.width - dogImg.width * SCALE_FACTOR),
              y: clamp(newY, 0, canvas.height - dogImg.height * SCALE_FACTOR),
            };
          }

          drawImages();
        }
      });

      canvas.addEventListener("mouseup", () => {
        dragging = null;
        drawImages();
      });

      canvas.addEventListener("mouseleave", () => {
        dragging = null;
        drawImages();
      });

      drawImages();
    };

    draw();
  }, []);

  return <canvas id="canvas" />;
}

export default App;
