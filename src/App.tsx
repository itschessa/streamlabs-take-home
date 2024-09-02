import { ImageSource } from "./types";
import useCanvasDrag from "./useCanvasDrag";

function App() {
  const imageSources: ImageSource[] = [
    { id: "turtle", src: "./turtle.svg" },
    { id: "frog", src: "./frog.svg" },
  ];

  const canvasRef = useCanvasDrag(imageSources);

  return <canvas ref={canvasRef} />;
}

export default App;
