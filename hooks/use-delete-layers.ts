import { useMutation, useSelf } from "@/liveblocks.config";

export const useDeleteLayers = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useMutation(({ storage, setMyPresence }) => {
        const layers = storage.get("layers");
        const layerIds = storage.get("layerIds");

        for (const id of selection) {
            layers.delete(id);

            const index = layerIds.indexOf(id);

            if (index !== -1)
            {
                layerIds.delete(index);
            }
        }

        setMyPresence({ selection: [] }, {addToHistory: true});
    }, [selection]);
}