export const SelectedEventDetailsSkeleton = () => {
  return (
    <div
      aria-disabled={true}
      className="flex flex-col gap-4"
    >
      <div className="aspect-video w-auto rounded-xl -mx-6 -mt-12 mb-4 shimmer"/>
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[30dvh]">
        <h2 className="text-2xl font-bold -mb-1 text-transparent shimmer rounded-2xl w-fit">título legal</h2>
        <div className="flex flex-row flex-wrap gap-x-2 gap-y-0 items-center mb-2">
          <span className="text-[18px] shimmer rounded-2xl text-transparent">Rua dos Bobos, n 98</span>
          <span className="shimmer rounded-2xl text-transparent px-3">-</span>
          <span className="text-[18px] shimmer rounded-2xl text-transparent">08/02/2008</span>
        </div>
        <p className="text-[16px] shimmer rounded-2xl text-transparent w-full">A</p>
        <p className="text-[16px] shimmer rounded-2xl text-transparent w-9/10">A</p>
        <p className="text-[16px] shimmer rounded-2xl text-transparent w-full">A</p>
        <p className="text-[16px] shimmer rounded-2xl text-transparent w-8/10">A</p>
        <p className="text-[16px] shimmer rounded-2xl text-transparent w-2/10">A</p>
      </div>
      <div className="shimmer text-transparent p-4 rounded-xl">
        Compartilhar Evento
      </div>
    </div>
  )
}
