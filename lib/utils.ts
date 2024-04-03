import { Camera, Colour, Layer, LayerType, PathLayer, Point, Side, XYWH } from "@/types/canvas";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COLORS = ["#FF5733", "#FFA07A", "#FF6347", "#FF8C00", "#FFD700", "#FFA500", "#FFB6C1", "#F08080", "#20B2AA", "#4682B4"];


export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(e: React.PointerEvent, camera: Camera)
{
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

export function RGBToHex(colour: Colour)
{
  // const mappings = "123456789ABCDEF";
  // const hex = `#${mappings.at(Math.floor(colour.r / 16) - 1)}${mappings.at((colour.r % 16 )-1)}${mappings.at(Math.floor(colour.g / 16) - 1)}${mappings.at((colour.g % 16 )-1)}${mappings.at(Math.floor(colour.b / 16) - 1)}${mappings.at((colour.b % 16 )-1)}`;
  return `#${colour.r.toString(16).padStart(2, "0")}${colour.g.toString(16).padStart(2, "0")}${colour.b.toString(16).padStart(2, "0")}`;
}

export function resizeBounds(bounds: XYWH, corner: Side, point: Point) : { delta: XYWH, result: XYWH }
{
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left)
  {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right)
  {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top)
  {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom)
  {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  const delta = {
    x: result.x - bounds.x,
    y: result.y - bounds.y,
    width: result.width - bounds.width,
    height: result.height - bounds.height,
  }

  return { delta , result }
}

export function findIntersectingLayers(layerIds: readonly string[], layers: ReadonlyMap<string, Layer>, a: Point, b: Point)
{
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    wdith: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }

  const ids = [];

  for (const layerId of layerIds)
  {
    const layer = layers.get(layerId);

    if (layer == null)
    {
      continue;
    }
    
    const {x, y, width, height } = layer;

    if (rect.x + rect.wdith > x && rect.x < x + width && rect.y + rect.height > y && rect.y < y + height)
    {
      ids.push(layerId);
    }
  }

  return ids;
}

export function getContrastingTextColour(colour: Colour) {
  const luminance = 0.299 * colour.r + 0.587 * colour.g + 0.114 * colour.b;

  return luminance > 182 ? "black" : "white";
}

export function penPointsToPathLayer(points: number[][], colour: Colour) : PathLayer {
  if (points.length < 2){
    throw new Error("Cannot transform paths wtih less than 2 points");
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points)
  {
    const [x, y] = point;

    if (left > x)
    {
      left = x;
    }

    if (right < x)
    {
      right = x;
    }

    if (top > y)
    {
      top = y;
    }

    if (bottom < y)
    {
      bottom = y;
    }
  }

  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: colour,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure])
  }
}

export function getSvgPathFromStroke(stroke: number[][])
{
  if (!stroke.length) return "";

  const d = stroke.reduce((acc, [x0, y0], i, arr) => {
    const [x1, y1] = arr[(i + 1) % arr.length];
    acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
    return acc;
  }, ["M", ...stroke[0], "Q"]);

  d.push("Z");
  return d.join(" ");
}