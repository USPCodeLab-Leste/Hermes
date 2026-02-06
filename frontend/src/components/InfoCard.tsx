import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

// Components
import { LazySvg } from './LazySvg';

// Types
import type { InfoCard as InfoCardType } from '../types/infos';

interface InfoCardProps {
  card: InfoCardType;
  count?: number;
  variants?: Variants;
}

export const InfoCard = ({ card, count, variants }: InfoCardProps) => {
  const isDisabled = typeof count !== 'number' || count <= 0;

  return (
    <motion.div
      variants={variants}
    >
      <Link
        className={`p-4 bg-violet-light rounded-2xl aspect-square flex flex-col justify-between
                    items-baseline shadow-lg outline-2 outline-transparent transition-all
                    ${isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:outline-paper focus:outline-paper'}`
                  }
        to={isDisabled ? '.' : card.card}
        aria-disabled={isDisabled}
        onClick={(event) => {
          if (isDisabled) {
            event.preventDefault();
          }
        }}
      >
        <div className='bg-teal-mid p-2 rounded-[10px] w-fit'>
          <LazySvg name={card.icon} className='size-7 text-paper' />
        </div>
        <div className='w-full'>
          <h3 className='font-semibold text-lg text-left text-paper whitespace-nowrap text-ellipsis overflow-hidden'>{card.card}</h3>
          <span className='text-sm text-left text-paper/75 whitespace-nowrap text-ellipsis overflow-hidden'>
            {!isDisabled ? `${count} artigo${count !== 1 ? 's' : ''}` : 'Nenhum artigo'}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
