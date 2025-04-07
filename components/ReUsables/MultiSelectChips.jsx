import React, { useState } from "react";
import { View, Text } from "react-native";
import { Chip, IconButton, Dialog, Portal, Button } from "react-native-paper";
import CustomInput from "./CustomInput";
import colors from "../../constants/colors";

const MultiSelectChips = ({
  title,
  items,
  onAddItem,
  onRemoveItem,
  error,
  suggestions = [],
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [itemError, setItemError] = useState("");

  const openDialog = () => {
    setNewItem("");
    setItemError("");
    setShowDialog(true);
  };

  const addItem = () => {
    if (!newItem.trim()) {
      setItemError(`${title} name is required`);
      return;
    }

    onAddItem(newItem.trim());
    setNewItem("");
    setShowDialog(false);
  };

  const addSuggestion = (suggestion) => {
    onAddItem(suggestion);
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-pmedium text-black-200">{title}</Text>
        <IconButton
          icon="plus"
          size={20}
          iconColor={colors.secondary[300]}
          onPress={openDialog}
        />
      </View>
      
      {error && (
        <Text className="text-red-500 mb-2">{error}</Text>
      )}
      
      <View className="flex-row flex-wrap gap-2">
        {items.map((item, index) => (
          <Chip
            key={index}
            onClose={() => onRemoveItem(index)}
            style={{ marginBottom: 8 }}
            mode="outlined"
          >
            {item}
          </Chip>
        ))}
      </View>
      
      {suggestions.length > 0 && (
        <View className="mt-2">
          <Text className="text-sm text-gray-500 mb-2">Suggestions:</Text>
          <View className="flex-row flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              !items.includes(suggestion) && (
                <Chip
                  key={index}
                  onPress={() => addSuggestion(suggestion)}
                  style={{ marginBottom: 8 }}
                >
                  {suggestion}
                </Chip>
              )
            ))}
          </View>
        </View>
      )}
      
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Add {title}</Dialog.Title>
          <Dialog.Content>
            <CustomInput
              label={`${title} Name`}
              placeholder={`Enter ${title} name`}
              value={newItem}
              onChangeText={setNewItem}
              error={itemError}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Cancel</Button>
            <Button onPress={addItem}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default React.memo(MultiSelectChips);