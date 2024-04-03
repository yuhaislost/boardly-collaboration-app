"use client";

import { DeleteModal } from "@/components/modals/board/delete-modal";
import { RenameModal } from "@/components/modals/board/rename-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted)
    {
        return null;
    }
    
    return(
        <>
            <RenameModal/>
            <DeleteModal/>
        </>
    )
}