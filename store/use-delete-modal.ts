import { create } from 'zustand';

const defaultValues = {id: ""};

interface IDeleteModal {
    isOpen: boolean;
    initialValues: typeof defaultValues;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteModal = create<IDeleteModal>((set) => ({
    isOpen: false,
    onOpen: (id) => set({
        isOpen: true,
        initialValues: {id: id}
    }),
    initialValues: defaultValues,
    onClose: () => set({
        isOpen: false,
        initialValues: defaultValues
    }),
}));

