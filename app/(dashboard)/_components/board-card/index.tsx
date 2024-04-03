"use client";

import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { favourite } from "@/convex/board";

interface BoardCardProps {
    id: string;
    title: string;
    authorName: string;
    authorId: string;
    imageUrl: string;
    createdAt: number;
    orgId: string;
    isFavourite: boolean;
};

export const BoardCard = ({id, title, authorName, authorId, imageUrl, createdAt, orgId, isFavourite} : BoardCardProps) => {
    const { userId } = useAuth();

    const authorLabel = userId === authorId ? 'You' : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true
    });

    const { mutate: favouriteBoard, pending: favouritePending } = useApiMutation({ mutationFunction: api.board.favourite, loadingMessage: "Favouriting a board...", successMessage: "Successfully favourited a board!", errorMessage: "Failed to favourite a board."});
    const { mutate: unfavouriteBoard, pending: unfavouritePending } = useApiMutation({ mutationFunction: api.board.unFavourite, loadingMessage: "Unfavouriting a board...", successMessage: "Successfully unfavourited a board!", errorMessage: "An error occured while favouriting the board."});

    const toggleFavourite = () => {
        if (isFavourite)
        {
            unfavouriteBoard({ id: id });
        } else {
            favouriteBoard({ id: id, orgId: orgId });
        }
    }

    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 ">
                    <Image src={imageUrl} alt={title} fill className={'object-fit'}/>
                    <Overlay/>
                    <Actions id={id} title={title} side={'right'}>
                        <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition px-3 py-2 outline-none duration-500">
                            <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity duration-300"/>
                        </button>
                    </Actions>
                </div>
                <Footer isFavourite={isFavourite} title={title} authorLabel={authorLabel} createdAtLabel={createdAtLabel} onClick={toggleFavourite} disabled={favouritePending || unfavouritePending}/>
            </div>
        </Link>
    );
}

BoardCard.Skeleton = function BoardCardSkeleton()
{
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full"/>
        </div>
    );
}