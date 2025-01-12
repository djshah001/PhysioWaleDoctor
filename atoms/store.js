import { atom, useRecoilState } from "recoil";

const SignIn = atom({
  key: "AuthToken",
  default: {},
});

export const useSignInState = () => useRecoilState(SignIn);

 const UserData = atom({
   key: 'UserData',
   default: {},
 });

export const useUserDataState = () => useRecoilState(UserData);

 const isLoggedIn = atom({
   key: 'isLoggedIn',
   default: false,
 });

export const useIsLoggedInState = () => useRecoilState(isLoggedIn);
