import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { LoginPayload } from "../types/auth";

export const signInAtom = atomWithStorage<LoginPayload>("signInAtom", {
  phoneNumber: "",
  password: "",
});

export const authTokenAtom = atomWithStorage<string>("authTokenAtom", "");
export const refreshTokenAtom = atomWithStorage<string>("refreshTokenAtom", "");
export const isLoggedInAtom = atomWithStorage<boolean>("isLoggedInAtom", false);
export const isAppFirstOpenedAtom = atomWithStorage<boolean>(
  "isAppFirstOpenedAtom",
  true
);

export const isProfileCompletedAtom = atomWithStorage<boolean>(
  "isProfileCompletedAtom",
  false
);

// Ephemeral state for Firebase OTP Confirmation (contains functions, so no storage)
export const otpConfirmationAtom = atom<any>(null);
