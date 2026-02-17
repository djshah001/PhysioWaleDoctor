import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { PremiumInput } from "~/components/ui/premium/PremiumInput";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Service {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

interface ClinicServicesProps {
  services: Service[];
  setServices: (value: Service[]) => void;
}

const SERVICE_CATEGORIES = [
  "Consultation",
  "Therapy",
  "Diagnostic",
  "Rehabilitation",
  "Wellness",
  "Other",
];

const ClinicServices: React.FC<ClinicServicesProps> = ({
  services,
  setServices,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentService, setCurrentService] = useState<Service>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    category: "Consultation",
  });

  const addOrUpdateService = () => {
    if (!currentService.name.trim()) return;

    if (editingIndex !== null) {
      const updated = [...services];
      updated[editingIndex] = currentService;
      setServices(updated);
      setEditingIndex(null);
    } else {
      setServices([...services, currentService]);
    }

    setCurrentService({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      category: "Consultation",
    });
    setIsAdding(false);
  };

  const editService = (index: number) => {
    setCurrentService(services[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const deleteService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const cancelEdit = () => {
    setCurrentService({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      category: "Consultation",
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Services Offered
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Add services your clinic provides (optional)
        </Text>
      </View>

      {/* Add Service Button */}
      {!isAdding && (
        <TouchableOpacity
          onPress={() => setIsAdding(true)}
          className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex-row items-center justify-center gap-3 active:bg-indigo-100"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="plus-circle"
            size={24}
            color="#4f46e5"
          />
          <Text className="text-indigo-600 font-semibold">Add Service</Text>
        </TouchableOpacity>
      )}

      {/* Add/Edit Service Form */}
      {isAdding && (
        <Animated.View
          entering={FadeInDown}
          className="bg-white border border-gray-200 rounded-2xl p-4 gap-4 shadow-sm"
        >
          <Text className="text-gray-900 font-semibold text-base">
            {editingIndex !== null ? "Edit Service" : "New Service"}
          </Text>

          <PremiumInput
            label="Service Name"
            placeholder="e.g. Initial Consultation"
            value={currentService.name}
            onChangeText={(text) =>
              setCurrentService({ ...currentService, name: text })
            }
          />

          <PremiumInput
            label="Description"
            placeholder="Brief details about the service"
            value={currentService.description}
            onChangeText={(text) =>
              setCurrentService({ ...currentService, description: text })
            }
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <PremiumInput
                label="Duration (mins)"
                placeholder="30"
                value={currentService.duration.toString()}
                onChangeText={(text) =>
                  setCurrentService({
                    ...currentService,
                    duration: parseInt(text) || 0,
                  })
                }
                keyboardType="number-pad"
              />
            </View>

            <View className="flex-1">
              <PremiumInput
                label="Price (₹)"
                placeholder="500"
                value={currentService.price.toString()}
                onChangeText={(text) =>
                  setCurrentService({
                    ...currentService,
                    price: parseFloat(text) || 0,
                  })
                }
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
              Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-2"
            >
              <View className="flex-row gap-2 pb-2">
                {SERVICE_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() =>
                      setCurrentService({ ...currentService, category })
                    }
                    className={`px-4 py-2 rounded-full border ${
                      currentService.category === category
                        ? "bg-indigo-100 border-indigo-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`font-medium text-sm ${
                        currentService.category === category
                          ? "text-indigo-700"
                          : "text-gray-600"
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity
              onPress={cancelEdit}
              className="flex-1 bg-gray-100 border border-gray-200 rounded-xl p-3"
              activeOpacity={0.7}
            >
              <Text className="text-gray-600 font-semibold text-center">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addOrUpdateService}
              className="flex-1 bg-indigo-600 rounded-xl p-3 shadow-sm shadow-indigo-200"
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold text-center">
                {editingIndex !== null ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Services List */}
      {services.length > 0 && (
        <View className="gap-3">
          <Text className="text-gray-800 font-semibold text-base ml-1">
            Added Services ({services.length})
          </Text>
          {services.map((service, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 50)}
              exiting={FadeOut}
              className="bg-white border border-gray-200 rounded-2xl p-4 gap-3 shadow-sm shadow-gray-100"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-2">
                  <Text className="text-gray-900 font-bold text-base">
                    {service.name}
                  </Text>
                  {service.description ? (
                    <Text className="text-gray-500 text-sm font-medium mt-1">
                      {service.description}
                    </Text>
                  ) : null}
                </View>
                <View className="flex-row gap-1">
                  <TouchableOpacity
                    onPress={() => editService(index)}
                    className="p-2 bg-indigo-50 rounded-lg"
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={16}
                      color="#4f46e5"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteService(index)}
                    className="p-2 bg-red-50 rounded-lg"
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={16}
                      color="#ef4444"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row gap-3 border-t border-gray-100 pt-3 mt-1">
                <View className="bg-indigo-50 rounded-lg px-2.5 py-1">
                  <Text className="text-indigo-600 text-xs font-semibold">
                    {service.category}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5 ml-auto">
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color="#6b7280"
                    />
                    <Text className="text-gray-600 text-xs font-medium">
                      {service.duration} mins
                    </Text>
                  </View>
                  <View className="w-[1px] h-3 bg-gray-300 mx-1" />
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={14}
                      color="#6b7280"
                    />
                    <Text className="text-gray-900 text-xs font-bold">
                      {service.price}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      )}

      {services.length === 0 && !isAdding && (
        <View className="bg-gray-50 border border-gray-200 rounded-2xl p-8 items-center border-dashed">
          <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3">
            <MaterialCommunityIcons
              name="medical-bag"
              size={32}
              color="#9ca3af"
            />
          </View>
          <Text className="text-gray-500 text-sm font-medium">
            No services added yet
          </Text>
          <Text className="text-gray-400 text-xs mt-1">
            Tap "Add Service" to get started
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default ClinicServices;
