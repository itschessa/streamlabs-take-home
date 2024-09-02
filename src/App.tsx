import useCanvasDrag from "./useCanvasDrag";

function App() {
  const imageSources = [
    { id: "turtle", src: "./turtle.svg" },
    { id: "frog", src: "./frog.svg" },
  ];

  const { canvasRef } = useCanvasDrag(imageSources);

  return <canvas ref={canvasRef} />;
}

export default App;
