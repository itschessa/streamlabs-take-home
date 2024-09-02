import { SCALE_FACTOR } from "./constants";
import { CanvasImage, Position } from "./types";

/**
 * Checks if a given point (x, y) is within the bounds of the given image,
 * taking into account its position and scaled size.
 *
 * @param {CanvasImage} image The image to check against.
 * @param {Position} point The point to check.
 * @returns {boolean} Whether the point is within the bounds of the image.
 */
const isPointInImage = (
  { pos, img }: CanvasImage,
  { x, y }: Position
): boolean => {
  return (
    x >= pos.x &&
    x <= pos.x + img.width * SCALE_FACTOR &&
    y >= pos.y &&
    y <= pos.y + img.height * SCALE_FACTOR
  );
};

/**
 * Returns the value clamped between the given minimum and maximum values.
 *
 * @param {number} value The value to clamp.
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} The clamped value.
 */
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Returns a random position within the given canvas that is suitable for
 * drawing the given image. The position is chosen such that the image is
 * completely visible within the canvas, taking into account its scaled size.
 *
 * @param {HTMLImageElement} img The image element.
 * @param {HTMLCanvasElement} canvas The canvas element.
 * @returns {Position} The random position.
 */
const getRandomPosition = (
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
): Position => {
  const scaledWidth = img.width * SCALE_FACTOR;
  const scaledHeight = img.height * SCALE_FACTOR;
  const x = Math.random() * (canvas.width - scaledWidth);
  const y = Math.random() * (canvas.height - scaledHeight);
  return { x, y };
};

/**
 * Returns the position of the given mouse event relative to the given canvas.
 *
 * @param {MouseEvent} e The mouse event.
 * @param {HTMLCanvasElement} canvas The canvas element.
 * @returns {Position} The position of the mouse event relative to the canvas.
 */
const getMousePosition = (
  e: MouseEvent,
  canvas: HTMLCanvasElement
): Position => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  return { x, y };
};

export { isPointInImage, clamp, getRandomPosition, getMousePosition };
