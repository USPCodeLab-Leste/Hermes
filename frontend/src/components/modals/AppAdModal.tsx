import { GenericButton } from "../GenericButton";
import { ModalWrapper } from "./Modal";
import { useCallback } from "react";

// Icons
import AndroidIcon from "../../assets/icons/android.svg?react"
import ArrowRightIcon from "../../assets/icons/right-arrow.svg?react"

// Images
import AppAdImage from "../../assets/app_ad.png"
import { toast } from "react-toastify";

interface AppAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LINK = "https://github.com/USPCodeLab-Leste/Hermes/releases/download/v1.0/portal-hermes-android-v1.0.apk"

export function AppAdModal({ isOpen, onClose }: AppAdModalProps) {
  const handleClose = useCallback(() => {
    localStorage.setItem("hasSeenAppAd", "true");
    onClose();
  }, [])

  const handleLink = useCallback(() => {
    toast.info("O download do APK começará em breve. Se não iniciar, por favor, tente novamente.");
  }, [])

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="flex flex-col gap-4">
      <div className="-mx-6 -mt-12 -mb-4 overflow-hidden">
        <img 
          src={AppAdImage} 
          alt="App Advertisement" 
          className="w-full max-w-none block"
        />
      </div>
        <GenericButton
          onClick={handleLink}
          className="bg-teal-light hover:bg-teal-light/80 transition-colors"
        >
          <div className="grid grid-cols-[auto_1fr_auto] gap-2">
            <a 
              href={LINK}
              className="col-start-2 flex flex-row items-center justify-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Baixar o aplicativo para Android"
            >
              <AndroidIcon className="size-5"/>
              <span>Baixar APK (Android)</span>
            </a>
            <ArrowRightIcon className="size-5 self-center justify-self-end"/>
          </div>
        </GenericButton>
        <GenericButton
          onClick={handleClose}
          className="bg-violet-light hover:bg-violet-light/80 transition-colors"
        >
          Continuar no Navegador
        </GenericButton>
        <div className="relative w-full flex justify-center items-center">
          <hr className="border-paper border absolute left-0 right-0 top-1/2 z-1 rounded-full"/>
          <span className="text-xs text-center bg-violet-mid inline-block mx-auto z-2 px-2">Em breve na Google Play</span>
        </div>
      </div>
    </ModalWrapper>
  )
}