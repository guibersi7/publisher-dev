/**
 * Template Renderer Types
 *
 * These types define the structure of carousel templates.
 * Templates are JSON files that describe layers (images, overlays, text)
 * to be rendered on a canvas.
 */

// Canvas dimensions for Instagram stories/reels
export const CANVAS_WIDTH = 1080
export const CANVAS_HEIGHT = 1920

/**
 * Text alignment options
 */
export type TextAlign = 'left' | 'center' | 'right'

/**
 * Vertical alignment for text within its bounding box
 */
export type VerticalAlign = 'top' | 'middle' | 'bottom'

/**
 * Bounding box for positioning elements
 * [x, y, width, height] - all values in pixels
 */
export type BoundingBox = [number, number, number, number]

/**
 * RGBA color representation
 * Each value 0-255, alpha 0-1
 */
export interface RGBAColor {
  r: number
  g: number
  b: number
  a: number
}

/**
 * Text shadow configuration
 */
export interface TextShadow {
  offsetX: number
  offsetY: number
  blur: number
  color: string // CSS color string
}

/**
 * Gradient stop for overlays
 */
export interface GradientStop {
  position: number // 0-1
  color: string // CSS color with alpha
}

/**
 * Base layer interface - all layers extend this
 */
export interface BaseLayer {
  id: string
  type: 'image' | 'overlay' | 'text' | 'badge'
  zIndex: number
  visible?: boolean // defaults to true
}

/**
 * Image layer (typically the background)
 */
export interface ImageLayer extends BaseLayer {
  type: 'image'
  // For background, box is usually [0, 0, CANVAS_WIDTH, CANVAS_HEIGHT]
  box: BoundingBox
  fit: 'cover' | 'contain' | 'fill'
  // Optional source - can be overridden at render time
  defaultSource?: string
}

/**
 * Overlay layer - semi-transparent rectangle or gradient
 * Used to improve text legibility over images
 */
export interface OverlayLayer extends BaseLayer {
  type: 'overlay'
  box: BoundingBox
  // Solid color overlay
  backgroundColor?: string
  // Or gradient overlay (takes precedence)
  gradient?: {
    type: 'linear'
    direction: 'to-bottom' | 'to-top' | 'to-left' | 'to-right'
    stops: GradientStop[]
  }
}

/**
 * Text layer configuration
 * Supports auto-fitting text to bounding box
 */
export interface TextLayer extends BaseLayer {
  type: 'text'
  box: BoundingBox

  // Font configuration
  fontFamily: string
  fontWeight: number | 'normal' | 'bold'

  // Font size limits for auto-fit
  // The renderer will find the largest size that fits
  maxFontSize: number
  minFontSize: number

  // Text styling
  color: string // CSS color string
  align: TextAlign
  verticalAlign?: VerticalAlign // defaults to 'middle'

  // Line configuration
  lineHeight: number // multiplier (e.g., 1.2)
  letterSpacing?: number // pixels
  maxLines?: number // if undefined, unlimited

  // Optional effects
  shadow?: TextShadow

  // Default text (can be overridden at render time)
  defaultText?: string
}

/**
 * Badge layer - small decorative elements
 * Can contain text or be a simple shape
 */
export interface BadgeLayer extends BaseLayer {
  type: 'badge'
  box: BoundingBox
  shape: 'rectangle' | 'rounded' | 'pill' | 'circle'
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number // for 'rounded' shape

  // Optional text inside badge
  text?: {
    fontFamily: string
    fontSize: number
    fontWeight: number | 'normal' | 'bold'
    color: string
    align: TextAlign
    defaultText?: string
  }
}

/**
 * Union type for all layer types
 */
export type Layer = ImageLayer | OverlayLayer | TextLayer | BadgeLayer

/**
 * Complete template definition
 */
export interface Template {
  id: string
  name: string
  description?: string

  // Canvas size
  width: number
  height: number

  // Default background color (shown if no image)
  backgroundColor?: string

  // Layers ordered by zIndex (lowest first)
  layers: Layer[]

  // Metadata
  version: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Background input types for rendering
 */
export interface BackgroundInput {
  type: 'url' | 'base64' | 'supabase'
  value: string
}

/**
 * Text inputs map - layer id to text content
 */
export type TextInputs = Record<string, string>

/**
 * Optional color palette override
 */
export interface PaletteOverride {
  textColor?: string
  overlayColor?: string
  accentColor?: string
}

/**
 * Render request for a single slide
 */
export interface RenderSlideRequest {
  templateId: string
  background: BackgroundInput
  texts: TextInputs
  palette?: PaletteOverride
}

/**
 * Render request for batch carousel
 */
export interface RenderCarouselRequest {
  slides: RenderSlideRequest[]
  outputFormat?: 'base64' | 'storage' // defaults to 'storage'
  userId?: string // required if outputFormat is 'storage'
}

/**
 * Single slide render result
 */
export interface RenderSlideResult {
  success: boolean
  imageBase64?: string
  imageUrl?: string
  error?: string
}

/**
 * Batch render result
 */
export interface RenderCarouselResult {
  success: boolean
  slides: RenderSlideResult[]
  errors?: string[]
}

/**
 * Cover crop calculation result
 */
export interface CoverCropResult {
  scale: number
  sourceX: number
  sourceY: number
  sourceWidth: number
  sourceHeight: number
  destX: number
  destY: number
  destWidth: number
  destHeight: number
}

/**
 * Text measurement result
 */
export interface TextMeasurement {
  lines: string[]
  fontSize: number
  totalHeight: number
  maxLineWidth: number
}
