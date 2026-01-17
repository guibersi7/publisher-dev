/**
 * Text Fitting Utility
 *
 * Implements automatic text fitting within a bounding box.
 * Uses binary search to find the optimal font size and
 * word wrapping to handle multi-line text.
 */

import type { SKRSContext2D } from '@napi-rs/canvas'
import type { TextLayer, TextMeasurement } from './types'

/**
 * Split text into words, preserving whitespace information
 */
function splitIntoWords(text: string): string[] {
  // Split on whitespace but keep the structure
  return text.split(/(\s+)/).filter(w => w.length > 0)
}

/**
 * Measure text width with current canvas context settings
 */
function measureTextWidth(ctx: SKRSContext2D, text: string): number {
  return ctx.measureText(text).width
}

/**
 * Wrap text into lines that fit within maxWidth
 *
 * @param ctx - Canvas 2D context (with font already set)
 * @param text - Text to wrap
 * @param maxWidth - Maximum width per line in pixels
 * @returns Array of lines
 */
export function wrapText(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number
): string[] {
  // Handle empty text
  if (!text || !text.trim()) {
    return ['']
  }

  // Split into paragraphs (preserve intentional line breaks)
  const paragraphs = text.split('\n')
  const allLines: string[] = []

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      // Empty paragraph = blank line
      allLines.push('')
      continue
    }

    const words = paragraph.split(/\s+/).filter(w => w.length > 0)
    if (words.length === 0) {
      allLines.push('')
      continue
    }

    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const testLine = currentLine + ' ' + word
      const testWidth = measureTextWidth(ctx, testLine)

      if (testWidth <= maxWidth) {
        // Word fits on current line
        currentLine = testLine
      } else {
        // Word doesn't fit - start new line
        allLines.push(currentLine)
        currentLine = word

        // Handle very long words that exceed maxWidth
        while (measureTextWidth(ctx, currentLine) > maxWidth && currentLine.length > 1) {
          // Find break point
          let breakIndex = currentLine.length - 1
          while (breakIndex > 0 && measureTextWidth(ctx, currentLine.slice(0, breakIndex)) > maxWidth) {
            breakIndex--
          }
          if (breakIndex === 0) breakIndex = 1 // At least 1 character
          allLines.push(currentLine.slice(0, breakIndex))
          currentLine = currentLine.slice(breakIndex)
        }
      }
    }

    // Add the last line of this paragraph
    if (currentLine) {
      allLines.push(currentLine)
    }
  }

  return allLines
}

/**
 * Set font on canvas context
 */
function setFont(
  ctx: SKRSContext2D,
  fontSize: number,
  fontWeight: number | string,
  fontFamily: string
): void {
  const weight = typeof fontWeight === 'number' ? fontWeight : (fontWeight === 'bold' ? 700 : 400)
  ctx.font = `${weight} ${fontSize}px "${fontFamily}"`
}

/**
 * Calculate total height of wrapped text
 */
function calculateTextHeight(
  lineCount: number,
  fontSize: number,
  lineHeight: number
): number {
  // First line is full height, subsequent lines add lineHeight * fontSize
  if (lineCount === 0) return 0
  if (lineCount === 1) return fontSize
  return fontSize + (lineCount - 1) * fontSize * lineHeight
}

/**
 * Check if text fits within the bounding box at given font size
 */
function textFitsInBox(
  ctx: SKRSContext2D,
  text: string,
  fontSize: number,
  layer: TextLayer
): { fits: boolean; lines: string[]; totalHeight: number; maxLineWidth: number } {
  const [, , boxWidth, boxHeight] = layer.box

  // Set font for measurement
  setFont(ctx, fontSize, layer.fontWeight, layer.fontFamily)

  // Wrap text at current font size
  const lines = wrapText(ctx, text, boxWidth)

  // Check max lines constraint
  if (layer.maxLines && lines.length > layer.maxLines) {
    return { fits: false, lines, totalHeight: 0, maxLineWidth: 0 }
  }

  // Calculate total height
  const totalHeight = calculateTextHeight(lines.length, fontSize, layer.lineHeight)

  // Check height constraint
  if (totalHeight > boxHeight) {
    return { fits: false, lines, totalHeight, maxLineWidth: 0 }
  }

  // Calculate max line width
  const maxLineWidth = Math.max(...lines.map(line => measureTextWidth(ctx, line)))

  return { fits: true, lines, totalHeight, maxLineWidth }
}

/**
 * Find optimal font size using binary search
 *
 * Finds the largest font size that allows the text to fit
 * within the bounding box while respecting maxLines constraint.
 *
 * @param ctx - Canvas 2D context
 * @param text - Text to fit
 * @param layer - Text layer configuration
 * @returns TextMeasurement with optimal font size and wrapped lines
 */
export function fitText(
  ctx: SKRSContext2D,
  text: string,
  layer: TextLayer
): TextMeasurement {
  const { minFontSize, maxFontSize } = layer

  // Binary search for optimal font size
  let low = minFontSize
  let high = maxFontSize
  let bestResult: TextMeasurement = {
    lines: [text],
    fontSize: minFontSize,
    totalHeight: minFontSize,
    maxLineWidth: 0,
  }

  // Precision: we'll stop when the range is less than 1px
  while (high - low >= 1) {
    const mid = Math.floor((low + high) / 2)
    const result = textFitsInBox(ctx, text, mid, layer)

    if (result.fits) {
      // Text fits at this size, try larger
      bestResult = {
        lines: result.lines,
        fontSize: mid,
        totalHeight: result.totalHeight,
        maxLineWidth: result.maxLineWidth,
      }
      low = mid + 1
    } else {
      // Text doesn't fit, try smaller
      high = mid - 1
    }
  }

  // Final check with low value (it might be better than bestResult)
  const finalCheck = textFitsInBox(ctx, text, low, layer)
  if (finalCheck.fits && low > bestResult.fontSize) {
    bestResult = {
      lines: finalCheck.lines,
      fontSize: low,
      totalHeight: finalCheck.totalHeight,
      maxLineWidth: finalCheck.maxLineWidth,
    }
  }

  return bestResult
}

/**
 * Calculate Y position for text based on vertical alignment
 */
export function calculateTextY(
  boxY: number,
  boxHeight: number,
  totalTextHeight: number,
  verticalAlign: 'top' | 'middle' | 'bottom' = 'middle'
): number {
  switch (verticalAlign) {
    case 'top':
      return boxY
    case 'bottom':
      return boxY + boxHeight - totalTextHeight
    case 'middle':
    default:
      return boxY + (boxHeight - totalTextHeight) / 2
  }
}

/**
 * Calculate X position for a line based on horizontal alignment
 */
export function calculateTextX(
  boxX: number,
  boxWidth: number,
  lineWidth: number,
  align: 'left' | 'center' | 'right'
): number {
  switch (align) {
    case 'left':
      return boxX
    case 'right':
      return boxX + boxWidth - lineWidth
    case 'center':
    default:
      return boxX + (boxWidth - lineWidth) / 2
  }
}
