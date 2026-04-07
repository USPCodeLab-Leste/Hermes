type LoadingProps = {
  fullPage?: boolean
  loader?: string
  className?: string
}

export default function Loading({
  fullPage = true,
  loader = 'loader-common',
  className = '',
}: LoadingProps) {
  const baseClasses = 'flex flex-col gap-4 items-center justify-center'
  const fullPageClasses = 'w-full h-dvh bg-violet'

  return (
    <div className={`${baseClasses} ${fullPage ? fullPageClasses : ''} ${className}`}>
      <span className={`${loader} size-10`} />
    </div>
  )
}