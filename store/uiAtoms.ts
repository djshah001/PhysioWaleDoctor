import { atom } from "jotai";

export interface ToastState {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export const toastAtom = atom<ToastState>({
  visible: false,
  message: "",
  type: "success",
});

export const actionSheetContentAtom = atom(null);
export const actionSheetRefAtom = atom(null);
