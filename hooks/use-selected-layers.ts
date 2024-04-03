import { useSelf, useStorage } from "@/liveblocks.config"
import { Layer } from "@/types/canvas";

export const useSelectedLayers = (asArray = false) => {

    const selectedLayerIds = useSelf((me) => me.presence.selection);

    return useStorage((root) => {

        const layerIdMappings = new Map<string, Layer>();

        selectedLayerIds.map((id) => {
            const layer = root.layers.get(id)!;
            layerIdMappings.set(id, layer);
        });

        if (asArray)
        {
            return Array.from(layerIdMappings.values());
        }

        return layerIdMappings;
    });
}

