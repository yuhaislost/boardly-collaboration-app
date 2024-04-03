'use client';

import { Poppins } from 'next/font/google';
import { useQuery } from "convex/react";
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';


import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Hint } from '@/components/hint';
import { useRenameModal } from '@/store/use-rename-modal';
import { Actions } from '@/components/actions';

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
});

interface InfoProps {
    boardId: string;
};

const TabSeparator = () => {
    return (
        <div className='text-neutral-300 px-1.5'>
            |
        </div>
    );
}

export const Info = ({ boardId } : InfoProps) => {

    const data = useQuery(api.board.get, {
        id: boardId as Id<"boards">,
    });

    const { onOpen } = useRenameModal();

    if (!data) return <InfoSkeleton/>;

    return (
        <div className='absolute top-2 left-2 bg-white rounded-md px-2 h-12 flex items-center shadow-md'>
            <Hint label='Go to boards' side='bottom' sideOffset={10}>
                <Button className='px-2' variant={'none'} asChild>
                    <Link href={'/'}>
                        <Image src={'/LOGO_BLACK_BG.svg'} alt='Boardly Logo' height={30} width={30}/>
                        <span className={cn("font-semibold text-lg ml-2 text-black", font.className)}>Boardly</span>
                    </Link>
                </Button>
            </Hint>
            <TabSeparator/>
            <Hint label='Rename' side='bottom' sideOffset={10}>
                <Button className='text-base font-normal px-2' onClick={() => onOpen(data._id, data.title)} variant={'board'}>
                    { data.title }
                </Button>
            </Hint>
            <TabSeparator/>
            <Actions id={data._id} title={data.title} side='bottom' sideOffset={10}>
                <div>
                    <Hint label='Main menu' side='bottom' sideOffset={10}>
                        <Button size={'icon'} variant={'board'}>
                            <Menu/>
                        </Button>
                    </Hint>
                </div>
            </Actions>
        </div>
    );
}

export const InfoSkeleton = () => {
    return (
        <div className='absolute top-2 left-2 rounded-md h-12 flex items-center shadow-md w-[300px]'>
            <Skeleton className="h-full w-full bg-white"/>
        </div>
    );
};