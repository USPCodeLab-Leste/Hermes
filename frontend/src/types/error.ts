export type HttpError = Error & {
  status: number
  data?: unknown
}