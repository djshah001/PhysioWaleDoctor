import { View, Text, Pressable } from "react-native";
import React from "react";
import { useAtom } from "jotai";
import { toastAtom } from "../../store";
import { MotiView } from "moti";

const toastStyles = {
  primary: "bg-blue-500",
  secondary: "bg-gray-500",
  success: "bg-green-500",
  error: "bg-red-500",
  muted: "bg-gray-400",
};

const CustomToast = () => {
  const [toast, setToast] = useAtom(toastAtom);

  const dismissToast = () =>
    setToast((prev) => ({ ...prev, visible: false, message: "" }));

  if (!toast.visible) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 100 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 100 }}
      className={`absolute bottom-10 left-4 right-4 p-4 rounded-xl flex-row justify-between items-center shadow-lg ${
        toastStyles[toast.type] || "bg-gray-800"
      }`}
    >
      <Text className="text-white font-pmedium flex-1 mr-4">
        {toast.message}
      </Text>
      <Pressable onPress={dismissToast}>
        <Text className="text-white font-pbold">Close</Text>
      </Pressable>
    </MotiView>
  );
};

export default CustomToast;
