import { atom } from "jotai";
import { Doctor } from "~/types";

export const userDataAtom = atom<Doctor | null>(null);
