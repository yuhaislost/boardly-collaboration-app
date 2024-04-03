"use client";

import { useRenameModal } from "@/store/use-rename-modal";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "@/components/ui/button";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
    title: z.string().max(60),
});

export const RenameModal = () => {
    const { isOpen, onClose, initialValues } = useRenameModal();

    const { mutate: updateBoard, pending } = useApiMutation({ mutationFunction: api.board.updateBoard, loadingMessage: 'Updating board...', successMessage: "Updated a board!", errorMessage: "Failed to update a board :("});

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "Untitled"
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>){
        let title = values.title.trim();

        if (title.length === 0)
        {
            title = "Untitled";
        }

        updateBoard({id: initialValues.id, title: title}).then(() => {
            onClose()
        });
    };


    return(
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit board title
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                        Spice up your board&apos;s title by entering a new name!
                </DialogDescription>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input disabled={pending} placeholder="Untitled" {...field} autoComplete="off"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant={'outline'}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={pending}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}