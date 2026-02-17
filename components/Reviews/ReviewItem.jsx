import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon, Avatar, Button, Divider } from "react-native-paper";
import { MotiView } from "moti";
import { Rating } from "react-native-ratings";
import { formatDistanceToNow } from "date-fns";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/colors";
import GradientCard from "../ui/GradientCard";

const ReviewItem = ({ review, isUserReview, onEdit, onDelete }) => {
  const formattedDate = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
  });

  return (
    <GradientCard
      variant={isUserReview ? "accentGlass" : "glass"}
      style={{ marginBottom: 16 }}
      contentStyle={{ padding: 16 }}
      animationProps={{
        from: { opacity: 0, translateY: 5 },
        animate: { opacity: 1, translateY: 0 },
        transition: { type: "timing", duration: 500, delay: 100 },
      }}
    >
      {/* Header with user info and rating */}
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          <Avatar.Image
            size={40}
            source={{
              uri:
                review.userId?.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userId?.name || "User")}&background=random`,
            }}
          />
          <View className="ml-2">
            <Text className="font-ossemibold text-sm text-gray-800">
              {review.userId?.name || "Anonymous User"}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500">{formattedDate}</Text>
              {review.isVerified && (
                <LinearGradient
                  colors={colors.gradients.primaryGlass}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-row items-center ml-2 px-2 py-0.5 rounded-full"
                >
                  <Icon
                    source="check-circle"
                    size={10}
                    color={colors.primary[400]}
                  />
                  <Text className="text-xs font-ossemibold text-primary-400 ml-0.5">
                    Verified
                  </Text>
                </LinearGradient>
              )}
            </View>
          </View>
        </View>

        <LinearGradient
          colors={
            review.rating >= 4
              ? colors.gradients.success
              : review.rating >= 3
                ? colors.gradients.warning
                : colors.gradients.error
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center px-3 py-1.5 rounded-full"
        >
          <Icon source="star" size={14} color="white" />
          <Text className="font-ossemibold text-sm text-white-400 ml-1">
            {review.rating}
          </Text>
        </LinearGradient>
      </View>

      {/* Review title and content */}
      {review.title && (
        <Text className="font-ossemibold text-base text-gray-800 mt-3">
          {review.title}
        </Text>
      )}

      {review.comment && (
        <Text className="text-sm text-gray-700 mt-2 leading-5">
          {review.comment}
        </Text>
      )}

      {/* Detailed ratings */}
      {(review.serviceQuality || review.facilities || review.staffBehavior) && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <BlurView
            intensity={10}
            tint="light"
            style={{ borderRadius: 12, overflow: "hidden" }}
          >
            <View className="p-3">
              <View className="flex-row items-center mb-2">
                <Icon
                  source="star-box-multiple"
                  size={14}
                  color={colors.accent[600]}
                />
                <Text className="font-ossemibold text-xs text-gray-700 ml-2">
                  Detailed Ratings
                </Text>
              </View>

              <View className="flex-row justify-between">
                {review.serviceQuality > 0 && (
                  <View className="items-center flex-1">
                    <Text className="text-xs text-gray-500">Service</Text>
                    <View className="flex-row items-center">
                      <Icon source="star" size={12} color={colors.warning} />
                      <Text className="text-xs font-ossemibold text-gray-700 ml-1">
                        {review.serviceQuality}
                      </Text>
                    </View>
                  </View>
                )}

                {review.facilities > 0 && (
                  <View className="items-center flex-1">
                    <Text className="text-xs text-gray-500">Facilities</Text>
                    <View className="flex-row items-center">
                      <Icon source="star" size={12} color={colors.warning} />
                      <Text className="text-xs font-ossemibold text-gray-700 ml-1">
                        {review.facilities}
                      </Text>
                    </View>
                  </View>
                )}

                {review.staffBehavior > 0 && (
                  <View className="items-center flex-1">
                    <Text className="text-xs text-gray-500">Staff</Text>
                    <View className="flex-row items-center">
                      <Icon source="star" size={12} color={colors.warning} />
                      <Text className="text-xs font-ossemibold text-gray-700 ml-1">
                        {review.staffBehavior}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </BlurView>
        </View>
      )}

      {/* Clinic response */}
      {review.response && review.response.text && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <BlurView
            intensity={15}
            tint="light"
            style={{ borderRadius: 12, overflow: "hidden" }}
          >
            <View className="p-3">
              <View className="flex-row items-center mb-2">
                <View className="bg-secondary-100 rounded-full p-1 mr-2">
                  <Icon
                    source="reply"
                    size={14}
                    color={colors.secondary[400]}
                  />
                </View>
                <Text className="font-ossemibold text-xs text-gray-700">
                  Clinic Response
                </Text>
              </View>
              <Text className="text-xs text-gray-600 leading-5">
                {review.response.text}
              </Text>
            </View>
          </BlurView>
        </View>
      )}

      {/* Actions for user's own reviews */}
      {isUserReview && (
        <View className="flex-row justify-end mt-3 pt-3 border-t border-gray-100">
          <LinearGradient
            colors={colors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-full overflow-hidden mr-2"
          >
            <Button
              mode="text"
              compact
              onPress={() => onEdit(review)}
              textColor={colors.white[400]}
              icon="pencil"
              contentStyle={{ paddingHorizontal: 8 }}
            >
              Edit
            </Button>
          </LinearGradient>

          <LinearGradient
            colors={colors.gradients.error}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-full overflow-hidden"
          >
            <Button
              mode="text"
              compact
              onPress={() => onDelete(review._id)}
              textColor={colors.white[400]}
              icon="delete"
              contentStyle={{ paddingHorizontal: 8 }}
            >
              Delete
            </Button>
          </LinearGradient>
        </View>
      )}
    </GradientCard>
  );
};

export default ReviewItem;
