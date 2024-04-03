'use client';


import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "./user-avatar";
import { useOthers, useSelf } from "@/liveblocks.config";
import { connectionIdToColor } from "@/lib/utils";

const MAX_OTHER_USER_DISPLAY = 2;

export const Participants = () => {

    const users = useOthers();
    const currentUser = useSelf();

    const maxUserDisplayReached = users.length > MAX_OTHER_USER_DISPLAY;

    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
            <div className="flex gap-x-2">
                {
                    users.slice(0, MAX_OTHER_USER_DISPLAY).map(({connectionId, info}) => {
                        return (
                            <UserAvatar key={connectionId} name={info?.name} src={info?.picture} fallback={info?.name?.[0] || "A"} borderColor={connectionIdToColor(connectionId)}/>
                        );
                    })
                }

                { currentUser && (
                    <UserAvatar src={currentUser.info?.picture} name={`${currentUser.info?.name} (You)`} fallback={`${currentUser.info?.name?.[0]}`} borderColor={connectionIdToColor(currentUser.connectionId)}/>
                )}
                
                { maxUserDisplayReached && (
                    <UserAvatar name={`${users.length - MAX_OTHER_USER_DISPLAY} more`} fallback={`+${users.length - MAX_OTHER_USER_DISPLAY}`}/>
                )}
            </div>
        </div>
    );
}

export const ParticipantsSkeleton = () => {
    return (
        <div className="absolute h-12 top-2 right-2 rounded-md flex items-center shadow-md w-[100px]">
            <Skeleton className="h-full w-full bg-white"/>
        </div>
    );
}