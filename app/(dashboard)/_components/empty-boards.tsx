'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useRouter } from "next/navigation";

export const EmptyBoards = () => {
    const { organization } = useOrganization();
    const {mutate: createBoard, pending} = useApiMutation({ mutationFunction: api.board.create, loadingMessage: "Creating a board...", successMessage: "Successfully created a board!", errorMessage: "Oh no! Failed to create a board."});
    const router = useRouter();

    const onClick = () => {
        if (!organization) return;

        createBoard({ title: 'Untitled', orgId: organization.id}).then((id) => router.push(`/board/${id}`));
    }

    return (
        <div className="h-full flex flex-col justify-center items-center">
            <Image src={"/empty_boards.svg"} alt="Empty" width={120} height={120}/>
            <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
            <p className="text-muted-foreground text-sm mt-2">Explore the limitless potential with Boardly.</p>
            <div className="mt-6">
                <Button disabled={pending} size={'lg'} onClick={onClick}>Create board</Button>
            </div>
        </div>
    );
}