import { atom } from "jotai";
import { Appointment } from "../types/models";

export const appointmentsAtom = atom<Appointment[]>([]);
export const currentAppointmentAtom = atom<Appointment | null>(null);
export const pastAppointmentsAtom = atom<Appointment[]>([]);
export const upcomingAppointmentsAtom = atom<Appointment[]>([]);
