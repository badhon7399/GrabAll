import { useState, useEffect } from 'react';

// key: unique identifier for the cache (e.g. 'products', 'banners')
// fetcher: function that returns a promise (e.g. () => fetch(...).then(res => res.json()))
export function useCachedFetch(key, fetcher, cacheTimeMs = 5 * 60 * 1000) {
  const [data, setData] = useState(() => {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    const { value, expiry } = JSON.parse(cached);
    if (Date.now() > expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return value;
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) return; // Already cached
    setLoading(true);
    fetcher()
      .then(result => {
        setData(result);
        sessionStorage.setItem(key, JSON.stringify({
          value: result,
          expiry: Date.now() + cacheTimeMs
        }));
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [key]);

  return { data, loading, error };
}
