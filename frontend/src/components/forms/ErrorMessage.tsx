export function ErrorMessage({ hasError, errorMessage }: { hasError?: boolean; errorMessage?: string }) {
  return (
    <>
      {hasError && errorMessage && (
        <div className="text-red-300 text-[12px] font-bold">
          {errorMessage}
        </div>
      )}
    </>
  )
}