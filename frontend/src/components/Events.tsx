import { useCallback, useMemo, useState, memo } from "react"
import { motion, stagger, type Variants } from "framer-motion"

// Icons
import PlusIcon from "../assets/icons/plus.svg?react"
import CheckIcon from "../assets/icons/check.svg?react"

// Types
import type { Event } from "../types/events"
import type { GenericTag, EventTagType, InfoTagType, TagType } from "../types/tag"

// Components
import { DateWrapper } from "./Date"

interface EventCardProps {
  event: Event;
  selectEvent: (id: string) => void;
  variants?: Variants;
}

const defaultVariants: Variants = {
  hidden: {},
  visible: {},
}

export function EventCard({ event, selectEvent, variants }: EventCardProps) {
  const [isReady, setIsReady] = useState(false)

  return (  
    <motion.button
      variants={variants ?? defaultVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{amount: 0.4, once: true}}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 18,
        duration: 0.5,
        delayChildren: 0.2,
      }}
      className={`aspect-5/3 w-full max-w-120 overflow-hidden bg-violet-dark rounded-xl flex flex-col bg-cover bg-no-repeat 
                 bg-center justify-between cursor-pointer hover:-translate-y-2 shadow-lg hover:shadow-2xl 
                 outline-2 hover:outline-paper focus:outline-paper outline-transparent ${isReady ? 'transition-all' : ''}`}
      style={{ backgroundImage: `url('${event.img_banner}')` }}
      onClick={() => selectEvent(event.id)}
      onAnimationComplete={() => setIsReady(true)}
      aria-label={`Selecionar evento ${event.title}`}
      // role="button"
    >
      <Tags tags={event.tags} className="p-4" />
      <div className="self-end w-full p-4 flex flex-col items-start backdrop-blur-sm from-violet-light/30 to-violet-mid bg-linear-to-b">
        <h2 className="font-bold text-[18px] md:text-xl text-paper">{event.title}</h2>
        <DateWrapper start={event.data_inicio} end={event.data_fim} textClass="text-paper/75" />
      </div>
    </motion.button>
  )
}

const tagsVariants: Variants = {
  visible: {
    transition: {
      delayChildren: stagger(0.1),
    }
  }
}

const tagVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

interface TagsProps {
  tags: GenericTag[];
  className?: string;
  canSelect?: boolean;
  activeTags?: Record<TagType, string[]>;
  onClick?: (tag: GenericTag) => void;
}

export function Tags({ tags, className, canSelect, activeTags, onClick }: TagsProps) {
  const isActive = useCallback((tag: GenericTag) => {
    if (!activeTags) return false;

    const tagType = tag.type;
    const activeTagNames = activeTags[tagType] || [];
    return activeTagNames.includes(tag.name!);
  }, [activeTags]);

  return (
    <motion.div 
      className={`flex flex-row gap-2 flex-wrap ${className}`}
      variants={tagsVariants}
    >
      {tags.map((tag, index) => (
        <Tag key={index} tag={tag} canSelect={canSelect} active={isActive(tag)} onClick={onClick} />
      ))}
    </motion.div>
  )
}

interface TagProps {
  tag: GenericTag;
  canSelect?: boolean;
  active?: boolean;
  onClick?: (tag: GenericTag) => void;
}

export const Tag = memo(function Tag({ tag, canSelect, onClick, active }: TagProps) {
  const handleClick = useCallback(() => {
    if (canSelect) {
      onClick && onClick(tag)
    }
  }, [canSelect, onClick, tag])

  const Component = useMemo(() => canSelect ? motion.button : motion.div, [canSelect]);

  return (
    <Component
      className={`px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm font-medium text-paper transition-colors
                 inline-flex items-center justify-center gap-1 min-w-12 shadow-md shadow-black/20
                 ${active ? 'bg-violet-dark' : 'bg-teal-light '}
                 ${canSelect ? 'cursor-pointer' : 'cursor-default'}
                `}
      variants={tagVariants}
      onClick={handleClick}
      aria-pressed={canSelect ? active : undefined}
      disabled={canSelect ? false : undefined}
    >
      {canSelect && (
        <>
          {!active ? (
            <PlusIcon className="size-4 text-paper" />

          ) : (
            <CheckIcon className="size-4 text-paper" />
          )}
        </>
      )}
      <span className="text-paper">{tag.name!}</span>
    </Component>
  )
}, (prevProps, nextProps) => {
  return prevProps.active === nextProps.active && prevProps.tag.id === nextProps.tag.id;
})