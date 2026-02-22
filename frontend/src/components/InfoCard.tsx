import { motion, type Variants } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

// Components
import { LazySvg } from './LazySvg';

// Types
import type { InfoCard as InfoCardType } from '../types/infos';

interface InfoCardProps {
  card: InfoCardType;
  variants?: Variants;
}

export const InfoCard = ({ card, variants }: InfoCardProps) => {
  const count = card.count ?? 0;
  const isDisabled = count <= 0;
  const { search } = useLocation();

  return (
    <motion.div
      variants={variants}
      whileHover={{y: -8}}
    >
      <Link
        className={`p-4 dark:bg-violet-light bg-violet-light/50 rounded-2xl aspect-square flex flex-col justify-between
                    items-baseline shadow-lg outline-2 outline-transparent transition-all
                    ${isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-2xl hover:dark:outline-paper focus:outline-paper'}`
                  }
        to={isDisabled ? '.' : { pathname: card.cardName, search }}
        aria-disabled={isDisabled}
        onClick={(event) => {
          if (isDisabled) {
            event.preventDefault();
          }
        }}
      >
        <div className='dark:bg-teal-mid bg-teal-light p-2 rounded-[10px] w-fit'>
          <LazySvg name={card.icon} className='size-7' />
        </div>
        <div className='w-full'>
          <h3 className='font-semibold text-lg text-left whitespace-nowrap text-ellipsis overflow-hidden'>{card.cardName}</h3>
          <span className='text-sm text-left dark:text-paper/75 text-ink/75 whitespace-nowrap text-ellipsis overflow-hidden'>
            {!isDisabled ? `${count} artigo${count !== 1 ? 's' : ''}` : 'Nenhum artigo'}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
