import { atom } from "jotai";
import { Clinic } from "../types/models";

export const clinicsAtom = atom<Clinic[]>([]);
export const selectedClinicAtom = atom<Clinic | null>(null);
export const nearByClinicsAtom = atom<Clinic[]>([]);
