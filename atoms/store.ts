import { atom, useAtom } from "jotai";

// Define interfaces for your state
import { Doctor } from "../types";

export interface UserData extends Partial<Doctor> {
  authToken?: string;
  [key: string]: any;
}

export interface ToastData {
  visible: boolean;
  title?: string;
  message?: string;
  type: "success" | "error" | "info" | "warning";
}

export interface Clinic {
  _id: string;
  name: string;
  distanceInKm?: number;
  [key: string]: any;
}

// Atom Definitions
export const userAtom = atom<UserData>({});
export const toastAtom = atom<ToastData>({
  visible: false,
  message: "",
  type: "success",
});
export const clinicsAtom = atom<Clinic[]>([]);
export const isLoggedInAtom = atom<boolean>(false);
