import { RGBToHex } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";

interface RectangleProps {
    id: string;
    layer: RectangleLayer;
    onPointerDown: (event: React.PointerEvent, id: string) => void;
    selectionColour?: string;
};

export const Rectangle = ({ id, layer, onPointerDown, selectionColour} : RectangleProps) => {
    const { x, y, width, height, fill } = layer;

    return (
        <rect className="drop-shadow-md" onPointerDown={(e) => onPointerDown(e, id)} style={{
            transform: `translate(${x}px, ${y}px)`
        }} x={0} y={0} width={width} height={height} strokeWidth={1} fill={fill ? RGBToHex(fill) : "#000"} stroke={selectionColour || "transparent"}/>
    );
}