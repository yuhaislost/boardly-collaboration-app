"use cient";

import { useSelectedLayers } from "@/hooks/use-selected-layers";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useSelf } from "@/liveblocks.config";
import { Layer, LayerType, Side, XYWH } from "@/types/canvas";
import React, { memo } from "react";

interface SelectionBoxProps {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH, initialSelectedLayersData: Map<string, Layer>) => void;
};

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({onResizeHandlePointerDown} : SelectionBoxProps) => {
    const selectedLayers = useSelectedLayers() as  Map<string, Layer>;

    function checkShowHandles()
    {
        for (let [key, value] of selectedLayers)
        {
            if (value && value.type === LayerType.Path)
            {
                return false;
            }
        }

        return true;
    }

    const isShowingHandles = checkShowHandles();
    const bounds = useSelectionBounds();

    if (!bounds)
    {
        return null;
    }

    const ResizeIndicator = ({cursor, transformX, transformY, onPointerDown} : {cursor: string, transformX: number, transformY: number, onPointerDown: (event: React.PointerEvent) => void}) => {
        return (
            <rect className="fill-white stroke-1 stroke-blue-500" x={0} y={0} style={{cursor: `${cursor}`, width: `${HANDLE_WIDTH}px`, height: `${HANDLE_WIDTH}px`, transform: `translate(${transformX}px, ${transformY}px)`}} onPointerDown={onPointerDown}/>
        );
    };

    return (
        <>
            <rect className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none" style={{transform: `translate(${bounds.x}px, ${bounds.y}px)`}} width={bounds.width} height={bounds.height} x={0} y={0}/>
            {isShowingHandles && (
                <>
                    <ResizeIndicator cursor={'nwse-resize'} transformX={bounds.x - HANDLE_WIDTH / 2} transformY={bounds.y - HANDLE_WIDTH / 2} onPointerDown={(event: React.PointerEvent) => {
                       event.stopPropagation();
                       onResizeHandlePointerDown(Side.Top + Side.Left, bounds, selectedLayers); 
                    }}/>
                    <ResizeIndicator cursor={'ns-resize'} transformX={bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2} transformY={bounds.y - HANDLE_WIDTH / 2} onPointerDown={(event: React.PointerEvent) => {
                       event.stopPropagation();
                       onResizeHandlePointerDown(Side.Top, bounds, selectedLayers); 
                    }}/>
                    <ResizeIndicator cursor={'nesw-resize'} transformX={bounds.x + bounds.width - HANDLE_WIDTH / 2} transformY={bounds.y - HANDLE_WIDTH / 2} onPointerDown={(event: React.PointerEvent) => {
                       event.stopPropagation();
                       onResizeHandlePointerDown(Side.Top + Side.Right, bounds, selectedLayers); 
                    }}/>
                    <ResizeIndicator cursor={'nesw-resize'} transformX={bounds.x - HANDLE_WIDTH / 2} transformY={bounds.y + bounds.height - HANDLE_WIDTH / 2} onPointerDown={(event: React.PointerEvent) => {
                       event.stopPropagation();
                       onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds, selectedLayers); 
                    }}/>
                    <ResizeIndicator cursor={'ns-resize'} transformX={bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2} transformY={bounds.y + bounds.height - HANDLE_WIDTH / 2} onPointerDown={(event: React.PointerEvent) => {
                       event.stopPropagation();
                       onResizeHandlePointerDown(Side.Bottom, bounds, selectedLayers); 
                    }}/>
                    <ResizeIndicator cursor={'nwse-resize'} transformX={bounds.x + bounds.width - HANDLE_WIDTH / 2} transformY={bounds.y + bounds.height - HANDLE_WIDTH / 2} onPointerDown={(event: React.PointerEvent) => {
                       event.stopPropagation();
                       onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds, selectedLayers); 
                    }}/>
                    <ResizeIndicator cursor={'w-resize'} transformX={bounds.x - HANDLE_WIDTH / 2} transformY={bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2} onPointerDown={(event: React.PointerEvent) => {
                       event.stopPropagation();
                       onResizeHandlePointerDown(Side.Left, bounds, selectedLayers); 
                    }}/>
                    <ResizeIndicator cursor={'e-resize'} transformX={bounds.x + bounds.width - HANDLE_WIDTH / 2} transformY={bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2} onPointerDown={(event: React.PointerEvent) => {
                       event.stopPropagation();
                       onResizeHandlePointerDown(Side.Right, bounds, selectedLayers); 
                    }}/>
                </>
            )}
        </>
    );
});

SelectionBox.displayName = 'SelectionBox';