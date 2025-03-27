import { atom, useRecoilState } from "recoil";

const SignIn = atom({
  key: "AuthToken",
  default: {},
});

export const useSignInState = () => useRecoilState(SignIn);

const UserData = atom({
  key: "UserData",
  default: {},
});

export const useUserDataState = () => useRecoilState(UserData);

const isLoggedIn = atom({
  key: "isLoggedIn",
  default: false,
});

export const useIsLoggedInState = () => useRecoilState(isLoggedIn);

// const Repeatables = atom({
//   key: "Repeatables",
//   default: { apiUrl: process.env.EXPO_PUBLIC_API_URL },
// });

// export const useRepeatablesState = () => useRecoilState(Repeatables);

const toastAtom = atom({
  key: "toastAtom",
  default: {
    visible: false,
    message: "",
    type: "success",
  },
});

export const useToastSate = () => useRecoilState(toastAtom);

export const actionSheetContentAtom = atom({
  key: "actionSheetContentAtom",
  default: null, // Will hold a React component dynamically
});

export const actionSheetContentState = () =>
  useRecoilState(actionSheetContentAtom);

export const actionSheetRefAtom = atom({
  key: "actionSheetRefAtom",
  default: null, // Stores ref to open/close ActionSheet
});

export const actionSheetRefState = () => useRecoilState(actionSheetRefAtom);

export const clinicsAtom = atom({
  key: "clinicsAtom",
  default: [],
});

export const useClinicsState = () => useRecoilState(clinicsAtom);
