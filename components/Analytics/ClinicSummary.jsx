import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  Icon,
  Button,
} from "react-native-paper";
import { router } from "expo-router";
import colors from "../../constants/colors";
import { Image } from "expo-image";

const ClinicSummary = ({ clinics = [], remainingClinicsCount = 0 }) => {
  if (!clinics || clinics.length === 0) {
    return (
      <Card
        className="mx-4 my-2 rounded-xl shadow-sm bg-white-100"
        elevation={2}
      >
        <Card.Content>
          <View className="items-center py-4">
            <Icon
              source="hospital-building"
              size={50}
              color={colors.black["300"]}
            />
            <Title className="font-osbold text-lg text-gray-800 mt-2">
              No Clinics Found
            </Title>
            <Paragraph className="text-center text-gray-600 mt-1">
              You don't have any clinics associated with your account yet.
            </Paragraph>
            <Button
              mode="contained"
              className="mt-4"
              onPress={() => router.push("/clinics/add")}
            >
              Add Clinic
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // console.log(clinics[0]);

  return (
    <Card className="mx-4 my-2 rounded-xl shadow-sm bg-white-100" elevation={2}>
      <Card.Content>
        <View className="flex-row justify-between items-center mb-3">
          <Title className="font-osbold text-lg text-gray-800">
            Your Clinics
          </Title>
          <TouchableOpacity onPress={() => router.push("/Clinic")}>
            <Text className="font-osmedium text-sm text-blue-500">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {clinics.slice(0, 2).map((clinic, index) => (
          <TouchableOpacity
            key={clinic._id || index}
            onPress={() =>
              router.push({
                pathname: `/clinics/${clinic._id}`,
                params: { id: clinic._id },
              })
            }
            className="mb-3"
          >
            <View className="flex-row items-center gap-2 p-4 bg-secondary-100 rounded-lg">
              {/* <Avatar.Icon
                size={40}
                icon="hospital-building"
                backgroundColor={colors.secondary[100]}
                color={colors.secondary[200]}
              /> */}
              <Image
                source={{ uri: clinic.images?.[0] }}
                className="w-12 h-12 rounded-full"
                contentFit="cover"
                placeholder={{ blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6." }}
              />
              <View className="ml-3 flex-1">
                <Text className="font-ossemibold text-base leading-5 text-gray-800">
                  {clinic.name}
                </Text>
                <Text
                  className="font-osregular text-xs text-gray-600"
                  numberOfLines={1}
                >
                  {clinic.address}
                </Text>
              </View>
              <View className="items-end">
                <View className="flex-row items-center">
                  <Icon source="star" size={16} color="#FFD700" />
                  <Text className="ml-1 font-ossemibold text-sm">
                    {clinic.rating?.overall?.toFixed(1) || "New"}
                  </Text>
                </View>
                {/* <Text className="font-osregular text-xs text-gray-600">
                  {clinic.appointmentsCount || 0} appts
                </Text> */}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {
          <Text className="text-center font-osregular text-sm text-gray-600 mt-1">
            +{remainingClinicsCount - clinics.length} more clinics
          </Text>
        }
      </Card.Content>
    </Card>
  );
};

export default ClinicSummary;
