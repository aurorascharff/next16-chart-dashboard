import { useEffect, useState } from 'react';

export function useLocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return time;
}
