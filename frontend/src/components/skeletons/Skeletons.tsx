interface SkeletonsProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Skeletons({ children, className }: SkeletonsProps) {
  return (
    <div
      className={`shimmer rounded-2xl text-transparent ${className}`}
    >
      {children}
    </div>
  );
}
