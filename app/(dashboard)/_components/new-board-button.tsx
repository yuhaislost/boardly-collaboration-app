"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface NeweBoardButtonProps{
    orgId: string;
    disabled?: boolean;
};

export const NewBoardButton = ({ orgId, disabled } : NeweBoardButtonProps) => {

    const { mutate: createBoard, pending} = useApiMutation({mutationFunction: api.board.create, loadingMessage: "Creating a board...", successMessage: "Successfully created a board!", errorMessage: "Oh no :( failed to created a board."});
    const router = useRouter();

    const onClick = () => {
        createBoard({
            orgId: orgId,
            title: "Untitled",
        }).then((id) => router.push(`/board/${id}`));
    };

    return (
        <button disabled={disabled || pending} onClick={onClick} className={cn("col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6 transition duration-500",
        (disabled || pending) && "opacity-75 hover:bg-blue-600 cursor-not-allowed")}>
            <div/>
            <Plus className="h-12 w-12 text-white stroke-1"/>
            <p className="text-xs text-white font-light">
                New board
            </p>
        </button>
    );
}