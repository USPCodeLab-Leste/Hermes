import Skeletons from './Skeletons';

export function EventCardSkeleton() {
  return (
      <div
        className={`aspect-video w-full max-w-120 overflow-hidden bg-violet-light/20 rounded-xl flex flex-col bg-cover bg-no-repeat 
                  bg-center justify-between shadow-lg`}
          aria-hidden="true"
      >
        <div className='flex flex-row gap-2 md:flex-wrap overflow-hidden p-4'>
            <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm shrink-0" >tag</Skeletons>
            <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm shrink-0" >tag media</Skeletons>
            <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm shrink-0" >tag bem grande</Skeletons>
        </div>
        <div className="self-end w-full p-4 flex flex-col items-start">
          <Skeletons className="text-[18px] md:text-xl text-left whitespace-nowrap text-ellipsis overflow-hidden">Título de Enfeite Bem Legal</Skeletons>
          <Skeletons className='text-sm'>08/02/08</Skeletons>
        </div>
      </div>
  )
}