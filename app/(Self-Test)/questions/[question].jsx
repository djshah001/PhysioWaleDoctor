import { View, Text, ScrollView, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import useLoadingAndDialog from "../../../components/Utility/useLoadingAndDialog";
import {
  ActivityIndicator,
  Appbar,
  Checkbox,
  Chip,
  RadioButton,
} from "react-native-paper";
import colors from "../../../constants/colors";
import CustomBtn from "./../../../components/CustomBtn.jsx";
import { useToastSate, useUserDataState } from "./../../../atoms/store";
import { apiUrl } from "../../../components/Utility/Repeatables";
import CustomInput from "../../../components/ReUsables/CustomInput";
import { cssInterop, remapProps } from "nativewind";
cssInterop(Checkbox.Item, {
  className: { target: "style" },
});
cssInterop(RadioButton.Item, {
  className: { target: "style" },
});
cssInterop(Appbar.Header, {
  className: { target: "style" },
});
const QuestionScreen = () => {
  const { categoryId, title } = useLocalSearchParams();
  const [UserData, setUserData] = useUserDataState();

  const [questionIndex, setquestionIndex] = useState(0);
  const [Questions, setQuestions] = useState([]);
  const [CurrentPage, setCurrentPage] = useState(0);
  const QuestionsPerPage = 2;
  const { IsLoading, setIsLoading } = useLoadingAndDialog();
  const [Toast, setToast] = useToastSate(false);

  const getQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v/self-test/questions/by-category?id=${categoryId}`
      );
      setQuestions(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error.response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // navigation.setOptions({
    //   title: title,
    //   headerTitleAlign: "center",
    //   headerTitleStyle: {
    //     fontFamily: "OpenSans-Bold",
    //     fontSize: 18,
    //     color: "#03045e",
    //     // letterSpacing: 1.2,
    //   },
    // });
    getQuestion();
  }, []);

  const [SelectedOptions, setSelectedOptions] = useState({});
  const [ShowResult, setShowResult] = useState(false);

  const handleOptionSelect = (question, option) => {
    setSelectedOptions((prev) => {
      const updatedOptions = { ...prev };
      if (question.answerType === "Text") {
        updatedOptions[question.text] = option;
      } else if (question.answerType === "Select One") {
        updatedOptions[question.text] = option;
      } else if (question.answerType === "Select Any") {
        if (!updatedOptions[question.text]) {
          updatedOptions[question.text] = [];
        }
        if (updatedOptions[question.text].includes(option)) {
          updatedOptions[question.text] = updatedOptions[question.text].filter(
            (opt) => opt !== option
          );
        } else {
          updatedOptions[question.text].push(option);
        }
      }
      return updatedOptions;
    });
  };

  const handleNextPage = () => {
    if ((CurrentPage + 1) * QuestionsPerPage >= Questions.length) {
      if (Object.keys(SelectedOptions).length === Questions.length) {
        setShowResult(true);
      } else {
        setToast({
          message: "Please answer all questions",
          visible: true,
          type: "error",
        });
      }
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleSubmitResult = async () => {
    const result = await axios.post(`${apiUrl}/api/v/selfTest/results`, {
      userId: UserData._id,
      categoryId,
      testResult: SelectedOptions,
    });
    console.log(result.data);
  };

  // console.log("SelectedOptions", Object.keys(SelectedOptions));

  if (ShowResult) {
    return (
      <SafeAreaView className="h-full bg-white-300 ">
        <Appbar.Header
          mode="center-aligned"
          className=" mt-[-25px] bg-white-300 "
        >
          <Appbar.BackAction
            onPress={() => {
              setShowResult(false);
            }}
          />
          <Appbar.Content
            title={
              <Text className="text-xl font-psemibold text-black-200 capitalize ">
                Test Result
              </Text>
            }
          />
        </Appbar.Header>
        <ScrollView contentContainerClassName="flex-grow px-4 w-full h-scree justify-around self-center gap-2 ">
          {Object.keys(SelectedOptions).map((key, i) => {
            return (
              <View className=" mb-4 w-full gap-4 " key={key}>
                <Text className="font-osbold text-lg text-black-300 ">
                  {i + 1}. {key}
                </Text>
                <Text className="font-ossemibold text-md ">
                  &rarr; {SelectedOptions[key]}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <View className="w-full px-4 py-2">
          <CustomBtn
            title="Submit"
            iconName="check"
            handlePress={() =>
              // router.push("/(Self-Test)/result", { SelectedOptions, Questions })
              handleSubmitResult()
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white-300">
      <ScrollView contentContainerClassName="w-full flex-grow">
        <Appbar.Header
          mode="center-aligned"
          // safeAreaInsets={{ bottom }}
          elevated={true}
          // elevation={3}
          className=" mt-[-25px] bg-white-300 "
        >
          <Appbar.BackAction
            onPress={() => {
              router.back();
            }}
          />
          <Appbar.Content
            title={
              <Text className="text-xl font-psemibold text-black-200 capitalize ">
                {title}
                {" -test"}
              </Text>
            }
          />
          {/* <Appbar.Action icon="calendar" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} /> */}
        </Appbar.Header>
        {IsLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View className=" flex-1 items-center justify-between p-4">
            {Questions &&
              Questions.slice(
                CurrentPage * QuestionsPerPage,
                (CurrentPage + 1) * QuestionsPerPage
              ).map((Question, i) => {
                return (
                  <View
                    key={Question._id}
                    className=" items-center mb-4 w-full gap-4 "
                  >
                    <Text className=" text-2xl self-start font-osbold mb- text-black-300 ">
                      {Question.text}
                    </Text>

                    <View className=" flex-wrap justify-around gap-1 self-center ">
                      {Question.answerType !== "Text" ? (
                        Question.options.map((option, i) => {
                          if (Question.answerType === "Select One") {
                            return (
                              <RadioButton.Item
                                key={option}
                                label={option}
                                value={option}
                                onPress={() =>
                                  handleOptionSelect(Question, option)
                                }
                                color={colors.accent["DEFAULT"]}
                                status={
                                  SelectedOptions[Question.text] === option
                                    ? "checked"
                                    : "unchecked"
                                }
                              />
                            );
                          }
                          return (
                            <Checkbox.Item
                              key={option}
                              label={option}
                              value={option}
                              status={
                                SelectedOptions[Question.text]?.includes(option)
                                  ? "checked"
                                  : "unchecked"
                              }
                              onPress={() =>
                                handleOptionSelect(Question, option)
                              }
                              color={colors.accent["DEFAULT"]}
                              className="self-center w-full "
                            />
                          );
                        })
                      ) : (
                        <View className=" w-screen px-4 ">
                          <CustomInput
                            placeholder="Enter your answer"
                            value={SelectedOptions[Question.text]}
                            handleChange={(text) =>
                              handleOptionSelect(Question, text)
                            }
                            multiline={true}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            <View className="flex-row justify-between w-full mt-4">
              <CustomBtn
                title="Previous"
                iconName="chevron-left"
                iconFirst={true}
                handlePress={handlePreviousPage}
                disabled={CurrentPage === 0}
              />
              <CustomBtn
                title="Next"
                iconName="chevron-right"
                handlePress={handleNextPage}
                // disabled={
                //   (CurrentPage + 1) * QuestionsPerPage >= Questions.length
                // }
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestionScreen;
