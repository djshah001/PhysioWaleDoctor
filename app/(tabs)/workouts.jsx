import { View, Text, Button } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import {
  Divider,
  Headline,
  IconButton,
  Searchbar,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import colors from "../../constants/colors";
import {
  Dropdown,
  DropdownInput,
  MultiSelectDropdown,
} from "react-native-paper-dropdown";
import axios from "axios";
import Repeatables, { apiUrl } from "../../components/Utility/Repeatables";
import CustomDD from "../../components/ReUsables/CustomDD";

import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import FiltersComp from "../../components/ReUsables/FiltersComp";
import CustomInput from "../../components/ReUsables/CustomInput";
import CustomBtn from "../../components/CustomBtn";

const Workout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [Exercises, setExercises] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [bodyParts, setBodyParts] = useState([]);

  const [filters, setFilters] = useState({});
  const [AppliedFilters, setAppliedFilters] = useState({});

  const [ExerciseData, setExerciseData] = useState({
    name: "",
    bodyParts: "",
    exerciseTypes: "",
    conditions: "",
    description: "ab",
    id: "",
    image: "",
    name: "",
    type: "",
    video: "",
    videoDescription: "",
    videoName: "",
  });

  const fetchFilters = async () => {
    try {
      console.log("apiUrl", apiUrl);
      const res = await axios.get(`${apiUrl}/api/v/exercises/filters`);
      setFilters({
        exerciseTypes: res.data.exerciseTypes,
        bodyParts: res.data.bodyParts,
        conditions: res.data.conditions,
      });
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const changeQueryText = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const openActionSheet = async () => {
    console.log(filters);
    const appliedfilters = await SheetManager.show("global-action-sheet", {
      payload: {
        closeOnBackClick: false,

        content: (
          <FiltersComp
            filters={filters}
            sheetId={"global-action-sheet"}
            appliedFilters={AppliedFilters}
          />
        ),
      },
    });
    console.log(appliedfilters);
    setAppliedFilters(appliedfilters);
    setExerciseData({ ...ExerciseData, ...appliedfilters });
  };

  console.log(ExerciseData.bodyParts.length);

  return (
    <SafeAreaView className="bg-purple-300 flex-1 ">
      <View className="  mt-4 px-8 ">
        <View className="flex-row justify-between items-center gap-2 ">
          <View className=" w-5/6 items-start ">
            <Searchbar
              placeholder="Search Exercise"
              mode="bar"
              className=" "
              traileringIcon="close-circle-outline"
              style={{
                borderWidth: 1,
                backgroundColor: colors.white[100],
                marginBottom: 10,
              }}
              inputStyle={{
                marginVertical: -10,
              }}
              onChangeText={changeQueryText}
              value={searchQuery}
              // loading={IsLoading}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                if (Exercises.length === 0) {
                  setShowSuggestions(false);
                }
              }}
              onTraileringIconPress={() => {
                setShowSuggestions(false);
                Keyboard.dismiss();
              }}
            />
          </View>
          {/* <View className="items-center justify-center " > */}
          <IconButton
            icon="tune-variant"
            size={25}
            className="border-2 "
            style={{ marginTop: -5 }}
            onPress={() => {
              openActionSheet();
            }}
          />
          {/* </View> */}
        </View>
      </View>
      <ScrollView
        // className="px-4"
        contentContainerClassName="flex-grow px-8 w-full h-scree justify-around self-center gap-2 "
      >
        <View>
          <Text>Workouts</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Workout;
