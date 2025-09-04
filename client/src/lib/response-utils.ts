/**
 * Utility functions for handling Response objects safely to prevent
 * "body stream already read" errors by cloning responses before consumption.
 */

export interface SafeResponseResult {
  data: any;
  text?: string;
  response: Response;
}

/**
 * Safely parse a response as JSON with fallback to text.
 * Clones the response to prevent "body stream already read" errors.
 */
export async function safeParseResponse(response: Response): Promise<SafeResponseResult> {
  const clonedResponse = response.clone();
  
  try {
    const data = await response.json();
    return {
      data,
      response: clonedResponse,
    };
  } catch (jsonError) {
    // If JSON parsing fails, try to get text from the cloned response
    try {
      const text = await clonedResponse.text();
      return {
        data: null,
        text,
        response: clonedResponse,
      };
    } catch (textError) {
      // If both fail, return with minimal data
      return {
        data: null,
        text: response.statusText || 'Unknown error',
        response: clonedResponse,
      };
    }
  }
}

/**
 * Safely get error message from a failed response.
 * Handles both JSON error responses and plain text.
 */
export async function getErrorMessage(response: Response, fallback: string = 'Unknown error'): Promise<string> {
  const { data, text } = await safeParseResponse(response);
  
  if (data && data.message) {
    return data.message;
  }
  
  if (text) {
    return text;
  }
  
  return fallback;
}

/**
 * Create a standardized error from a failed response
 */
export async function createResponseError(response: Response, defaultMessage?: string): Promise<Error> {
  const message = await getErrorMessage(
    response, 
    defaultMessage || `Request failed with status ${response.status}`
  );
  
  const error = new Error(message);
  (error as any).status = response.status;
  (error as any).response = response;
  
  return error;
}

/**
 * Safe fetch wrapper that handles response parsing consistently
 */
export async function safeFetch(
  url: string, 
  options?: RequestInit
): Promise<{ response: Response; data?: any; error?: Error }> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await createResponseError(response);
      return { response, error };
    }
    
    const { data } = await safeParseResponse(response);
    return { response, data };
  } catch (error) {
    return { 
      response: new Response(null, { status: 0 }), 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}