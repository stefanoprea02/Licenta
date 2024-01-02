import { useCallback, useRef, useState } from "react";

interface ConfigInterface {
  url: string;
  method: string;
  headers: HeadersInit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  id: string;
}

const useHttp = () => {
  const [isLoading, setIsLoading] = useState<{
    [key: string]: boolean;
  }>();
  const [isFinished, setIsFinished] = useState<{
    [key: string]: boolean;
  }>();
  const [error, setError] = useState<{
    [key: string]: string;
  }>();
  const activeRequests = useRef<{
    [key: string]: boolean;
  }>({});

  const resetValues = useCallback(() => {
    setIsLoading(undefined);
    setIsFinished(undefined);
    setError(undefined);
  }, []);

  const sendRequest = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (requestConfig: ConfigInterface, applyData?: (data: any) => void) => {
      if (activeRequests.current[requestConfig.id]) {
        return;
      }

      activeRequests.current[requestConfig.id] = true;

      setIsLoading((prev) => ({ ...prev, [requestConfig.id]: true }));
      setIsFinished((prev) => ({ ...prev, [requestConfig.id]: false }));
      setError((prev) => ({ ...prev, [requestConfig.id]: "" }));

      fetch(requestConfig.url, {
        method: requestConfig.method,
        credentials: "include",
        headers: requestConfig.headers,
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null
      })
        .then(async (response) => {
          const res = await response.json();
          if (!response.ok) {
            setError((prev) => ({
              ...prev,
              [requestConfig.id]: res.message || "Something weng wrong"
            }));
            return;
          }
          return res;
        })
        .then((data) => data && applyData?.(data))
        .catch((error) => {
          setError((prev) => ({
            ...prev,
            [requestConfig.id]: error
          }));
        })
        .finally(() => {
          setIsLoading((prev) => ({ ...prev, [requestConfig.id]: false }));
          setIsFinished((prev) => ({ ...prev, [requestConfig.id]: true }));
          activeRequests.current[requestConfig.id] = false;
        });
    },
    []
  );

  return {
    isLoading,
    isFinished,
    error,
    sendRequest,
    resetValues
  };
};

export default useHttp;
