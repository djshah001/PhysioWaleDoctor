import { View, Text } from "react-native";
import React from "react";
import { Snackbar } from "react-native-paper";
import useLoadingAndDialog from "../Utility/useLoadingAndDialog";
import { useToastSate } from "../../atoms/store";

const CustomToast = () => {
  const [toast, setToast] = useToastSate();

  const dismissToast = () => setToast({ visible: false, message: "" });

  return (
    <Snackbar
      visible={toast.visible}
      onDismiss={dismissToast}
      action={{
        label: "close",
        onPress: () => {
          // Do something
        },
      }}
    >
      {toast.message}
    </Snackbar>
  );
};

export default CustomToast;
