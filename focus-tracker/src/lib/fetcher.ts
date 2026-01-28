/**
 * Fetcher Utility for SWR
 * 
 * A reusable fetcher function that handles API requests with proper
 * error handling and authentication token support.
 */

/**
 * Basic fetcher for GET requests
 * Used as the default fetcher for useSWR hooks
 * 
 * @param url - The API endpoint to fetch from
 * @returns Promise with JSON response data
 * @throws Error if response is not ok
 * 
 * @example
 * ```tsx
 * const { data, error } = useSWR('/api/users', fetcher);
 * ```
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    (error as any).info = await res.json().catch(() => ({}));
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

/**
 * Fetcher with custom options for more control
 * Supports all fetch options plus authentication
 * 
 * @param url - The API endpoint
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise with JSON response data
 * 
 * @example
 * ```tsx
 * await fetchWithOptions('/api/habits', {
 *   method: 'POST',
 *   body: JSON.stringify({ title: 'New Habit' })
 * });
 * ```
 */
export const fetchWithOptions = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = new Error('Request failed');
    (error as any).info = await res.json().catch(() => ({}));
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

/**
 * POST request helper
 */
export const postData = async <T>(url: string, data: unknown): Promise<T> => {
  return fetchWithOptions<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request helper
 */
export const putData = async <T>(url: string, data: unknown): Promise<T> => {
  return fetchWithOptions<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * PATCH request helper
 */
export const patchData = async <T>(url: string, data: unknown): Promise<T> => {
  return fetchWithOptions<T>(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request helper
 */
export const deleteData = async <T>(url: string): Promise<T> => {
  return fetchWithOptions<T>(url, {
    method: 'DELETE',
  });
};
