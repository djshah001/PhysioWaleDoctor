import React, { useState } from "react";
import { View, Text, Modal, FlatList, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Button } from "../ui/button";

interface SpecializationPickerProps {
  value: string;
  onChange: (specialization: string) => void;
  error?: string;
}

const specializations = [
  "Physiotherapist",
  "Sports Physiotherapist",
  "Orthopedic Physiotherapist",
  "Neurological Physiotherapist",
  "Pediatric Physiotherapist",
  "Geriatric Physiotherapist",
  "Cardiopulmonary Physiotherapist",
  "Women's Health Physiotherapist",
  "Rehabilitation Specialist",
];

const SpecializationPicker: React.FC<SpecializationPickerProps> = ({
  value,
  onChange,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (specialization: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(specialization);
    setModalVisible(false);
  };

  return (
    <View className="gap-2">
      <Text className="text-white ml-1 font-pmedium">Specialization</Text>

      <Button
        onPress={() => setModalVisible(true)}
        className="overflow-hidden rounded-2xl border-0 p-0 bg-white/5"
      >
        <BlurView
          intensity={20}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          className={`flex-1 flex-row items-center justify-between p-4 border ${
            error ? "border-red-500" : "border-white/10"
          } bg-white/5`}
        >
          <View className="flex-row items-center gap-3 flex-1">
            <MaterialCommunityIcons
              name="medical-bag"
              size={20}
              color={value ? "#fb7185" : "#94a3b8"}
            />
            <Text
              className={`font-pregular ${value ? "text-white" : "text-slate-400"}`}
              numberOfLines={1}
            >
              {value || "Select Specialization"}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#94a3b8"
          />
        </BlurView>
      </Button>

      {error && (
        <Animated.Text
          entering={FadeIn}
          className="text-red-400 text-xs ml-1 font-pregular"
        >
          {error}
        </Animated.Text>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Animated.View
            entering={SlideInDown.springify()}
            className="bg-slate-900 rounded-t-3xl max-h-[70%]"
          >
            <View className="p-6 border-b border-white/10">
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-xl font-pbold">
                  Select Specialization
                </Text>
                <Button
                  onPress={() => setModalVisible(false)}
                  className="bg-transparent p-0"
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="white"
                  />
                </Button>
              </View>
            </View>

            <FlatList
              data={specializations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Button
                  onPress={() => handleSelect(item)}
                  className={`p-4 border-b border-white/5 bg-transparent ${
                    value === item ? "bg-rose-500/10" : ""
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`font-pmedium ${
                        value === item ? "text-rose-400" : "text-white"
                      }`}
                    >
                      {item}
                    </Text>
                    {value === item && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color="#fb7185"
                      />
                    )}
                  </View>
                </Button>
              )}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default SpecializationPicker;
