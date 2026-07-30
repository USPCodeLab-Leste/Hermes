import Constants from 'expo-constants';

import { DEV_WEB_PORT, IS_DEVELOPMENT, PROD_URL } from './appEnvironment';

function isWebUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export function getBaseUrl() {
  if (!IS_DEVELOPMENT) return PROD_URL;

  const hostUri = Constants.expoConfig?.hostUri ?? null;
  const host = hostUri?.split(':')[0];

  if (!host) {
    console.warn('Nao foi possivel inferir o host de desenvolvimento. Usando URL de producao.');
    return PROD_URL;
  }

  return `http://${host}:${DEV_WEB_PORT}`;
}

export const BASE_URL = getBaseUrl();

export function normalizeWebViewUrl(rawUrl: string): string | null {
  const value = rawUrl.trim();

  if (!value) return null;

  if (value.startsWith('/')) {
    return new globalThis.URL(value, BASE_URL).toString();
  }

  if (isWebUrl(value)) return value;

  try {
    const parsed = new globalThis.URL(value);
    const nestedUrl = parsed.searchParams.get('url');

    if (!nestedUrl) return null;

    const normalizedNestedUrl = normalizeWebViewUrl(nestedUrl);
    if (!normalizedNestedUrl) return null;

    if (IS_DEVELOPMENT && normalizedNestedUrl.includes(':8081')) {
      return BASE_URL;
    }

    return normalizedNestedUrl;
  } catch {
    return null;
  }
}