import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

interface Country {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
}

interface CustomCountryPickerProps {
  countryCode: string;
  countryFlag: string;
  onSelect: (country: {
    dial_code: string;
    flag: string;
    code: string;
    name: string;
  }) => void;
}

// Common countries data
const COUNTRIES: Country[] = [
  { name: "India", dial_code: "+91", code: "IN", flag: "🇮🇳" },
  { name: "United States", dial_code: "+1", code: "US", flag: "🇺🇸" },
  { name: "United Kingdom", dial_code: "+44", code: "GB", flag: "🇬🇧" },
  { name: "Canada", dial_code: "+1", code: "CA", flag: "🇨🇦" },
  { name: "Australia", dial_code: "+61", code: "AU", flag: "🇦🇺" },
  { name: "Germany", dial_code: "+49", code: "DE", flag: "🇩🇪" },
  { name: "France", dial_code: "+33", code: "FR", flag: "🇫🇷" },
  { name: "Japan", dial_code: "+81", code: "JP", flag: "🇯🇵" },
  { name: "China", dial_code: "+86", code: "CN", flag: "🇨🇳" },
  { name: "Brazil", dial_code: "+55", code: "BR", flag: "🇧🇷" },
  { name: "Russia", dial_code: "+7", code: "RU", flag: "🇷🇺" },
  { name: "South Korea", dial_code: "+82", code: "KR", flag: "🇰🇷" },
  { name: "Mexico", dial_code: "+52", code: "MX", flag: "🇲🇽" },
  { name: "Spain", dial_code: "+34", code: "ES", flag: "🇪🇸" },
  { name: "Italy", dial_code: "+39", code: "IT", flag: "🇮🇹" },
  { name: "Netherlands", dial_code: "+31", code: "NL", flag: "🇳🇱" },
  { name: "Switzerland", dial_code: "+41", code: "CH", flag: "🇨🇭" },
  { name: "Sweden", dial_code: "+46", code: "SE", flag: "🇸🇪" },
  { name: "Singapore", dial_code: "+65", code: "SG", flag: "🇸🇬" },
  { name: "UAE", dial_code: "+971", code: "AE", flag: "🇦🇪" },
  { name: "Saudi Arabia", dial_code: "+966", code: "SA", flag: "🇸🇦" },
  { name: "South Africa", dial_code: "+27", code: "ZA", flag: "🇿🇦" },
  { name: "New Zealand", dial_code: "+64", code: "NZ", flag: "🇳🇿" },
  { name: "Pakistan", dial_code: "+92", code: "PK", flag: "🇵🇰" },
  { name: "Bangladesh", dial_code: "+880", code: "BD", flag: "🇧🇩" },
];

const POPULAR_COUNTRIES = ["IN", "US", "GB", "CA", "AU"];

const CustomCountryPicker: React.FC<CustomCountryPickerProps> = ({
  countryCode,
  countryFlag,
  onSelect,
}) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = searchQuery
    ? COUNTRIES.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.dial_code.includes(searchQuery) ||
          country.code.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : COUNTRIES;

  const popularCountries = COUNTRIES.filter((c) =>
    POPULAR_COUNTRIES.includes(c.code),
  );

  const handleSelect = (country: Country) => {
    onSelect({
      dial_code: country.dial_code,
      flag: country.flag,
      code: country.code,
      name: country.name,
    });
    setVisible(false);
    setSearchQuery("");
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className="flex-row items-center justify-between px-5 py-4 border-b border-white/5"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center gap-3">
        <Text className="text-2xl">{item.flag}</Text>
        <View>
          <Text className="text-white text-base font-pmedium">{item.name}</Text>
          <Text className="text-white/50 text-sm">{item.code}</Text>
        </View>
      </View>
      <Text className="text-sky-400 text-base font-psemibold">
        {item.dial_code}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="flex-row items-center justify-center gap-2 px-2"
        activeOpacity={0.7}
      >
        <Text className="text-xl">{countryFlag}</Text>
        <Text className="text-white text-base font-psemibold">
          {countryCode}
        </Text>
        <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="none"
        transparent
        onRequestClose={() => setVisible(false)}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/60"
          onPress={() => setVisible(false)}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className="flex-1"
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="flex-1 justify-end"
            >
              <Animated.View
                entering={SlideInDown.duration(300).springify()}
                exiting={SlideOutDown.duration(200)}
                className="bg-slate-950 rounded-t-3xl overflow-hidden"
                style={{ maxHeight: "85%" }}
              >
                {/* Header */}
                <View className="px-5 pt-6 pb-4 border-b border-white/10">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-white text-xl font-pbold">
                      Select Country
                    </Text>
                    <TouchableOpacity
                      onPress={() => setVisible(false)}
                      className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={20} color="white" />
                    </TouchableOpacity>
                  </View>

                  {/* Search Input */}
                  <BlurView
                    tint="systemChromeMaterialLight"
                    intensity={30}
                    className="rounded-2xl overflow-hidden border border-white/10"
                  >
                    <View className="flex-row items-center px-4 py-3">
                      <Ionicons
                        name="search"
                        size={20}
                        color="rgba(255,255,255,0.5)"
                      />
                      <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search country..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        className="flex-1 ml-3 text-white text-base font-pregular"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {searchQuery.length > 0 && (
                        <TouchableOpacity
                          onPress={() => setSearchQuery("")}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="close-circle"
                            size={18}
                            color="rgba(255,255,255,0.5)"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </BlurView>
                </View>

                {/* Popular Countries */}
                {!searchQuery && (
                  <View className="px-5 py-4 border-b border-white/5">
                    <Text className="text-white/50 text-sm font-pmedium mb-3">
                      POPULAR
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {popularCountries.map((country) => (
                        <TouchableOpacity
                          key={country.code}
                          onPress={() => handleSelect(country)}
                          className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                          activeOpacity={0.7}
                        >
                          <Text className="text-lg">{country.flag}</Text>
                          <Text className="text-white text-sm font-pmedium">
                            {country.dial_code}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Countries List */}
                <FlatList
                  data={filteredCountries}
                  keyExtractor={(item) => item.code}
                  renderItem={renderCountryItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListEmptyComponent={
                    <View className="py-20 items-center">
                      <Ionicons
                        name="search-outline"
                        size={48}
                        color="rgba(255,255,255,0.2)"
                      />
                      <Text className="text-white/50 text-base font-pmedium mt-4">
                        No countries found
                      </Text>
                    </View>
                  }
                />
              </Animated.View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

export default CustomCountryPicker;
