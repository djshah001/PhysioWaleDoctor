import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Divider, RadioButton } from "react-native-paper";
import colors from "../../constants/colors";
import { SheetManager } from "react-native-actions-sheet";
const FiltersComp = ({ sheetId, filters, appliedFilters }) => {
  const Decamelize = (str) => {
    return str
      .replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
      .replace(/^./, function (match) {
        return match.toUpperCase();
      }) // Capitalize the first letter
      .trim(); // Remove any leading or trailing spaces
  };

  const [ActiveFilter, setActiveFilter] = useState("");
  const [AppliedFilters, setAppliedFilters] = useState(appliedFilters || {});

  useEffect(() => {
    const firstFilterKey = Object.keys(filters)[0];
    if (firstFilterKey) {
      setActiveFilter(firstFilterKey);
    }
  }, [filters]);

  const updateAppliedFilter = (item) => {
    setAppliedFilters((prevFilters) => {
      const currentFilter = prevFilters[ActiveFilter] || [];
      const updatedFilter = currentFilter.includes(item._id)
        ? currentFilter.filter((id) => id !== item._id)
        : [...currentFilter, item._id];
      return {
        ...prevFilters,
        [ActiveFilter]: updatedFilter,
      };
    });
  };

  console.log(AppliedFilters);

  return (
    <View className="gap-5 justify-around ">
      <Text className="font-bold text-xl text-center" title="">
        Filters
      </Text>
      <Divider
        bold={true}
        style={{
          backgroundColor: colors.blueishGreen["400"],
        }}
      />
      <View className=" flex-row items-center justify-between ">
        <View className=" border-r">
          {Object.keys(filters).map((filter, i) => {
            return (
              <View key={i} className="flex-col items-center ">
                <TouchableOpacity
                  className={` ${
                    ActiveFilter === filter
                      ? "bg-secondary- border-l-2 border-secondary-300 "
                      : "bg-white-50 "
                  } p-4 my-2 rounded-lg  `}
                  onPress={() => {
                    setActiveFilter(filter);
                  }}
                >
                  <Text
                    className={`font-semibold text-lg leading-7 tracking-wide`}
                  >
                    {Decamelize(filter)}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <ScrollView contentContainerClassName=" bg-purple-30 self-center ">
          {filters[ActiveFilter]?.map((item, i) => {
            return (
              <View key={item._id} className="flex-row">
                <RadioButton
                  value={item._id}
                  status={
                    AppliedFilters[ActiveFilter]?.includes(item._id)
                      ? "checked"
                      : "unchecked"
                  }
                  color={colors.accent["DEFAULT"]}
                  onPress={() => updateAppliedFilter(item)}
                />
                <Text
                  className={`font-semibold text-lg leading-7 tracking-wide capitalize self-center `}
                >
                  {item.name}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View className="flex-row gap-4 justify-center ">
        <Button mode="outlined" style={{ padding: 5 }}>
          <Text
            className={`font-ossemibold text-xl leading-6 tracking-wide text-black-200 `}
            onPress={() => {
              SheetManager.hide(sheetId);
            }}
          >
            cancel
          </Text>
        </Button>
        <Button
          mode="elevated"
          buttonColor={colors.secondary[300]}
          style={{ padding: 5 }}
          onPress={() => {
            SheetManager.hide(sheetId, {
              payload: AppliedFilters,
            });
            console.log(sheetId);
          }}
        >
          <Text
            className={`font-ossemibold text-xl leading-6 tracking-wide text-white-400 `}
          >
            Apply
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default FiltersComp;
