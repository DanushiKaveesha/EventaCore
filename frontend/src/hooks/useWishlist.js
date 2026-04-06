import { useState, useCallback } from 'react';

const STORAGE_KEY = 'eventacore_wishlist';

const getStored = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

/**
 * useWishlist — persists a list of event IDs in localStorage.
 * Returns: { wishlist, isWishlisted, toggleWishlist }
 */
const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => getStored());

  const isWishlisted = useCallback(
    (eventId) => wishlist.includes(eventId),
    [wishlist]
  );

  const toggleWishlist = useCallback((eventId) => {
    setWishlist((prev) => {
      const next = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { wishlist, isWishlisted, toggleWishlist };
};

export default useWishlist;
