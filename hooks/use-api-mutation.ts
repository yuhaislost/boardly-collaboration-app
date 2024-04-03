import { useState } from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

interface useApiMutationProps{
    mutationFunction: any;
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
};

export const useApiMutation = ({ mutationFunction, loadingMessage, successMessage, errorMessage } : useApiMutationProps) => {
    const [pending, setPending] = useState(false);
    const apiMutation = useMutation(mutationFunction);

    const mutate = (payload: any) => {
        setPending(true);
        let promise = apiMutation(payload);
        const id = toast.loading(loadingMessage);
        return promise.then((data) => {
            toast.success(successMessage, {id});
            return data;
        }).finally(()=>{
            setPending(false);
        }).catch((error) => {
            toast.error(errorMessage, {id});
            throw new Error(error);
        });
    }

    return {
        mutate, pending
    };
}