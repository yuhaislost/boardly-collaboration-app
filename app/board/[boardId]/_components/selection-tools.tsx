"use client";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useMutation, useSelf } from "@/liveblocks.config";
import { Camera, Colour } from "@/types/canvas";
import { memo } from "react";
import { ColourPicker } from "./colour-picker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

interface SelectionToolsProps {
    camera: Camera;
    setLastUsedColour: (colour: Colour) => void;
};

export const SelectionTools = memo(({ camera, setLastUsedColour } : SelectionToolsProps) => {

    const selection = useSelf((me) => me.presence.selection);
    const selectionBounds = useSelectionBounds();

    const setFill = useMutation(({storage}, fill: Colour) => {
        const layers = storage.get("layers");
        setLastUsedColour(fill);

        for (let id of selection)
        {
            const layer = layers.get(id);

            if (layer)
            {
                layer.update({ fill: fill});
            }
        }

    }, [setLastUsedColour, selection]);

    const sendToBack = useMutation(({ storage }) => {
        const layerIds = storage.get("layerIds");
        const indices: number[] = [];
        const layerIdsArr = layerIds.toImmutable();

        for (let i = 0; i < layerIdsArr.length; i++)
        {
            if (selection.includes(layerIdsArr[i]))
            {
                indices.push(i);
            }
        }

        for (let i = 0; i < indices.length; i++)
        {
            layerIds.move(indices[i], i);
        }

    }, [selection]);

    const bringToFront = useMutation(({ storage }) => {
        const layerIds = storage.get('layerIds');
        const layerIdsArr = layerIds.toImmutable();
        const indicies: number[] = [];

        for (let i: number = 0; i < layerIdsArr.length; i++)
        {
            if (selection.includes(layerIdsArr[i]))
            {
                indicies.push(i);
            }
        }

        for (let i: number = 0; i < indicies.length; i++)
        {
            layerIds.move(indicies[indicies.length - i - 1], layerIds.length - i - 1);
        }

    }, [selection]);

    const deleteLayers = useDeleteLayers();

    if (!selectionBounds)
    {
        return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
        <div className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none" style={{
            transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`
        }}>
            <ColourPicker onChange={setFill}/>
            <div className="flex flex-col gap-y-0.5 items-center justify-center">
                <Hint label="Bring to font">
                    <Button variant={'board'} size={'icon'} onClick={bringToFront}>
                        <BringToFront/>
                    </Button>
                </Hint>
                <Hint label="Send to back" side="bottom">
                    <Button variant={'board'} size={'icon'} onClick={sendToBack}>
                        <SendToBack/>
                    </Button>
                </Hint>
            </div>
            <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
                <Hint label="Delete">
                    <Button variant={'board'} size={'icon'} onClick={deleteLayers}>
                        <Trash2/>
                    </Button>
                </Hint>
            </div>
        </div>
    );
});

SelectionTools.displayName = "SelectionTools";