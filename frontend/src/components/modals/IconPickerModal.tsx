import { useCallback, useMemo } from "react";
import { LazySvg } from "../LazySvg";
import { ModalWrapper } from "./Modal";
import { toast } from "react-toastify";

export type IconOption = {
  name: string;
  label: string;
};

// Importa dinamicamente os ícones SVG do diretório e cria as opções para o seletor de ícones
const iconModules = import.meta.glob("../../assets/icons/*.svg");

// Gera as opções de ícones a partir dos arquivos SVG importados
export const ICON_OPTIONS: IconOption[] = Object.keys(iconModules)
  .map((path) => {
    const fileName = path.split("/").pop() ?? path; // pega o nome do arquivo
    const name = fileName.replace(/\.svg$/i, ""); // remove a extensão .svg

    return {
      name,
      label: name.split(/[-_]+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "), // converte para "Title Case"
    } satisfies IconOption;
  })
  .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

export function getIconOptionByName(name: string): IconOption | undefined {
  return ICON_OPTIONS.find((opt) => opt.name === name);
}

export function getDefaultIconOption(): IconOption {
  return getIconOptionByName("unknown") ?? ICON_OPTIONS[0];
}

export function IconPickerModal({
  isOpen,
  onClose,
  selectedIconName,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedIconName?: string;
  onSelect: (option: IconOption) => void;
}) {
  // Memoiza o ícone selecionado com base no nome para evitar buscas desnecessárias
  const selected = useMemo(() => {
    return selectedIconName
      ? getIconOptionByName(selectedIconName)
      : undefined;
  }, [selectedIconName]);

  const handleSelectIcon = useCallback((option: IconOption) => {
    onSelect(option);
    toast.success(`Ícone "${option.label}" selecionado com sucesso!`);
    onClose();
  }, [onClose, onSelect]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-ink dark:text-paper">
            Selecione um Ícone
          </h2>
          <p className="text-ink/70 dark:text-paper/70 text-sm">
            Clique em um ícone para usar no card de informação.
          </p>
        </header>

        <section className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-3 overflow-auto p-2">
          {ICON_OPTIONS.map((option) => {
            const isActive = selected?.name === option.name;

            return (
              <button
                key={`create-info-icon-option-${option.name}`}
                type="button"
                onClick={() => handleSelectIcon(option)}
                className={`p-2 rounded-xl flex items-center justify-center
                  transition-all aspect-square cursor-pointer
                  ${
                    isActive
                      ? "bg-teal-mid shadow-lg"
                      : "bg-violet-dark hover:shadow-lg hover:bg-violet-light"
                  }
                `}
                title={option.label}
                aria-label={option.label}
                aria-pressed={isActive}
              >
                <LazySvg name={option.name} className="size-9/10 text-paper" aria-hidden="true" />
                <span className="sr-only">{option.label}</span>
              </button>
            );
          })}
        </section>
      </div>
    </ModalWrapper>
  );
}
