/**
 * API utility for making requests to the backend
 * Works with both client and server components
 */

const API_BASE_URL = '';

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

/**
 * Enhanced fetch wrapper for API calls
 */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit & { baseURL?: string } = {}
): Promise<Response> {
  const url = `${options?.baseURL || ''}${path.startsWith('/') ? path : `/${path}`}`;

  const fetchOptions: RequestInit = { ...options, credentials: 'include' };

  // CRITICAL: Do NOT set Content-Type when uploading files (FormData)
  if (options.body instanceof FormData) {
    // Let browser set the correct multipart boundary
    delete (fetchOptions.headers as any)?.['Content-Type'];
  } else {
    fetchOptions.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  try {
    const { next, ...rest } = fetchOptions as RequestInit & {
      next?: { revalidate?: number | false; tags?: string[] };
    };

    // Allow callers to opt into ISR/data-cache. When `next` is present we must
    // NOT also send `cache`, otherwise Next.js rejects the request.
    const response = await fetch(url, next ? { ...rest, next } : { ...rest, cache: rest.cache ?? 'no-store' });
    return response;
  } catch (error) {
    console.error('[API Error]', error);
    throw error;
  }
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await apiFetch(path, { ...options, method: "GET" });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
  path: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const response = await apiFetch(path, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(
  path: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const response = await apiFetch(path, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await apiFetch(path, { ...options, method: "DELETE" });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

/**
 * PATCH request helper
 */
export async function apiPatch<T = any>(
  path: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const response = await apiFetch(path, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}
