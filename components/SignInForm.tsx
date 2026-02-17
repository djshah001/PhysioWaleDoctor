import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import CustomInput from "./ReUsables/CustomInput"; // Adjust path if needed

interface SignInFormProps {
  setForm: (form: any) => void;
  form: any;
}

export default function SignInForm({ setForm, form }: SignInFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const passwordRef = useRef<any>(null);

  const handleEmailChange = (email: string) => {
    setForm({ ...form, email });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  const handlePasswordChange = (password: string) => {
    setForm({ ...form, password });
  };

  return (
    <View className="w-5/6 justify-center my-4">
      <CustomInput
        label="Email"
        placeholder="Email"
        value={form.email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        leftIcon="email"
        error={!isValidEmail ? "invalid email" : undefined}
      />

      <CustomInput
        ref={passwordRef}
        label="Password"
        placeholder="Password"
        value={form.password}
        onChangeText={handlePasswordChange}
        secureTextEntry={!passwordVisible}
        returnKeyType="done"
        leftIcon="lock"
        rightIcon={passwordVisible ? "eye-off" : "eye"} // Adjusted logic to match CustomInput expects icon name
        rightPress={() => setPasswordVisible(!passwordVisible)}
        containerStyles="mt-2"
      />
    </View>
  );
}
