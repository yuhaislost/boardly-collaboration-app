import { RGBToHex } from "@/lib/utils";
import { EllipseLayer } from "@/types/canvas";

interface EllipseProps {
    id: string;
    layer: EllipseLayer;
    onPointerDown: (event: React.PointerEvent, id: string) => void;
    selectionColour?: string;
}

export const Ellipse = ({ id, layer, onPointerDown, selectionColour} : EllipseProps) => {
    return (
        <ellipse className="drop-shadow-md" onPointerDown={(e) => onPointerDown(e, id)} style={{
            transform: `translate(${layer.x}px, ${layer.y}px)`
        }} cx={layer.width/2} cy={layer.height / 2} rx={layer.width / 2} ry={layer.height / 2} fill={layer.fill ? RGBToHex(layer.fill) : "#000"} stroke={selectionColour || "transparent"} strokeWidth={1}/>
    )
}