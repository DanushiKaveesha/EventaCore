const USER_STORAGE_KEY = 'userInfo';
const SESSION_TIMEOUT_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed?.token) {
      clearCurrentUser();
      return null;
    }

    const lastActiveAt = parsed.lastActiveAt || 0;
    const now = Date.now();

    if (now - lastActiveAt > SESSION_TIMEOUT_MS) {
      clearCurrentUser();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error parsing user info:', error);
    clearCurrentUser();
    return null;
  }
};

export const setCurrentUser = (user) => {
  const payload = {
    ...user,
    lastActiveAt: Date.now(),
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(payload));
};

export const refreshCurrentUserSession = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!parsed?.token) return;

    const updated = {
      ...parsed,
      lastActiveAt: Date.now(),
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error refreshing session:', error);
  }
};

export const clearCurrentUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  if (!user) {
    console.warn('No user logged in. Please log in to continue.');
    return null;
  }
  return user._id;
};

export const isLoggedIn = () => {
  const user = getCurrentUser();
  return !!(user && user.token);
};

export const getCurrentUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};