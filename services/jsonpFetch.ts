/**
 * A JSONP implementation to bypass CORS restrictions for simple GET requests.
 * Note that this is limited to GET requests and doesn't support headers or other HTTP methods.
 * 
 * @param url The URL to fetch data from
 * @param timeout Optional timeout in milliseconds (default: 10000)
 * @returns A promise that resolves with the response data
 */
export function jsonpFetch(url: string, timeout = 10000): Promise<any> {
  return new Promise((resolve, reject) => {
    // Create a unique callback name
    const callbackName = 'jsonpCallback_' + Math.random().toString(36).substring(2, 15);
    
    // Create a script element
    const script = document.createElement('script');
    
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timed out'));
    }, timeout);
    
    // Set up the global callback that the external script will call
    (window as any)[callbackName] = (data: any) => {
      cleanup();
      resolve(data);
    };
    
    // Cleanup function to remove the script and callback
    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      delete (window as any)[callbackName];
      clearTimeout(timeoutId);
    };
    
    // Handle script load errors
    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP request failed'));
    };
    
    // Append callback param to URL
    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}callback=${callbackName}`;
    
    // Add the script to the document to start loading
    document.head.appendChild(script);
  });
}
