import { View, Text } from "react-native";
import React from "react";
import { Snackbar } from "react-native-paper";
import { useToastSate } from "../../atoms/store";

const toastStyles = {
  primary: { backgroundColor: "#007bff", textColor: "#ffffff" },
  secondary: { backgroundColor: "#6c757d", textColor: "#ffffff" },
  success: { backgroundColor: "#28a745", textColor: "#ffffff" },
  error: { backgroundColor: "#dc3545", textColor: "#ffffff" },
  muted: { backgroundColor: "#adb5bd", textColor: "#000000" },
};

const CustomToast = () => {
  const [toast, setToast] = useToastSate();

  const dismissToast = () =>
    setToast({ ...toast, visible: false, message: "" });

  return (
    <Snackbar
      visible={toast.visible}
      onDismiss={dismissToast}
      action={{
        label: "Close",
        onPress: dismissToast,
      }}
      style={{
        backgroundColor: toastStyles[toast.type]?.backgroundColor || "#333",
        borderRadius: 10,
      }}
      elevation={5}
    >
      <Text style={{ color: toastStyles[toast.type]?.textColor || "#fff" }}>
        {toast.message}
      </Text>
    </Snackbar>
  );
};

export default CustomToast;
