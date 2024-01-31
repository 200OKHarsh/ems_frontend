import { useState, useCallback, useRef, useEffect } from "react";

interface HttpClientResponse<T = any>{
  data?: T;
}

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async<T>(
      url: string,
      method: string = "GET",
      body: any = null,
      headers: Record<string, string> = {}
    ): Promise<HttpClientResponse<T>> => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(`http://localhost:5000/api${url}`, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          const resMessage = await response.json();
          throw new Error(resMessage.message);
        }
        const responseData: T = await response.json();

        setIsLoading(false);
        return { data: responseData };
      } catch (error: any) {
        console.log(error);
        if (error.message !== "The user aborted a request.") {
          setError(error.message);
          setIsLoading(false);
          
          throw error;
        }
        return { data: undefined };
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
