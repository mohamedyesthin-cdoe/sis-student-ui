// src/store/loaderStore.ts
let setLoading: (isLoading: boolean) => void = () => {};

export const loaderStore = {
  setHandler: (fn: (loading: boolean) => void) => {
    setLoading = fn;
  },
  start: () => setLoading(true),
  stop: () => setLoading(false),
};
