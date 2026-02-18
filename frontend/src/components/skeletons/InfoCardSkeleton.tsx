import { motion } from "framer-motion"

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
      <div className="w-fit">
        <h3 className='w-fit font-semibold text-lg text-left text-transparent shimmer px-2 block rounded-xl'>
          texto exemplo
        </h3>
        <span className='w-fit text-sm text-left text-transparent/75 shimmer px-2 block rounded-xl'>
          texto
        </span>
      </div>
    </motion.div>
  )
}
