import { View, Text, ScrollView, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import useLoadingAndDialog from "../../../components/Utility/useLoadingAndDialog";
import { ActivityIndicator, Chip } from "react-native-paper";
import colors from "../../../constants/colors";
import CustomBtn from "./../../../components/CustomBtn.jsx";
import { useUserDataState } from "./../../../atoms/store";
const QuestionScreen = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { categoryId, title } = useLocalSearchParams();
  const [UserData, setUserData] = useUserDataState();

  const [questionIndex, setquestionIndex] = useState(0);
  const [Questions, setQuestions] = useState([]);
  const [CurrentPage, setCurrentPage] = useState(0);
  const QuestionsPerPage = 2;
  const { IsLoading, setIsLoading } = useLoadingAndDialog();

  const navigation = useNavigation();

  const getQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v/selfTestCategories/questions?categoryId=${categoryId}`
      );
      setQuestions(response.data.Questions);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: title,
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontFamily: "OpenSans-Bold",
        fontSize: 18,
        color: "#03045e",
        // letterSpacing: 1.2,
      },
    });
    getQuestion();
  }, []);

  const [SelectedOptions, setSelectedOptions] = useState({});
  const [ShowResult, setShowResult] = useState(false);

  const handleOptionSelect = (questionId, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleNextPage = () => {
    if ((CurrentPage + 1) * QuestionsPerPage >= Questions.length) {
      if (Object.keys(SelectedOptions).length === Questions.length) {
        setShowResult(true);
      } else {
        alert("Please answer all questions");
      }
      // setShowResult(true);
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleSubmitResult = async () => {
    const result = await axios.post(
      `${apiUrl}/api/v/selfTest/results`,
      { userId: UserData._id,categoryId,testResult: SelectedOptions }  
    );
    console.log(result.data);
  };

  // console.log("SelectedOptions", Object.keys(SelectedOptions));

  return (
    // <SafeAreaView className="h-full">
    <ScrollView
      contentContainerStyle={{
        width: "100vw",
        // backgroundColor: "#fff",
      }}
    >
      {ShowResult ? (
        <View className=" flex-1 p-4 items-center justify-between ">
          {Object.keys(SelectedOptions).map((key, i) => {
            return (
              <View className=" mb-4 w-full gap-4 " key={key}>
                <Text className="font-osbold text-lg text-black-300 ">
                  {i + 1}. {key}
                </Text>
                <Text className="font-ossemibold text-md ">
                  {" "}
                  &rarr; {SelectedOptions[key]}
                </Text>
              </View>
            );
          })}
          <CustomBtn
            title="Submit"
            iconName="check"
            handlePress={() =>
              // router.push("/(Self-Test)/result", { SelectedOptions, Questions })
              handleSubmitResult()
            }
          />
        </View>
      ) : IsLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View className=" flex-1 p-4 items-center justify-between ">
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
                  <Text className=" text-2xl text-center font-osbold mb- text-black-300 ">
                    {i + 1}. {Question.text}
                  </Text>
                  <View className=" flex-row flex-wrap justify-around w-full gap-3 ">
                    {Question.options &&
                      Question.options.map((option, i) => {
                        return (
                          <Chip
                            key={option}
                            onPress={() =>
                              handleOptionSelect(Question.text, option)
                            }
                            selected={SelectedOptions[Question.text] === option}
                            // mode="outlined"
                            // compact
                            elevated
                            elevation={3}
                            className={`rounded-full mb-2 py- ${
                              Question.options.length <= 2 ? "w-48" : "w-11/12"
                            }`}
                            selectedColor={colors.white[100]}
                            style={{
                              backgroundColor:
                                SelectedOptions[Question.text] === option
                                  ? colors.accent["DEFAULT"] // Change background color when selected
                                  : colors.secondary[200],
                              borderRadius: 50,
                              paddingVertical: 6,
                              // width: "90%",
                            }}
                            textStyle={{
                              color:
                                SelectedOptions[Question.text] === option
                                  ? colors.white[100] // Change text color when selected
                                  : colors.black[300], // Change text color when selected
                              fontFamily: "OpenSans-SemiBold",
                              fontSize: 14,
                            }}
                          >
                            {/* <View className=" overflow-hidden bg-violet-400 align-center">  */}
                            <Text
                              className="font-ossemibold text-center leading-5 text-white-300  "
                              numberOfLines={1}
                              adjustsFontSizeToFit
                            >
                              {String.fromCharCode(65 + i)}. {option}
                            </Text>
                            {/* </View> */}
                          </Chip>
                        );
                      })}
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
    // </SafeAreaView>
  );
};

export default QuestionScreen;
