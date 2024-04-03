"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface ConfirmModalProps{
    children?: React.ReactNode;
    onConfirm: () => void;
    disabled?: boolean;
    header: string;
    description?: string;
    open?: boolean;
    onOpenChange?: () => void;
};

export const ConfirmModal = ({ children, onConfirm, disabled, header, description, open, onOpenChange }: ConfirmModalProps) => {

    const handleConfirm = () => {
        onConfirm();
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {/* { children && (
            <AlertDialogTrigger asChild>
                { children }
            </AlertDialogTrigger>
            )} */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        { header }
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        { description }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={disabled} onClick={handleConfirm}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}