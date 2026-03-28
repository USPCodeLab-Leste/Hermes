export function Label({id, label, required}: {id: string, label: string, required?: boolean}) {
  return (
    <label 
      htmlFor={id} 
      className={`dark:text-paper text-ink font-semibold select-none cursor-pointer w-fit
        ${required ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}`}
    >
      {label}
    </label>
  )
}