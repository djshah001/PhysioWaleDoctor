import React from "react";
import { View, Text, ScrollView } from "react-native";
import { CustomChip } from "../../components/ReUsables/CustomChip.jsx";

/**
 * ClinicFilterChips component displays filter options for clinics
 * 
 * @param {Object} props - Component props
 * @param {string} props.selectedFilter - Currently selected filter
 * @param {Function} props.setSelectedFilter - Function to update selected filter
 * @returns {JSX.Element} - Rendered component
 */
const ClinicFilterChips = ({ selectedFilter, setSelectedFilter }) => {
  return (
    <View className="px-4 py-2 overflow-hidden mb-2">
      <Text className="font-pbold text-base text-black-700 mb-2">
        Filter Clinics
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 4,
        }}
      >
        <CustomChip
          selected={selectedFilter === "all"}
          text="All Clinics"
          iconName="view-list"
          onPress={() => setSelectedFilter("all")}
          otherStyles="rounded-full"
        />
        <CustomChip
          selected={selectedFilter === "active"}
          text="Most Active"
          iconName="chart-line"
          onPress={() => setSelectedFilter("active")}
          otherStyles="rounded-full"
        />
        <CustomChip
          selected={selectedFilter === "revenue"}
          text="Highest Revenue"
          iconName="currency-inr"
          onPress={() => setSelectedFilter("revenue")}
          otherStyles="rounded-full"
        />
        <CustomChip
          selected={selectedFilter === "rated"}
          text="Best Rated"
          iconName="star"
          onPress={() => setSelectedFilter("rated")}
          otherStyles="rounded-full"
        />
      </ScrollView>
    </View>
  );
};

export default ClinicFilterChips;
