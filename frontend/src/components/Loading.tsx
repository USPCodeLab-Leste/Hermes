export default function Loading() {
  return (
    <main className="flex flex-col gap-2 items-center justify-center w-full h-dvh bg-violet">
      <h1 className="text-3xl font-bold">Carregando...</h1>
      <div aria-hidden="true" className='loader size-10'/>
    </main>
  )
}