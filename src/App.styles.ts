import styled from "styled-components";

// TODO come back and fix aspect ratio because i don't think this is right
const StyledCanvas = styled.canvas`
  max-width: 100%;
  max-height: 100%;
  width: 100vw;
  height: calc(9 / 16 * 100vw);
  background-color: pink;
`;

export { StyledCanvas };
