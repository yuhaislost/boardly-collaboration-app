"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "./confirm-mdoal";
import { Button } from "./ui/button";
import { useRenameModal } from "@/store/use-rename-modal";
import { useDeleteModal } from "@/store/use-delete-modal";

interface ActionProps{
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
};

export const Actions = ({ children, side, sideOffset, id, title} : ActionProps) => {

    const { onOpen: onOpenRename } = useRenameModal();
    const { onOpen: onOpenDelete } = useDeleteModal();

    const onCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/board/${id}`).then(() => {
            toast.success("Copied link!");
        }).catch((error) => {
            toast.error("Failed to copy link :(")
        })
    };



    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                { children }
            </DropdownMenuTrigger>
            <DropdownMenuContent side={side} sideOffset={sideOffset} onClick={(e) => {e.stopPropagation();}} className="w-60">
                <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
                    <Link2 className="h-3 w-3 mr-2"/>
                    Copy link
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => onOpenRename(id, title)}>
                    <Pencil className="h-3 w-3 mr-2"/>
                    Rename
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => onOpenDelete(id)}>
                    <Trash2 className="h-3 w-3 mr-2"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}