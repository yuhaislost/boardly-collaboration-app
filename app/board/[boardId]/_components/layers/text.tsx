import { cn, RGBToHex } from '@/lib/utils';
import { TextLayer } from '@/types/canvas';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { Fira_Sans } from 'next/font/google';
import { useMutation } from '@/liveblocks.config';

const font = Fira_Sans({
    subsets: ['latin'],
    weight: ['400']
});

interface TextProps {
    id: string;
    layer: TextLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColour?: string;
};

const calculateFontSize = (width: number, height: number) => {
    const maxFontSize = 96;
    const scaleFactor = 0.5;
    const fontSizeBasedonHeight = height * scaleFactor;
    const fontSizeBasedonWidth = width * scaleFactor;

    return Math.min(fontSizeBasedonHeight, fontSizeBasedonWidth, maxFontSize);

}

export const Text = ({ layer, onPointerDown, id, selectionColour } : TextProps) => {

    const { x, y, width, height, fill, value } = layer;

    const updateValue = useMutation(({ storage }, newValue: string) => {
        const layers = storage.get('layers');
        layers.get(id)?.set("value", newValue);
    }, []);

    const handleContentChange = (event: ContentEditableEvent) => {
        updateValue(event.target.value);
    }

    return (
        <foreignObject x={x} y={y} width={width} height={height} onPointerDown={(e) => onPointerDown(e, id)} style={{
            outline: selectionColour ? `1px solid ${selectionColour}` : "none"
        }}>
            <ContentEditable html={value || ""} onChange={handleContentChange} className={cn("h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none", font.className)} style={{
                color: fill ? RGBToHex(fill) : "#000",
                fontSize: calculateFontSize(width, height),
            }} autoCorrect='false' spellCheck="false"/>
        </foreignObject>
    );
}
