// Icons
import PenIcon from "../../assets/icons/pencil.svg?react";
import TrashIcon from "../../assets/icons/trash.svg?react";

interface AdminEditDeleteButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function AdminEditDeleteButtons({ onEdit, onDelete }: AdminEditDeleteButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <AdminActionButton
        label="Editar"
        Icon={PenIcon}
        onClick={onEdit}
        className="bg-teal-light/70 hover:bg-teal-light/80"
      />
      <AdminActionButton label="Excluir" Icon={TrashIcon} onClick={onDelete} />
    </div>
  );
}

const AdminActionButton = ({
  label,
  Icon,
  onClick,
  className,
}: {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  className?: string;
}) => (
  <button
    className={`px-3 py-1.5 rounded-md font-medium cursor-pointer flex justify-center items-center gap-1 text-sm
      hover:shadow-2xl hover:outline-paper focus:outline-paper
      outline-transparent transition-all ${className ?? "bg-red-500/70 hover:bg-red-500/80"}`}
    onClick={onClick}
  >
    <Icon className="size-4" />
    {label}
  </button>
);
