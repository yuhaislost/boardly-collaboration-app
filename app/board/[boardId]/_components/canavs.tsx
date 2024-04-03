'use client';

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { Camera, CanvasMode, CanvasState, Colour, Layer, LayerType, Point, Side, XYWH } from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useSelf, useStorage } from "@/liveblocks.config";
import { CursorsPresence } from "./cursor-presence";
import { connectionIdToColor, findIntersectingLayers, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds, RGBToHex } from "@/lib/utils";
import { toast } from "sonner";
import { nanoid } from 'nanoid';
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { useSelectedLayers } from "@/hooks/use-selected-layers";
import { SelectionTools } from "./selection-tools";
import { Path } from "./layers/path";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

interface CanvasProps {
    boardId: string;
};

const MAX_LAYERS = 100;

export const Canvas = ({ boardId } : CanvasProps) => {

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    });

    const rootLayerIds = useStorage((root) => root.layerIds);
    const pencilDraft = useSelf((me) => me.presence.pencilDraft);

    const [lastUsedColour, setLastUsedColour] = useState<Colour>({r: 255, g: 255, b: 255});

    const [camera, setCamera] = useState<Camera>({ x: 0 , y: 0 });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();
    useDisableScrollBounce();
    
    const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH, initialSelectedLayersData: Map<string, Layer>) => {
        history.pause();
        setCanvasState({mode: CanvasMode.Resizing, initialBounds, corner, initialSelectedLayersData});
    }, [history]);


    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x + e.deltaX,
            y: camera.y + e.deltaY
        }));
    }, []);

    const insertLayer = useMutation(({ storage, setMyPresence }, layerType: LayerType.Note | LayerType.Text | LayerType.Rectangle | LayerType.Ellipse, position: Point) => {
        const layers = storage.get("layers");

        if (layers.size >= MAX_LAYERS)
        {
            toast.info("The maximum layers you can place has been reached");
            return;
        }

        const newLayerId = nanoid();
        const newLayer = new LiveObject<Layer>({
            type: layerType,
            x: position.x,
            y: position.y,
            fill: lastUsedColour,
            width: 100,
            height: 100,
        } as Layer);

        const layerIds = storage.get("layerIds");
        layerIds.push(newLayerId);

        layers.set(newLayerId, newLayer);

        setMyPresence({ selection: [newLayerId]}, {addToHistory: true});
        setCanvasState({mode: CanvasMode.None});

    }, [lastUsedColour, canvasState]);

    const translateSelectedLayers = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode !== CanvasMode.Translating)
        {
            return;
        }

        const delta = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y
        };

        const layers = storage.get("layers");

        for (const id of self.presence.selection)
        {
            const layer = layers.get(id);

            if (layer)
            {
                layer.update({
                    x: layer.get("x") + delta.x,
                    y: layer.get("y") + delta.y
                });
            }
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point});

    }, [canvasState]);

    const resizeLayer = useMutation(({storage, self}, point: Point) => {
        if (canvasState.mode !== CanvasMode.Resizing)
        {
            return;
        }

        const { delta , result: bounds } = resizeBounds(canvasState.initialBounds, canvasState.corner, point);

        const liveLayers = storage.get("layers");
        const selectedIds = self.presence.selection;
        
        selectedIds.map((id) => {
            const layer = liveLayers.get(id);

            if (layer)
            {
                layer.update(
                    {
                        x: canvasState.initialSelectedLayersData.get(id)!.x + delta.x,
                        y: canvasState.initialSelectedLayersData.get(id)!.y + delta.y,
                        width: canvasState.initialSelectedLayersData.get(id)!.width + delta.width,
                        height: canvasState.initialSelectedLayersData.get(id)!.height + delta.height
                    }
                );
            }
        })

        // if (layer)
        // {
        //     // console.log(delta, bounds, {x: layer.get("x") + delta.x, y: layer.get("y") + delta.y, width: layer.get("width") + delta.width, height: layer.get("height") + delta.height});
        //     console.log(delta);
        //     // layer.update(bounds);
        // }

    }, [canvasState, resizeBounds]);

    const unSelectLayers = useMutation(({self, setMyPresence}) => {
        if (self.presence.selection.length > 0)
        {
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);

    const startDrawing = useMutation(({ setMyPresence }, point: Point, pressure: number) => {
        setMyPresence({ pencilDraft: [[point.x, point.y, pressure]], pencilColour: lastUsedColour})
    }, [lastUsedColour]);

    const continueDrawing = useMutation(({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
        const { pencilDraft } = self.presence;

        if (canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || pencilDraft == null)
        {
            return;
        }

        setMyPresence({
            cursor: point,
            pencilDraft: pencilDraft.length === 1 && pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y ? pencilDraft : [...pencilDraft, [point.x, point.y, e.pressure]],
        })
    }, [canvasState.mode]);

    const insertPath = useMutation(({ storage, self, setMyPresence }) => {
        const layers = storage.get("layers");
        const { pencilDraft } = self.presence;

        if (pencilDraft == null || pencilDraft.length < 2 || layers.size >= MAX_LAYERS)
        {
            setMyPresence({ pencilDraft: null});
            return;
        }


        const id = nanoid();

        layers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColour)));

        const layerIds = storage.get('layerIds');
        layerIds.push(id);

        setMyPresence({ pencilDraft: null });
        setCanvasState({mode: CanvasMode.Pencil});

    }, [lastUsedColour, setCanvasState]);

    const startMultiSelection = useCallback((current: Point, origin: Point) => {
        if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5)
        {
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current
            });
        }
    }, []);

    const updateSelectionNet = useMutation(({ storage, setMyPresence }, current: Point, origin: Point) => {
        const layers = storage.get('layers').toImmutable();

        setCanvasState({
            mode: CanvasMode.SelectionNet,
            origin,
            current,
        });

        const ids = findIntersectingLayers(rootLayerIds, layers, origin, current);

        setMyPresence({ selection: ids }, { addToHistory: true });
    }, [setCanvasState, rootLayerIds]);


    const changeCameraPosition = useCallback((origin: Point, current: Point) =>
    {
        setCamera((camera) => ({
            x: camera.x + (current.x - origin.x)*0.2,
            y: camera.y + (current.y - origin.y)*0.2
        }));

    }, [setCamera]);

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera);


        if (canvasState.mode === CanvasMode.Pressing && !e.ctrlKey)
        {
            startMultiSelection(current, canvasState.origin);
        }
        else if (canvasState.mode === CanvasMode.SelectionNet)
        {
            updateSelectionNet(current, canvasState.origin);
        } else if (canvasState.mode === CanvasMode.Translating)
        {
            translateSelectedLayers(current);
        } else if (canvasState.mode === CanvasMode.Resizing)
        {
            resizeLayer(current);
        } else if (canvasState.mode === CanvasMode.Pencil){
            continueDrawing(current, e);
        }else if (canvasState.mode === CanvasMode.Pressing && e.ctrlKey)
        {
            changeCameraPosition(canvasState.origin, current);
        }

        setMyPresence({ cursor: current});
    }, [canvasState, resizeLayer, translateSelectedLayers, camera, continueDrawing, startMultiSelection, changeCameraPosition, updateSelectionNet]);

    const onPointerLeave = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault();
        setMyPresence({ cursor: null });
    }, []);

    const onPointerUp = useMutation(({}, e: React.PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing)
        {

            unSelectLayers();

            setCanvasState({
                mode: CanvasMode.None,
            });

        } else if (canvasState.mode === CanvasMode.Pencil){
            insertPath();
        }else if (canvasState.mode === CanvasMode.Inserting)
        {
            insertLayer(canvasState.layerType, point);
        }else
        {
            setCanvasState({mode: CanvasMode.None});
        }

        history.resume();

    }, [camera, canvasState, history, insertLayer, unSelectLayers, insertPath, setCanvasState]);

    
    const onPointerDown = useCallback((event: React.PointerEvent) => {

        if (canvasState.mode === CanvasMode.Inserting)
        {
            return;
        }

        const current = pointerEventToCanvasPoint(event, camera);

        if (canvasState.mode === CanvasMode.Pencil)
        {
            startDrawing(current, event.pressure);
            return;
        }

        setCanvasState({mode: CanvasMode.Pressing, origin: current});
    }, [canvasState, setCanvasState, camera, startDrawing]);


    const selections = useOthersMapped((other) => other.presence.selection);

    const onLayerPointerDown = useMutation(({ self, setMyPresence }, event: React.PointerEvent, layerId: string) => {
        if (canvasState.mode === CanvasMode.Inserting || canvasState.mode === CanvasMode.Pencil) {
            return;
        }

        history.pause();
        event.stopPropagation();

        const point = pointerEventToCanvasPoint(event, camera);

        if (!self.presence.selection.includes(layerId))
        {
            let newSelectionArr = [layerId];

            if (event.ctrlKey)
            {
                newSelectionArr = [...self.presence.selection, layerId];
            }

            setMyPresence({ selection: newSelectionArr }, {addToHistory: true});
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point});

    }, [setCanvasState, camera, history, canvasState.mode]);

    const layerIdsToColourSelection = useMemo(() => {
        const layerIdsToColourSelection: Record<string, string> = {};

        for (const user of selections)
        {
            const [connectionId, selection] = user;

            for (const layerId of selection)
            {
                layerIdsToColourSelection[layerId] = connectionIdToColor(connectionId);
            }

        }

        return layerIdsToColourSelection;
    }, [selections]);

    const deleteLayers = useDeleteLayers();

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent)
        {
            switch (e.key){
                // case "Backspace": {
                //     if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.SelectionNet)
                //     {
                //         console.log(canvasState);
                //         deleteLayers();
                //     }

                //     break;
                // }

                case "z": {
                    if (e.ctrlKey || e.metaKey)
                    {
                        if (e.shiftKey)
                        {
                            history.redo();
                        }
                        else {
                            history.undo();
                        }
                    }
                    break;
                }

                default:
                    break;
            }
        }

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        }
    }, [canvasState, deleteLayers, history]);

    return (
        <main className="h-full w-full relative bg-neutral-100 touch touch-none overflow-hidden">
            <Info boardId={boardId} />
            <Participants/>
            <Toolbar canvasState={canvasState} setCanvasState={setCanvasState} canRedo={canRedo} canUndo={canUndo} undo={history.undo} redo={history.redo}/>
            <SelectionTools camera={camera} setLastUsedColour={setLastUsedColour}/>
            <svg className="h-[100vh] w-[100vw]" onWheel={onWheel} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} onPointerUp={onPointerUp} onPointerDown={onPointerDown}>
                <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)`}}>
                    { rootLayerIds.map((layerId) => <LayerPreview key={layerId} id={layerId} onLayerPointerDown={onLayerPointerDown} selectionColour={layerIdsToColourSelection[layerId]} />)}
                    <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown}/>
                    {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
                        <rect className="fill-blue-500/5 stroke-blue-500 stroke-1" x={Math.min(canvasState.origin.x, canvasState.current.x)} y={Math.min(canvasState.origin.y, 
                        canvasState.current.y)} width={Math.abs(canvasState.origin.x - canvasState.current.x)} height={Math.abs(canvasState.origin.y - canvasState.current.y)}/>
                    )}
                    <CursorsPresence/>
                    {
                        pencilDraft != null && pencilDraft.length > 0 && (
                            <Path points={pencilDraft} fill={RGBToHex(lastUsedColour)} x={0} y={0} />
                        )
                    }
                </g>
            </svg>
        </main>
    );
}

