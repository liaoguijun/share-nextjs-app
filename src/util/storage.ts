import { Storage, Storage_session } from '@/type/storage'

export const getLocalStorage = (key: Storage): string | null => {
  return window.localStorage.getItem(key);
};

export const setLocalStorage = (key: Storage, content: string) => {
  window.localStorage.setItem(key, content);
};

export const clearLocalStorage = () => {
  window.localStorage.clear();
};

export const removeLocalStorage = (key: Storage) => {
  window.localStorage.removeItem(key);
};

export const getSessionStorage = (key: Storage_session): string | null => {
  return window.sessionStorage.getItem(key);
};

export const setSessionStorage = (key: Storage_session, content: string) => {
  window.sessionStorage.setItem(key, content);
};

export const clearSessionStorage = () => {
  window.sessionStorage.clear();
};

export const removeSessionStorage = (key: Storage_session) => {
  window.sessionStorage.removeItem(key);
};
