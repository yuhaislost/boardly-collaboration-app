'use client';

import { RGBToHex } from "@/lib/utils";
import { Colour } from "@/types/canvas";

interface ColourButtonProps {
    onClick: (colour: Colour) => void;
    colour: Colour;
};

export const ColourButton = ({ onClick, colour } : ColourButtonProps) => {
    return (
        <button className="w-8 h-8 items-center justify-center hover:opacity-75 transition" onClick={() => onClick(colour)}>
            <div className="h-8 w-8 rounded-md border border-neutral-300" style={{ background: RGBToHex(colour)}}/>
        </button>
    );
}