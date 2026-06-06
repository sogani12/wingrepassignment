import { create } from "zustand";

interface TrashToast {
  pageId: string;
  title: string;
}

interface ToastStore {
  trashToast: TrashToast | null;
  showTrashToast: (toast: TrashToast) => void;
  clearTrashToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  trashToast: null,
  showTrashToast: (toast) => set({ trashToast: toast }),
  clearTrashToast: () => set({ trashToast: null }),
}));
