import { atom, useAtom } from "jotai";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const toastAtom = atom<ToastData | null>(null);

export const useToast = () => {
  const [toast, setToast] = useAtom(toastAtom);

  const showToast = (
    type: ToastType,
    title: string,
    message?: string,
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substring(7);
    setToast({ id, type, title, message, duration });

    if (duration > 0) {
      setTimeout(() => {
        setToast((currentToast) => {
          if (currentToast?.id === id) {
            return null;
          }
          return currentToast;
        });
      }, duration);
    }
  };

  const hideToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};
