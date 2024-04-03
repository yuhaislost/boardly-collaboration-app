import Image from 'next/image';
import { motion } from 'framer-motion';

export const Loading = () => {
    return (
        <div className='h-full w-full flex flex-col justify-center items-center'>
            <Image src={'/LOGO_BLACK_BG.svg'} alt='Logo' width={120} height={120} className='animate-pulse duration-1000'/>
        </div>
    );
}