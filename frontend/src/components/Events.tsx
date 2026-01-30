import { useState } from "react"
import type { Event } from "../types/events"
import { motion, stagger, type Variants } from "framer-motion"

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
      key={event.id} 
      className={`aspect-5/3 w-full max-w-120 overflow-hidden bg-violet-dark rounded-xl flex flex-col bg-cover bg-no-repeat 
                 bg-center justify-between cursor-pointer hover:-translate-y-2 shadow-lg hover:shadow-2xl 
                 outline-2 hover:outline-paper focus:outline-paper outline-transparent ${isReady ? 'transition-all' : ''}`}
      style={{ backgroundImage: `url('https://picsum.photos/600/200?random=${event.id}')`}}
      onClick={() => selectEvent(event.id)}
      onAnimationComplete={() => setIsReady(true)}
      aria-label={`Selecionar evento ${event.title}`}
    >
      <Tags tags={event.tags} />
      <div className="self-end w-full p-4 flex flex-col items-start backdrop-blur-sm from-violet-light/30 to-violet-mid bg-linear-to-b">
        <h2 className="font-bold text-[16px] md:text-xl text-paper">{event.title}</h2>
        <p className="text-[12px] md:text-[18px] text-paper">{event.date}</p>
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

function Tags({ tags }: { tags: string[] }) {
  return (
    <motion.div 
      className="flex flex-row gap-2 p-4"
      // animate="jump"
      variants={tagsVariants}
    >
      {tags.map((tag, index) => (
        <Tag key={index} tag={tag} />
      ))}
    </motion.div>
  )
}

function Tag({ tag }: { tag: string }) {
  return (
    <motion.span 
      className="bg-teal-light outline-teal-mid outline-2 px-3 py-1 rounded-full 
                  text-[10px] md:text-sm font-medium inline-block text-paper"
      variants={tagVariants}
    >
      {tag}
    </motion.span>
  )
}