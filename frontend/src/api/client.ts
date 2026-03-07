import type { HttpError } from "../types/error"

export async function fakeRequest<T>(data: T, delay = 200): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, delay))

  return data
}

function createHttpError(status: number, message: string, data?: unknown): HttpError {
  const error = new Error(message) as HttpError
  error.status = status
  error.data = data
  return error
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '')
}

export function getApiBaseUrl(): string {
  const baseUrl = (import.meta.env.VITE_BASE_URL as string | undefined) ?? ''

  if (!baseUrl) {
    throw new Error(
      'VITE_BASE_URL não definido. Crie/ajuste o arquivo frontend/.env com VITE_BASE_URL=http://localhost (ou a URL do backend).',
    )
  }

  return normalizeBaseUrl(baseUrl)
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  includeCredentials?: boolean
  skipAuthRefresh?: boolean
}

let refreshPromise: Promise<void> | null = null

function getErrorMessage(statusText: string, isJson: boolean, data: unknown) {
  return (
    (isJson && data && typeof data === 'object' && 'error' in (data as any) && (data as any).error) ||
    (isJson && data && typeof data === 'object' && 'message' in (data as any) && (data as any).message) ||
    statusText ||
    'Erro na requisição'
  )
}

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '')

  return { isJson, data }
}

async function refreshAccessToken(baseUrl: string) {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'GET',
        credentials: 'include',
      })

      const { isJson, data } = await parseResponseBody(response)

      if (!response.ok) {
        const message = getErrorMessage(response.statusText, isJson, data)
        throw createHttpError(response.status, String(message), data)
      }
    })().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`

  const headers = new Headers(options.headers)
  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const { includeCredentials = true, body, skipAuthRefresh = false, ...fetchOptions } = options

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: includeCredentials ? 'include' : 'omit',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const { isJson, data } = await parseResponseBody(response)

  if (!response.ok) {
    if (response.status === 401 && !skipAuthRefresh && !path.startsWith('/auth/refresh')) {
      try {
        await refreshAccessToken(baseUrl)
        return apiRequest<T>(path, { ...options, includeCredentials: true, skipAuthRefresh: true })
      } catch {
        // Se falhar o refresh, propaga o erro original da requisição
      }
    }

    const message = getErrorMessage(response.statusText, isJson, data)
    throw createHttpError(response.status, String(message), data)
  }

  return data as T
}