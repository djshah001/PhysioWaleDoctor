import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

interface InsuranceProvider {
  provider: string;
  policyTypes: string[];
}

interface ClinicInsuranceProps {
  insuranceAccepted: InsuranceProvider[];
  setInsuranceAccepted: (value: InsuranceProvider[]) => void;
}

const ClinicInsurance: React.FC<ClinicInsuranceProps> = ({
  insuranceAccepted,
  setInsuranceAccepted,
}) => {
  const [newProvider, setNewProvider] = useState("");
  const [newPolicyType, setNewPolicyType] = useState("");

  const addProvider = () => {
    if (!newProvider.trim()) return;
    setInsuranceAccepted([
      ...insuranceAccepted,
      { provider: newProvider.trim(), policyTypes: [] },
    ]);
    setNewProvider("");
  };

  const removeProvider = (index: number) => {
    setInsuranceAccepted(insuranceAccepted.filter((_, i) => i !== index));
  };

  const addPolicyType = (providerIndex: number) => {
    if (!newPolicyType.trim()) return;
    const updated = [...insuranceAccepted];
    updated[providerIndex].policyTypes.push(newPolicyType.trim());
    setInsuranceAccepted(updated);
    setNewPolicyType("");
  };

  const removePolicyType = (providerIndex: number, policyIndex: number) => {
    const updated = [...insuranceAccepted];
    updated[providerIndex].policyTypes = updated[
      providerIndex
    ].policyTypes.filter((_, i) => i !== policyIndex);
    setInsuranceAccepted(updated);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-pbold text-white mb-2">
          Insurance Providers
        </Text>
        <Text className="text-sky-200/70 text-sm font-pregular">
          Add insurance providers you accept (optional)
        </Text>
      </View>

      {/* Add New Provider */}
      <View className="bg-white/5 border border-white/10 rounded-2xl p-4 gap-3">
        <Text className="text-white/70 font-pmedium text-sm">
          Add Insurance Provider
        </Text>
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 bg-white/5 border border-white/20 rounded-xl p-3 text-white font-pregular"
            placeholder="Provider name (e.g., ICICI Lombard)"
            placeholderTextColor="rgba(186, 230, 253, 0.4)"
            value={newProvider}
            onChangeText={setNewProvider}
            onSubmitEditing={addProvider}
          />
          <TouchableOpacity
            onPress={addProvider}
            className="bg-sky-500 rounded-xl px-4 justify-center"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Insurance Providers List */}
      {insuranceAccepted.length > 0 && (
        <View className="gap-3">
          {insuranceAccepted.map((insurance, providerIndex) => (
            <Animated.View
              key={providerIndex}
              entering={FadeInDown}
              exiting={FadeOut}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 gap-3"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2 flex-1">
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={20}
                    color={colors.sky[400]}
                  />
                  <Text className="text-white font-pmedium flex-1">
                    {insurance.provider}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeProvider(providerIndex)}
                  className="p-2"
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={20}
                    color={colors.rose[400]}
                  />
                </TouchableOpacity>
              </View>

              {/* Policy Types */}
              <View className="gap-2">
                <Text className="text-white/50 text-xs font-pregular">
                  Policy Types
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {insurance.policyTypes.map((policy, policyIndex) => (
                    <View
                      key={policyIndex}
                      className="bg-sky-500/20 border border-sky-500/50 rounded-full px-3 py-1.5 flex-row items-center gap-2"
                    >
                      <Text className="text-sky-400 text-xs font-pmedium">
                        {policy}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          removePolicyType(providerIndex, policyIndex)
                        }
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={14}
                          color={colors.sky[400]}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {/* Add Policy Type */}
                <View className="flex-row gap-2 mt-1">
                  <TextInput
                    className="flex-1 bg-white/5 border border-white/20 rounded-lg p-2 text-white text-sm font-pregular"
                    placeholder="Add policy type"
                    placeholderTextColor="rgba(186, 230, 253, 0.4)"
                    value={newPolicyType}
                    onChangeText={setNewPolicyType}
                    onSubmitEditing={() => addPolicyType(providerIndex)}
                  />
                  <TouchableOpacity
                    onPress={() => addPolicyType(providerIndex)}
                    className="bg-sky-500/20 rounded-lg px-3 justify-center"
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="plus"
                      size={18}
                      color={colors.sky[400]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      )}

      {insuranceAccepted.length === 0 && (
        <View className="bg-white/5 border border-white/10 rounded-2xl p-6 items-center">
          <MaterialCommunityIcons
            name="shield-off-outline"
            size={48}
            color={colors.white}
            style={{ opacity: 0.3 }}
          />
          <Text className="text-white/50 text-sm font-pregular mt-2">
            No insurance providers added yet
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default ClinicInsurance;
