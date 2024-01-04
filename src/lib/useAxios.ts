import { useState, useCallback, useRef, useEffect } from 'react';

interface HttpClientResponse {
  message: string;
}

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async (
      url: string,
      method: string = 'GET',
      body: any = null,
      headers: Record<string, string> = {}
    ): Promise<HttpClientResponse> => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(`https://ems-server-mocha.vercel.app/api${url}`, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData: HttpClientResponse = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        if (err.message !== 'The user aborted a request.') {
          setError(err.message);
          setIsLoading(false);
          throw err;
        }
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
