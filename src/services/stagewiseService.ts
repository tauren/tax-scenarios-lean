const STAGEWISE_ENABLED_KEY = 'stagewise-enabled';

export const isStagewiseEnabled = (): boolean => {
  if (process.env.NODE_ENV !== 'development') return false;
  return localStorage.getItem(STAGEWISE_ENABLED_KEY) === 'true';
};

export const setStagewiseEnabled = (enabled: boolean): void => {
  localStorage.setItem(STAGEWISE_ENABLED_KEY, enabled.toString());
}; 