import { shallow } from "@liveblocks/react";

import { Layer, XYWH } from '@/types/canvas';
import { useStorage, useSelf } from '@/liveblocks.config';

const boundingBox = (layers: Layer[]): XYWH | null => {
    const first = layers[0];

    if (!first)
    {
        return null;
    }

    let left = first.x;
    let right = first.x + first.width;
    let top = first.y;
    let bottom = first.y + first.height;

    for (let i = 1; i < layers.length; i++)
    {
        const bLeft = layers[i].x;
        const bRight = layers[i].x + layers[i].width;
        const bTop = layers[i].y;
        const bBottom = layers[i].y + layers[i].height;

        if (bLeft < left)
        {
            left = bLeft;
        }

        if (bRight > right)
        {
            right = bRight;
        }

        if (bTop < top)
        {
            top = bTop;
        }

        if (bBottom > bottom)
        {
            bottom = bBottom;
        }
    }

    return {x: left, y: top, width: right - left, height: bottom - top } as XYWH;
}

export const useSelectionBounds = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useStorage((root) => {
        const layers = selection.map((layerId) => root.layers.get(layerId)!).filter(Boolean);

        return boundingBox(layers);
    }, shallow);
}