import React, { useState, useRef } from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

export default function SignInForm({ setForm, form }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const passwordRef = useRef(null);

  const handleEmailChange = (email) => {
    setForm({ ...form, email });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  const handlePasswordChange = (password) => {
    setForm({ ...form, password });
  };

  return (
    <View className=" w-full justify-center ">
      <TextInput
        mode="outlined"
        // label="  Email"
        placeholder="Email"
        placeholderTextColor="#6d6d6d"
        value={form.email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current.focus()}
        activeOutlineColor="#95AEFE"
        outlineColor="#6d6d6d"
        theme={{ roundness: 30 }}
        left={<TextInput.Icon icon="email" color="#6d6d6d" />}
      />
      <HelperText
        type="error"
        visible={!isValidEmail}
        padding="normal"
        style={{ paddingVertical: 0, paddingLeft: 25 }}
      >
        invalid email
      </HelperText>

      <TextInput
        mode="outlined"
        // label="  Password"
        placeholder="Password"
        placeholderTextColor="#6d6d6d"
        value={form.password}
        onChangeText={handlePasswordChange}
        secureTextEntry={!passwordVisible}
        activeOutlineColor="#95AEFE"
        outlineColor="#6B7280"
        returnKeyType="done"
        ref={passwordRef}
        onSubmitEditing={() => {
          // Add any logic you want to handle when "done" is pressed
        }}
        
        theme={{ roundness: 30 }}
        left={<TextInput.Icon icon="lock" color="#6d6d6d" />}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye-off" : "eye"}
            color="#6d6d6d"
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
      />
    </View>
  );
}
