import { useState, useEffect, useRef, useCallback } from "react";

interface UseCountdownProps {
  initialCount: number;
  onExpire?: () => void;
}

const useCountdown = ({ initialCount, onExpire }: UseCountdownProps) => {
  const [count, setCount] = useState(initialCount);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (count <= 0 && onExpire) {
      onExpire();
    }
  }, [count, onExpire]);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return; // Prevent multiple intervals

    intervalRef.current = setInterval(() => {
      setCount((prev) => prev !== 0 ? prev - 1: 0);
    }, 1000);
  }, []);

  const reset = useCallback(
    (newCount: number = initialCount) => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = null;
      setCount(newCount);
    },
    [initialCount]
  );

  const stop = useCallback(() => {
    clearInterval(intervalRef.current as NodeJS.Timeout);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    if (count <= 0) {
      stop();
    }
  }, [count, stop]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, []);

  
  // console.log("count", count);

  return { count, start, reset, stop };
};

export default useCountdown;
