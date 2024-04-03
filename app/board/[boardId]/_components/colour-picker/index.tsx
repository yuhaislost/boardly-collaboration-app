'use client';

import { Colour } from "@/types/canvas";
import { ColourButton } from "./colour-button";

interface ColourPickerProps {
    onChange: (colour: Colour) => void;
}

export const ColourPicker = ({ onChange } : ColourPickerProps) => {
    return (
        <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
            <ColourButton onClick={onChange} colour={{r: 0, g: 0, b: 0}}/>
            <ColourButton onClick={onChange} colour={{r: 255, g: 255, b: 255}}/>
            <ColourButton onClick={onChange} colour={{r:19, g:15, b:64}}/>
            <ColourButton onClick={onChange} colour={{r:255, g:121, b:121}}/>
            <ColourButton onClick={onChange} colour={{r:255, g:190, b:118}}/>
            <ColourButton onClick={onChange} colour={{r:240, g:147, b:43}}/>
            <ColourButton onClick={onChange} colour={{r:106, g:176, b:76}}/>
            <ColourButton onClick={onChange} colour={{r:186, g:220, b:88}}/>
            <ColourButton onClick={onChange} colour={{r:72, g:52, b:212}}/>
            <ColourButton onClick={onChange} colour={{r:190, g:46, b:221}}/>
        </div>
    );
};