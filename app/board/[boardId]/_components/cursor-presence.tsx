'use client';

import { memo } from 'react';
import { useOthersConnectionIds, useOthersMapped } from '@/liveblocks.config';
import { Cursor } from './cursor';
import { shallow } from '@liveblocks/client';
import { Path } from './layers/path';
import { RGBToHex } from '@/lib/utils';

const Cursors = () => {
    const ids = useOthersConnectionIds();

    return (
        <>
            {
                ids.map((connectionId) => (
                    <Cursor key={connectionId} connectionId={connectionId}/>
                ))
            }
        </>
    );
}

const Drafts = () => {
    const others = useOthersMapped((other) => ({
        pencilDraft: other.presence.pencilDraft,
        pencilColour: other.presence.pencilColour,
    }), shallow);

    return (
        <>
            {others.map(([key, other]) => {
                if (other.pencilDraft)
                {
                    return (
                        <Path key={key} x={0} y={0} points={other.pencilDraft} fill={other.pencilColour ? RGBToHex(other.pencilColour) : "#000"}/>
                    );
                }

                return null;
            })}
        </>
    )
}

export const CursorsPresence = memo(() => {
    return (
        <>
            <Drafts/>
            <Cursors/>
        </>
    );
});

CursorsPresence.displayName = "CursorsPresence";