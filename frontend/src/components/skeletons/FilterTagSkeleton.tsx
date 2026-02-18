import Skeletons from "../skeletons/Skeletons"

export function FilterTagSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TagSkeleton key={`tag-skeleton-${i}`} />
      ))}
    </>
  )
}

const TagSkeleton = () => (
  <div aria-hidden="true">
    <Skeletons className="w-fit">Tipo Tag</Skeletons>
    <div className='flex flex-row gap-2 flex-wrap'>
        <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm" >tag</Skeletons>
        <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm" >tag media</Skeletons>
        <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm" >tag bem grande</Skeletons>
        <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm" >tag media</Skeletons>
        <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm" >tag bem grande</Skeletons>
        <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm" >tag</Skeletons>
        <Skeletons className="px-2 md:px-3 py-2 rounded-full text-[12px] md:text-sm" >tag media</Skeletons>
    </div>
  </div>
)