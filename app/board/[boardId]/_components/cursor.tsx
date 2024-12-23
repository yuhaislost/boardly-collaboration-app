'use client';

import { connectionIdToColor } from '@/lib/utils';
import { useOther } from '@/liveblocks.config';
import { MousePointer2 } from 'lucide-react';
import { memo } from 'react';

interface CursorProps{
    connectionId: number;
};

export const Cursor = memo(({connectionId} : CursorProps) => {
    const info = useOther(connectionId, (user) => user?.info);
    const cursor = useOther(connectionId, (user) => user.presence.cursor);

    const userName = info?.name || "Anonymous";

    if (!cursor) {
        return null;
    }

    const { x, y } = cursor;

    return (
        <foreignObject style={{
            transform: `translateX(${x}px) translateY(${y}px)`
        }} height={50} width={userName?.length * 10 + 24} className='relative drop-shadow-md'>
            <MousePointer2 className='h-5 w-5' style={{ fill: connectionIdToColor(connectionId), color: connectionIdToColor(connectionId)}}/>
            <div className='absolute text-xs font-semibold flex justify-center items-center text-white rounded-lg py-1 px-1.5 left-3.5' style={{backgroundColor: connectionIdToColor(connectionId)}}>
                { userName }
            </div>
        </foreignObject>
    );
});

Cursor.displayName = 'Cursor'