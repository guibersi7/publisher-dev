/**
 * Cover Crop Utility
 *
 * Implements CSS "background-size: cover" behavior for images.
 * Scales the image to fill the target area while maintaining aspect ratio,
 * cropping any excess.
 */

import type { CoverCropResult } from './types'

/**
 * Calculate cover crop parameters
 *
 * Given source image dimensions and target canvas dimensions,
 * calculates how to scale and position the image to achieve
 * "cover" behavior (fill area, maintain aspect ratio, crop excess).
 *
 * @param imgWidth - Source image width
 * @param imgHeight - Source image height
 * @param canvasWidth - Target canvas width
 * @param canvasHeight - Target canvas height
 * @returns CoverCropResult with all necessary drawing parameters
 *
 * @example
 * ```typescript
 * const crop = calculateCoverCrop(1920, 1080, 1080, 1920)
 * ctx.drawImage(
 *   img,
 *   crop.sourceX, crop.sourceY, crop.sourceWidth, crop.sourceHeight,
 *   crop.destX, crop.destY, crop.destWidth, crop.destHeight
 * )
 * ```
 */
export function calculateCoverCrop(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number
): CoverCropResult {
  // Calculate aspect ratios
  const imgAspect = imgWidth / imgHeight
  const canvasAspect = canvasWidth / canvasHeight

  let scale: number
  let sourceX: number
  let sourceY: number
  let sourceWidth: number
  let sourceHeight: number

  if (imgAspect > canvasAspect) {
    // Image is wider than canvas (relative to height)
    // Scale based on height, crop width
    scale = canvasHeight / imgHeight

    // Calculate the width we need from the source image
    sourceHeight = imgHeight
    sourceWidth = canvasWidth / scale

    // Center horizontally (crop equal amounts from left and right)
    sourceX = (imgWidth - sourceWidth) / 2
    sourceY = 0
  } else {
    // Image is taller than canvas (relative to width)
    // Scale based on width, crop height
    scale = canvasWidth / imgWidth

    // Calculate the height we need from the source image
    sourceWidth = imgWidth
    sourceHeight = canvasHeight / scale

    // Center vertically (crop equal amounts from top and bottom)
    sourceX = 0
    sourceY = (imgHeight - sourceHeight) / 2
  }

  return {
    scale,
    sourceX: Math.max(0, sourceX),
    sourceY: Math.max(0, sourceY),
    sourceWidth: Math.min(sourceWidth, imgWidth),
    sourceHeight: Math.min(sourceHeight, imgHeight),
    destX: 0,
    destY: 0,
    destWidth: canvasWidth,
    destHeight: canvasHeight,
  }
}

/**
 * Calculate contain crop parameters (for reference)
 *
 * Scales image to fit entirely within the target area,
 * maintaining aspect ratio. May leave empty space.
 *
 * @param imgWidth - Source image width
 * @param imgHeight - Source image height
 * @param canvasWidth - Target canvas width
 * @param canvasHeight - Target canvas height
 * @returns Parameters for drawing with letterboxing/pillarboxing
 */
export function calculateContainCrop(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number
): CoverCropResult {
  const imgAspect = imgWidth / imgHeight
  const canvasAspect = canvasWidth / canvasHeight

  let destWidth: number
  let destHeight: number
  let destX: number
  let destY: number

  if (imgAspect > canvasAspect) {
    // Image is wider - fit to width, letterbox top/bottom
    destWidth = canvasWidth
    destHeight = canvasWidth / imgAspect
    destX = 0
    destY = (canvasHeight - destHeight) / 2
  } else {
    // Image is taller - fit to height, pillarbox left/right
    destHeight = canvasHeight
    destWidth = canvasHeight * imgAspect
    destX = (canvasWidth - destWidth) / 2
    destY = 0
  }

  return {
    scale: Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight),
    sourceX: 0,
    sourceY: 0,
    sourceWidth: imgWidth,
    sourceHeight: imgHeight,
    destX,
    destY,
    destWidth,
    destHeight,
  }
}
