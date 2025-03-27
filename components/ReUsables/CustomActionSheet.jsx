import React, { useMemo, useRef } from "react";
import { View, Text } from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { registerSheet } from "react-native-actions-sheet";

const CustomActionSheet = ({ payload }) => {
  const actionSheetSheetRef = useRef(null);
  const snapPoints = useMemo(() => [25, 50, 75, 100], []);


  return (
    <ActionSheet
      isModal={false}
      snapPoints={snapPoints}
      ref={actionSheetSheetRef}
      initialSnapIndex={3}
      gestureEnabled={true}
      id="global-action-sheet"
      closeOnTouchBackdrop={payload.closeOnBackClick}
    >
      <View className=" p-4 w-full ">{payload.content}</View>
    </ActionSheet>
  );
};

// Register globally so any component can open it
registerSheet("global-action-sheet", CustomActionSheet);

export default CustomActionSheet;
