export const InfoCardSkeleton = () => {
  return (
    <div
      className={`p-4 shimmer rounded-2xl aspect-square flex flex-col justify-between
                  items-baseline shadow-lg outline-2 outline-transparent transition-all`
                }
      aria-disabled={true}
    >
      {/* <div className='shimmer p-2 rounded-[10px] w-fit'>
        <div className='size-7' />
      </div>
      <div>
        <h3 className='font-semibold text-lg text-left text-transparent shimmer px-2 block rounded-xl'>texto</h3>
        <span className='text-sm text-left text-transparent/75 shimmer px-2 block rounded-xl'>
          texto
        </span>
      </div> */}
    </div>
  )
}
