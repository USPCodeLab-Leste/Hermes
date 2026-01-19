import type { MouseEventHandler, ReactNode } from "react";
import rightArrow from "../assets/icons/RightArrow.svg";

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
            className=""
            onClick={onClick}
        >
            {icon}
            <span>
                {btnName}
            </span>
            <img src={rightArrow} alt="" aria-hidden="true"/>
        </button>
    );
}
