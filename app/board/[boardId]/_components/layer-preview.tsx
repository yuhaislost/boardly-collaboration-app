"use client";

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { memo } from "react";
import { Rectangle } from "./layers/rectangle";
import { Ellipse } from "./layers/ellipse";
import { Text } from "./layers/text";
import { Note } from "./layers/note";
import { RGBToHex } from "@/lib/utils";
import { Path } from "./layers/path";

interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (event: React.PointerEvent, id: string) => void;
    selectionColour?: string;
};

export const LayerPreview = memo(({ id, onLayerPointerDown, selectionColour }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer)
    {
        return null;
    }

    switch (layer.type) {
        case LayerType.Rectangle:
            return (
                <Rectangle layer={layer} id={id} onPointerDown={onLayerPointerDown} selectionColour={selectionColour}/>
            );

        case LayerType.Ellipse:
            return (
                <Ellipse layer={layer} id={id} onPointerDown={onLayerPointerDown} selectionColour={selectionColour}/>
            );
        
        case LayerType.Text:
            return (
                <Text layer={layer} id={id} onPointerDown={onLayerPointerDown} selectionColour={selectionColour}/>
            );

        case LayerType.Note:
            return (
                <Note id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColour={selectionColour}/>
            );
        
        case LayerType.Path:
            return (
                <Path key={id} points={layer.points} onPointerDown={(e) => onLayerPointerDown(e, id)} stroke={selectionColour} x={layer.x} y={layer.y} fill={layer.fill ? RGBToHex(layer.fill) : "#000"}/>
            );

        default:
            return null;
    }
});

LayerPreview.displayName = "LayerPreview";