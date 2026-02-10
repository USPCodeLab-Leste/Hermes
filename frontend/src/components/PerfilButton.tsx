import type { MouseEventHandler, ReactNode } from "react";
import RightArrow from "../assets/icons/RightArrow.svg?react";
import { motion, type Variants } from "framer-motion";

interface PerfilButtonProps {
    icon: ReactNode,
    onClick: MouseEventHandler<HTMLButtonElement>,
    btnName: string,
    variants?: Variants
}

export default function PerfilButton({
    icon,
    onClick, 
    btnName,
    variants
}: PerfilButtonProps){
    return (
        <motion.button
            className="bg-violet-light cursor-pointer text-[20px]/[24px] flex items-center justify-between gap-2 md:max-w-95 w-full h-11.25 border-2 px-2 py-4 
                         rounded-2xl transition-colors duration-200 ease-in hover:bg-violet-mid/50 focus:bg-violet-mid/50 outline-none group"
            onClick={onClick}
            variants={variants}
        >
            {icon}
            <span className="inline-block text-left whitespace-nowrap text-ellipsis overflow-hidden flex-1">{btnName}</span>
            <RightArrow className="w-6 h-5 transition-transform duration-200 ease-in-out group-hover:rotate-90"/>
        </motion.button>
    );
}
