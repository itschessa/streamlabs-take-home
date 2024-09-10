import { ImageSource } from "./types";
import useCanvasDrag from "./useCanvasDrag";

function App() {
  const imageSources: ImageSource[] = [
    { id: "turtle", src: "./turtle.svg" },
    { id: "frog", src: "./frog.svg" },
  ];

  const { canvasRef, handleUndo, handleRedo } = useCanvasDrag(imageSources);

  return (
    <>
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleRedo}>Redo</button>
      <canvas ref={canvasRef} />
    </>
  );
}

export default App;
