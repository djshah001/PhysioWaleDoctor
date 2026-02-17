import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon, ProgressBar } from "react-native-paper";
import { MotiView } from "moti";
import { AirbnbRating, Rating } from "react-native-ratings";
import { BlurView } from "expo-blur";
import colors from "../../constants/colors";
import GradientCard from "../ui/GradientCard";
import { LinearGradient } from "expo-linear-gradient";

const RatingBar = ({ rating, count, total }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  // Get gradient colors based on rating
  const getGradientColors = () => {
    if (rating >= 4) return colors.gradients.success;
    if (rating >= 3) return colors.gradients.warning;
    return colors.gradients.error;
  };

  return (
    <View className="flex-row items-center mb-1.5">
      <View className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center mr-1">
        <Text
          className="text-sm font-ossemibold"
          style={{
            color:
              rating >= 4
                ? colors.success
                : rating >= 3
                  ? colors.warning
                  : colors.error,
          }}
        >
          {rating}
        </Text>
      </View>
      <View className="flex-1 h-2.5 bg-gray-100 rounded-full mx-2 overflow-hidden">
        {percentage > 0 && (
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${percentage}%`,
              height: "100%",
              borderRadius: 4,
            }}
          />
        )}
      </View>
      <Text className="text-right text-xs font-ossemibold text-gray-100">
        {count}
      </Text>
    </View>
  );
};

const AspectRating = ({ label, value, iconName }) => {
  return (
    <View className="items-center flex-1">
      <View className="flex-row items-center mb-1">
        <Icon source={iconName} size={14} color={colors.white[400]} />
        <Text className="text-xs text-white-200 ml-1">{label}</Text>
      </View>
      <View className="flex-row items-center">
        <Icon source="star" size={14} color={colors.warning} />
        <Text className="text-sm font-ossemibold text-white-300 ml-1">
          {value.toFixed(1)}
        </Text>
      </View>
    </View>
  );
};

const ReviewStatistics = ({ statistics }) => {
  if (!statistics) return null;

  const {
    overall,
    reviewCount,
    verifiedCount,
    ratingDistribution,
    aspectRatings,
    recommendationPercent,
  } = statistics;

  const totalReviews = reviewCount || 0;

  return (
    <GradientCard
      variant="secondary"
      style={{ marginBottom: 16 }}
      contentStyle={{ padding: 16 }}
      animationProps={{
        from: { opacity: 0, translateY: 10 },
        animate: { opacity: 1, translateY: 0 },
        transition: { type: "timing", duration: 500 },
      }}
    >
      <View className="flex-row items-center mb-4">
        <View className="bg-primary-100 rounded-full p-2 mr-3">
          <Icon source="star" size={20} color={colors.secondary[300]} />
        </View>
        <View>
          <Text className="text-lg font-pbold text-white-100 leading-5 ">
            Ratings & Reviews
          </Text>
          <Text className="text-xs text-white-200">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"} •{" "}
            {overall.toFixed(1)} average rating
          </Text>
        </View>
      </View>

      <BlurView
        intensity={50}
        // experimentalBlurMethod=""
        tint="light"
        style={{ borderRadius: 16, marginBottom: 16, overflow: "hidden" }}
      >
        <View className="p-4">
          <View className="flex-row justify-between items-center">
            <View className="items-center">
              {/* <View className=" p-3 mb-2">
                <Text className="font-pbold text-3xl text-accent">
                  {overall.toFixed(1)}
                </Text>
              </View> */}
              <AirbnbRating
                size={18}
                isDisabled
                defaultRating={overall + 1}
                reviewColor={colors.info}
                // selectedColor={colors.warning}
                unSelectedColor={colors.white[300]}
              />
            </View>

            <View className="flex-1 ml-6">
              {[5, 4, 3, 2, 1].map((rating) => (
                <RatingBar
                  key={rating}
                  rating={rating}
                  count={ratingDistribution[rating] || 0}
                  total={totalReviews}
                />
              ))}
            </View>
          </View>
        </View>
      </BlurView>

      {/* Recommendation percentage */}
      <BlurView
        intensity={20}
        tint="light"
        style={{ borderRadius: 12, marginBottom: 16, overflow: "hidden" }}
      >
        <View className="p-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-ossemibold text-white-300">
              {recommendationPercent}% of reviewers recommend this clinic
            </Text>
            <Icon
              source={
                recommendationPercent >= 70 ? "thumb-up" : "thumb-up-outline"
              }
              size={18}
              color={
                recommendationPercent >= 70 ? colors.success : colors.white[500]
              }
            />
          </View>
          <ProgressBar
            progress={recommendationPercent / 100}
            color={
              recommendationPercent >= 70 ? colors.success : colors.warning
            }
            style={{ height: 4, borderRadius: 2, marginTop: 6 }}
          />
        </View>
      </BlurView>

      {/* Verified reviews badge */}
      {verifiedCount > 0 && (
        <BlurView
          intensity={15}
          tint="light"
          style={{ borderRadius: 12, marginBottom: 16, overflow: "hidden" }}
        >
          <View className="flex-row items-center p-3">
            <View className="bg-primary-50 rounded-full p-1.5">
              <Icon
                source="check-circle"
                size={14}
                color={colors.primary[400]}
              />
            </View>
            <Text className="text-xs text-gray-700 ml-2 flex-1">
              <Text className="font-ossemibold">{verifiedCount}</Text> verified{" "}
              {verifiedCount === 1 ? "review" : "reviews"} from patients who
              visited this clinic
            </Text>
          </View>
        </BlurView>
      )}

      {/* Aspect ratings */}
      {aspectRatings && (
        <BlurView
          intensity={15}
          tint="light"
          style={{ borderRadius: 12, overflow: "hidden" }}
        >
          <View className="p-3">
            <View className="flex-row items-center mb-3">
              <View className="bg-primary-100 rounded-full p-1.5 mr-2">
                <Icon
                  source="star-box-multiple"
                  size={16}
                  color={colors.secondary[300]}
                />
              </View>
              <Text className="font-ossemibold text-sm text-white-300">
                Detailed Ratings
              </Text>
            </View>

            <View className="flex-row justify-between">
              <AspectRating
                label="Service"
                value={aspectRatings.serviceQuality}
                iconName="medical-bag"
              />

              <AspectRating
                label="Facilities"
                value={aspectRatings.facilities}
                iconName="hospital-building"
              />

              <AspectRating
                label="Staff"
                value={aspectRatings.staffBehavior}
                iconName="account-group"
              />
            </View>
          </View>
        </BlurView>
      )}
    </GradientCard>
  );
};

export default ReviewStatistics;
