import { useEffect, useRef, useState } from "react";

export function useOverflow(title?: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const title = el.querySelector('.scrolling')
    if (!title) return;

    const checkOverflow = () => {
      setIsOverflowing(title.clientWidth > el.clientWidth);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [title]);

  return { ref, isOverflowing };
}

export function ScrollingTitle({ title, className }: { title: string; className?: string }) {
  const { ref, isOverflowing } = useOverflow(title);

  return (
    <div 
      className={`overflow-hidden whitespace-nowrap w-full flex items-center gap-(--marquee-gap) ${isOverflowing ? 'animate-scroll' : ''}`}
      ref={ref}
    >
      <span
        className={`scrolling inline-block min-w-full shrink-0 ${className ?? ''}`}
      >
        {title}
      </span>
      {isOverflowing && (
        <span 
          aria-hidden="true"
          className={`scrolling inline-block min-w-full shrink-0 ${className ?? ""}`}
        >
          {title}
        </span>
      )}
    </div>
  );
}