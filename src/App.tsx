import { useEffect } from "react";
import { StyledCanvas } from "./App.styles";

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

      context.drawImage(catImg, 0, 0, catImg.width * 0.15, catImg.height * 0.15);
      context.drawImage(dogImg, 100, 100, dogImg.width * 0.15, dogImg.height * 0.15);
    };

    draw();
  }, []);

  return <StyledCanvas id="canvas" />;
}

export default App;
