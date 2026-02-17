import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  authTokenAtom,
  isAppFirstOpenedAtom,
  isLoggedInAtom,
  isProfileCompletedAtom,
  refreshTokenAtom,
} from "../store/authAtoms";
import { userDataAtom } from "../store/userAtoms";
import { authApi } from "../apis/auth";
import { LoginPayload, RegisterPayload, VerifyOtpPayload } from "../types/auth";
import { Doctor } from "~/types";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [authToken, setAuthToken] = useAtom(authTokenAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
  const [user, setUser] = useAtom(userDataAtom);
  const [isAppFirstOpened, setIsAppFirstOpened] = useAtom(isAppFirstOpenedAtom);
  const [isProfileCompleted, setIsProfileCompleted] = useAtom(
    isProfileCompletedAtom,
  );

  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const isAppFirstOpenedval =
        await AsyncStorage.getItem("isAppFirstOpened");
      setIsAppFirstOpened(isAppFirstOpenedval === "true");
      const token = await AsyncStorage.getItem("authToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const userData = await AsyncStorage.getItem("userData");
      const hasValidAuth =
        token !== null && refreshToken !== null && userData !== null;

      if (hasValidAuth) {
        setIsLoggedIn(true);
        setAuthToken(token);
        setRefreshToken(refreshToken);
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Firebase Phone Auth ---
  const sendOTP = async (phoneNumber: string, recaptchaVerifier: any) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier,
      );
      return { success: true, confirmationResult };
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      return { success: false, error: error.message };
    }
  };

  const login = async (data: LoginPayload) => {
    try {
      // NOTE: Standard login via password with backend
      const response = await authApi.login(data);
      const resData = response.data as any;

      const token = resData?.accessToken || resData?.data?.accessToken;
      const refreshToken = resData?.refreshToken || resData?.data?.refreshToken;
      console.log("refreshToken", refreshToken);
      const userData = resData?.user || resData?.data?.user;

      if (token) {
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        if (userData) {
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);
          if (userData.isProfileCompleted !== undefined) {
            setIsProfileCompleted(userData.isProfileCompleted);
          }
        }
        setIsLoggedIn(true);
        return { success: true };
      }
      return { success: false, error: "No token received" };
    } catch (error: any) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (data: RegisterPayload) => {
    try {
      const payload = {
        ...data,
        context: "doctor" as const,
      };

      const res = await authApi.signUp(payload);
      const resData = res.data as any;
      const token = resData.data.accessToken;
      const refreshToken = resData.data.refreshToken;

      if (resData.success) {
        const userData = resData.data.user;
        console.log("userData", JSON.stringify(userData, null, 2));
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
        if (token) {
          setAuthToken(token);
        }
        if (refreshToken) {
          setRefreshToken(refreshToken);
        }
        setIsProfileCompleted(true);
        return { success: true };
      }
      return { success: false };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const checkRegisterEligibility = async (data: RegisterPayload) => {
    try {
      const payload = {
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword || data.password,
        context: "patient" as const,
      };
      await authApi.checkEligibility(payload);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration check failed",
      };
    }
  };

  const verifyAndRegister = async (data: VerifyOtpPayload) => {
    try {
      const response = await authApi.verifyRegistration(data);
      const resData = response.data as any;

      const token = resData?.data?.accessToken || resData?.accessToken;
      const newUser = resData?.data?.newRecord || resData?.newRecord;

      if (token) {
        await AsyncStorage.setItem("authToken", token); // changed to authToken to match login
        if (newUser) {
          await AsyncStorage.setItem("userData", JSON.stringify(newUser));
          await AsyncStorage.setItem("userData", JSON.stringify(newUser));
          setUser(newUser);
          if (newUser.isProfileCompleted !== undefined) {
            setIsProfileCompleted(newUser.isProfileCompleted);
          }
        }
        setIsLoggedIn(true);
        return { success: true };
      }
      return {
        success: false,
        error: "Validation successful but no token returned",
      };
    } catch (error: any) {
      console.error("Registration verification failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Verification failed",
      };
    }
  };

  const verifyFirebaseOtp = async (confirmationResult: any, otp: string) => {
    try {
      const userCredential = await confirmationResult.confirm(otp);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const registerDirect = async (data: any) => {
    console.log("Register Direct Data:", data);
    try {
      const res = await authApi.registerDirect(data);
      console.log(
        "Register Direct Response:",
        JSON.stringify(res.data, null, 2),
      );
      if (res.data.success && res.data.data) {
        const { accessToken, refreshToken, user } = res.data.data;

        if (accessToken) {
          await AsyncStorage.setItem("authToken", accessToken);
          console.log("Auth Token Set:", accessToken);
          setAuthToken(accessToken);
        }

        if (refreshToken) {
          await AsyncStorage.setItem("refreshToken", refreshToken);
          setRefreshToken(refreshToken);
        }

        if (user) {
          await AsyncStorage.setItem("userData", JSON.stringify(user));
          // Cast user to Doctor strictly as per atom definition
          setUser(user as Doctor);
          // Directly set to false on new registration
          setIsProfileCompleted(false);
        }

        setIsLoggedIn(false);

        return { success: true };
      }
      return { success: false, error: "Registration failed" };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      const userData = response.data?.loggedInData;

      console.log(response.data);

      if (userData) {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData as Doctor);
        if (userData.isProfileCompleted !== undefined) {
          setIsProfileCompleted(userData.isProfileCompleted);
        }
      }
      return { success: true };
    } catch (error: any) {
      console.error("Failed to refresh user data:", error.response.data);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to refresh user data",
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Logout API failed", error);
    } finally {
      await AsyncStorage.multiRemove(["authToken", "refreshToken", "userData"]);
      setIsLoggedIn(false);
      setIsProfileCompleted(false);
      setUser(null);
      router.replace("/(auth)/sign-in");
    }
  };

  return {
    isLoggedIn,
    isLoading,
    user,
    authToken,
    refreshToken,
    login,
    register,
    logout,
    checkRegisterEligibility,
    verifyAndRegister,
    loadUserData,
    refreshUser,
    isAppFirstOpened,
    isProfileCompleted,
    sendOTP,
    verifyFirebaseOtp,
    registerDirect,
  };
};
