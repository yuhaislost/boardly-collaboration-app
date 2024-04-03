"use client";

import { useDeleteModal } from "@/store/use-delete-modal";
import { ConfirmModal } from "@/components/confirm-mdoal";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

export const DeleteModal = () => {
    const { isOpen, onClose, initialValues } = useDeleteModal();
    const { mutate: deleteBoard, pending} = useApiMutation({ mutationFunction: api.board.deleteBoard, loadingMessage: "Deleting a board...", successMessage: "Deleted a board!", errorMessage: "Oh no. Failed to delete a board."});

    function onConfirm(){
        deleteBoard({boardId: initialValues.id});
    }

    return(
        <ConfirmModal header="Are you sure?" description="This will permanently delete the board and its contents." open={isOpen} onOpenChange={onClose} onConfirm={onConfirm} disabled={pending}/>
    );
}