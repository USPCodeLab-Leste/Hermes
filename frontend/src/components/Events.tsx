import { useCallback, useState, memo } from "react"
import { AnimatePresence, motion, stagger, type Variants } from "framer-motion"

// Icons
import PlusIcon from "../assets/icons/plus.svg?react"
import CheckIcon from "../assets/icons/check.svg?react"
import XIcon from "../assets/icons/close.svg?react";

// Types
import type { Event } from "../types/events"
import type { ActiveTags, GenericTag } from "../types/tag"

// Components
import { DateWrapper } from "./Date"
import { useUserMotionPreference } from "../hooks/useUserMotionPreference";

interface EventsProps {
  variants?: Variants;
  event: Event;
  selectEvent: (id: string) => void;
  isFetching?: boolean;
}

const defaultEventVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.85 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export function EventCard({ event, selectEvent, variants, isFetching }: EventsProps) {
  return (
    <div className={`w-full flex justify-center items-center ${isFetching ? 'pointer-events-none opacity-50' : ''}`}>
      <EventCardContent variants={variants} event={event} selectEvent={selectEvent} />
    </div>
  )
}

const EventCardContent = ({variants, event, selectEvent}: EventsProps) => {
  const [isReady, setIsReady] = useState(false)
  const { isReducedMotion } = useUserMotionPreference()

  return (
      <motion.button
        variants={variants ?? defaultEventVariants}
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
        className={`aspect-video w-full max-w-120 overflow-hidden bg-violet-dark rounded-xl flex flex-col bg-cover bg-no-repeat 
                  bg-center justify-between cursor-pointer shadow-lg hover:shadow-2xl 
                  outline-2 hover:outline-paper focus:outline-paper outline-transparent ${isReady && !isReducedMotion ? 'transition-all' : ''}`}
        style={{ backgroundImage: `url('${event.img_banner}')` }}
        whileHover={{y: -8}}
        onClick={() => selectEvent(event.id)}
        onAnimationComplete={() => setIsReady(true)}
        aria-label={`Selecionar evento ${event.title}`}
      >
        <Tags tags={event.tags} className="p-4" />
        <div className="self-end w-full p-4 flex flex-col items-start backdrop-blur-sm from-violet-light/30 to-violet-mid bg-linear-to-b">
          <h2 className="w-full font-bold text-[18px] md:text-xl text-paper text-left whitespace-nowrap text-ellipsis overflow-hidden">{event.title}</h2>
          <DateWrapper start={event.data_inicio} end={event.data_fim} textClass="text-paper/75" />
        </div>
      </motion.button>
  )
}

const tagsVariants: Variants = {
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.1),
    }
  },
  hidden: {
    opacity: 0,
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
}

// Tags para exibição simples, sem interação
export function Tags({ tags, className }: TagsProps) {
  return (
    <motion.div 
      className={`flex flex-row gap-2 md:flex-wrap overflow-hidden ${className}`}
      variants={tagsVariants}
    >
      {tags.map((tag, index) => (
        <Tag key={index} tag={tag} />
      ))}
    </motion.div>
  )
}

interface SelectTagsProps {
  tags: GenericTag[];
  className?: string;
  canSelect?: boolean;
  activeTags: ActiveTags;
  onClick: (tag: GenericTag) => void;
}

// Tags para seleção, usadas no filtro
export function SelectTags({ tags, className, activeTags, onClick }: SelectTagsProps) {
  return (
    <motion.div 
      className={`flex flex-row gap-2 flex-wrap ${className}`}
      variants={tagsVariants}
    >
      {tags.map((tag, index) => (
        <SelectTag key={index} tag={tag} active={!!activeTags[tag.id]} onClick={onClick} />
      ))}
    </motion.div>
  )
}

interface RemoveFilterTagsProps {
  tags: GenericTag[];
  className?: string;
  onClick: (tag: GenericTag) => void;
}


export function RemoveFilterTags({ tags, className, onClick }: RemoveFilterTagsProps) {
  return (
    
    <motion.div 
      className={`flex flex-row gap-2 flex-wrap ${className}`}
      variants={tagsVariants}
      initial="hidden"
      animate={tags.length > 0 ? 'visible' : 'hidden'}
      exit="hidden"
      layout
    >
      <AnimatePresence mode="popLayout">
        {tags.map(tag => (
          <RemoveFilterTag key={tag.id} tag={tag} onClick={onClick}  />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

// Tag para exibição simples, sem interação
export const Tag = ({ tag }: { tag: GenericTag }) => {
  return (
    <TagWrapper 
      canSelect={false}
      variants={tagVariants}
    >
     <span className="text-paper">{tag.name}</span>
    </TagWrapper>
  )
}
interface SelectTagProps {
  tag: GenericTag;
  canSelect?: boolean;
  active?: boolean;
  onClick: (tag: GenericTag) => void;
}

// Tag para seleção, usada no filtro
export const SelectTag = memo(function Tag({ tag, onClick, active }: SelectTagProps) {
  const handleClick = useCallback(() => {
    onClick(tag)
  }, [onClick, tag])


  return (
    <TagWrapper 
      canSelect={true}
      className={`${active ? 'bg-violet-dark' : 'bg-teal-light'}`}
      variants={tagVariants}
      onClick={handleClick}
      aria-pressed={active}
      disabled={false}
    >
      {!active ? (
        <PlusIcon className="size-4 text-paper" />

      ) : (
        <CheckIcon className="size-4 text-paper" />
      )}
      <span className="text-paper">{tag.name}</span>
    </TagWrapper>
  )
}, (prevProps, nextProps) => {
  return prevProps.active === nextProps.active && prevProps.tag.id === nextProps.tag.id;
})

export const RemoveFilterTag = ({ tag, onClick }: { tag: GenericTag; onClick: (tag: GenericTag) => void }) => {
  const handleClick = useCallback(() => {
    onClick(tag)
  }, [onClick, tag])

  return (
    <TagWrapper 
      canSelect={true}
      className="hover:bg-violet-light/50"
      variants={tagVariants}
      onClick={handleClick}
    >
      <XIcon className="size-4 text-paper shrink-0" />
      <span className="text-paper">{tag.name}</span>
    </TagWrapper>
  )
}

interface TagWrapperProps {
  children: React.ReactNode;
  canSelect?: boolean;
  className?: string;
  variants?: Variants;
  onClick?: () => void;
  disabled?: boolean;
}

// Componente wrapper para as tags, para evitar repetição de código entre as diferentes variações de tag
const TagWrapper = ({ children, canSelect, className, variants, onClick, disabled, ...props }: TagWrapperProps) => {
  const Component = canSelect ? motion.button : motion.div;

  return (
    <Component 
      className={`px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm font-medium text-paper transition-colors inline-flex items-center justify-center gap-1 min-w-12 shadow-md shadow-black/20 bg-teal-light shrink-0 ${className ?? ''} ${disabled ? 'opacity-50 cursor-not-allowed' : canSelect ? 'cursor-pointer' : ''}`}
      layout
      variants={variants} 
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  )
}