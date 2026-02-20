import { motion } from "framer-motion"
import Skeletons from "./Skeletons"

export const InfoCardSkeleton = () => {
  return (
    <motion.div
      className={`p-4 bg-violet-light/20 rounded-2xl aspect-square flex flex-col justify-between
                  items-baseline shadow-lg outline-2 outline-transparent transition-all`
                }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{}}
      aria-disabled={true}
    >
      <div className='shimmer p-2 rounded-[10px] w-fit'>
        <div className='size-7' />
      </div>
      <div className="w-full">
        <Skeletons className='font-semibold text-lg text-left whitespace-nowrap text-ellipsis overflow-hidden'>
          texto exemplo
        </Skeletons>
        <Skeletons className='w-fit text-sm text-left block'>
          1 artigo
        </Skeletons>
      </div>
    </motion.div>
  )
}
