'use client';

import { ClientSideSuspense } from "@liveblocks/react";

import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";

import { RoomProvider } from "@/liveblocks.config";
import { Layer } from "@/types/canvas";

interface RoomProps {
    children: React.ReactNode;
    roomId: string;
    fallback: NonNullable<React.ReactNode> | null;
};

export const Room = ({ children, roomId, fallback } : RoomProps ) => {

    const initialStorageObj = {
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList<string>()
    };

    return (
        <RoomProvider id={roomId} initialPresence={{ cursor: null, selection: [], pencilDraft: null, pencilColour: null }} initialStorage={initialStorageObj}>
            <ClientSideSuspense fallback={fallback}>
                { () => children }
            </ClientSideSuspense>
        </RoomProvider>
    );
};