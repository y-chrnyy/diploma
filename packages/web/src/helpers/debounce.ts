export const debounce = <T>(func: (...args: T[]) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: T[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};