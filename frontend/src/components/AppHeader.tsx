import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { useLayoutEffect, useState } from "react";
import NotificationButton from "./NotificationButton";
import ProfilePic from "./ProfilePic";

export default function AppHeader({ children }: { children?: React.ReactNode }) {
  const campus = "EACH";
  
  const [measureRef, bounds] = useMeasure();
  const [height, setHeight] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    if (bounds.height > 0) {
      setHeight(bounds.height);
    }
  }, [bounds.height, children]);

  return (
    <motion.header
      className="bg-violet-dark rounded-b-2xl w-full overflow-hidden"
      initial={{ height: "auto" }}
      animate={{ height }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 35
      }}
    >
      <div className="py-7 m-auto flex flex-col justify-between items-center w-95/100 max-w-2xl gap-4 px-4" ref={measureRef}>
        <div className="flex justify-between items-center w-full gap-4">
          <div className="flex items-center gap-4">
            <ProfilePic />
            <div className="flex flex-col">
              <h2 className="text-paper text-[120%] font-bold leading-[120%]">
                Hermes na
              </h2>
              <h3 className="text-paper">{campus}</h3>
            </div>
          </div>
          <NotificationButton />
        </div>

        {children}
      </div>
    </motion.header>
  );
}
