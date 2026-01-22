import type { MouseEventHandler, ReactNode } from "react";
import RightArrow from "../assets/icons/RightArrow.svg?react";

interface PerfilButtonProps {
    icon: ReactNode,
    onClick: MouseEventHandler<HTMLButtonElement>,
    btnName: string
}

export default function PerfilButton({
    icon,
    onClick, 
    btnName
}: PerfilButtonProps){
    return (
        <button
            className="bg-violet-light text-[20px]/[24px] flex items-center justify-between max-w-95 w-[90%] h-11.25 border-2 px-2 py-4 rounded-2xl mb-4 mx-6"
            onClick={onClick}
        >
            <span className="flex gap-2 ml-4">
                {icon}
                <span className="w-40 text-left">{btnName}</span>
            </span>
            <RightArrow className="w-6 h-5 mr-3.5"/>
        </button>
    );
}
