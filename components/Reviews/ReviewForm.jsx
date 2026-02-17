import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { AirbnbRating } from "react-native-ratings";
import axios from "axios";
import { apiUrl } from "../Utility/Repeatables";
import { useToastSate, useUserDataState } from "../../atoms/store";
import colors from "../../constants/colors";
import GradientCard from "../ui/GradientCard";
import CustomBtn from "../CustomBtn";

const ReviewForm = ({
  clinicId,
  appointmentId,
  onReviewSubmitted,
  existingReview = null,
}) => {
  const [userData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || "",
    comment: existingReview?.comment || "",
    serviceQuality: existingReview?.serviceQuality || 0,
    facilities: existingReview?.facilities || 0,
    staffBehavior: existingReview?.staffBehavior || 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingReview) {
      setFormData({
        rating: existingReview.rating || 0,
        title: existingReview.title || "",
        comment: existingReview.comment || "",
        serviceQuality: existingReview.serviceQuality || 0,
        facilities: existingReview.facilities || 0,
        staffBehavior: existingReview.staffBehavior || 0,
      });
    }
  }, [existingReview]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rating || formData.rating < 1) {
      newErrors.rating = "Please provide an overall rating";
    }

    if (formData.title && formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (formData.comment && formData.comment.length > 500) {
      newErrors.comment = "Comment cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        clinicId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        serviceQuality: formData.serviceQuality || formData.rating,
        facilities: formData.facilities || formData.rating,
        staffBehavior: formData.staffBehavior || formData.rating,
      };

      if (appointmentId) {
        payload.appointmentId = appointmentId;
      }

      const endpoint = existingReview
        ? `${apiUrl}/api/v/reviews/${existingReview._id}`
        : `${apiUrl}/api/v/reviews`;

      const method = existingReview ? "put" : "post";

      const response = await axios({
        method,
        url: endpoint,
        data: payload,
        headers: {
          Authorization: `Bearer ${userData?.authToken || userData?.token}`,
        },
      });

      if (response.data.success) {
        setToast({
          message: existingReview
            ? "Review updated successfully"
            : "Review submitted successfully",
          visible: true,
          type: "success",
        });

        if (onReviewSubmitted) {
          onReviewSubmitted(response.data.data);
        }

        // Reset form if it's a new review
        if (!existingReview) {
          setFormData({
            rating: 0,
            title: "",
            comment: "",
            serviceQuality: 0,
            facilities: 0,
            staffBehavior: 0,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error.response?.data || error);
      setToast({
        message: error.response?.data?.message || "Failed to submit review",
        visible: true,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientCard
      variant={existingReview ? "accentGlass" : "secondary2"}
      style={{ marginBottom: 16 }}
      contentStyle={{ padding: 16 }}
      animationProps={{
        from: { opacity: 0, translateY: 10 },
        animate: { opacity: 1, translateY: 0 },
        transition: { type: "timing", duration: 500 },
      }}
    >
      <View className="flex-row items-center mb-4">
        <View className="bg-accent-100 rounded-full p-2 mr-3">
          <Icon
            source={existingReview ? "pencil-plus" : "star-plus"}
            size={20}
            color={colors.accent[600]}
          />
        </View>
        <View>
          <Text className="text-lg font-pbold text-white-200 leading-5">
            {existingReview ? "Edit Your Review" : "Write a Review"}
          </Text>
          <Text className="text-xs text-white-200">
            {existingReview
              ? "Update your feedback about this clinic"
              : "Share your experience with others"}
          </Text>
        </View>
      </View>

      <ScrollView>
        {/* Overall Rating */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Text className="font-ossemibold text-sm text-white-200">
              Overall Rating
            </Text>
            <Text className="text-red-500 ml-1">*</Text>
            <Text className="text-xs text-white-200 ml-auto">
              {formData.rating > 0 ? `${formData.rating}/5` : "Tap to rate"}
            </Text>
          </View>
          <AirbnbRating
            count={5}
            defaultRating={formData.rating}
            size={30}
            // showRating={false}
            onFinishRating={(rating) => handleChange("rating", rating)}
            selectedColor={colors.warning}
            isDisabled={false}
          />
          {errors.rating && (
            <Text className="text-red-500 text-xs mt-1">{errors.rating}</Text>
          )}
        </View>

        {/* Title */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Text className="font-ossemibold text-sm text-white-200">
              Title
            </Text>
            <Text className="text-xs text-white-200 ml-auto">
              {formData.title.length}/100
            </Text>
          </View>
          <View className="bg-primary-50 rounded-lg overflow-hidden">
            <View className="flex-row items-center border-l-4 border-primary-400">
              <TextInput
                className="p-3 flex-1"
                placeholder="Summarize your experience"
                value={formData.title}
                onChangeText={(text) => handleChange("title", text)}
                maxLength={100}
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>
          {errors.title && (
            <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>
          )}
        </View>

        {/* Comment */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Text className="font-ossemibold text-sm text-white-200">
              Your Review
            </Text>
            <Text className="text-xs text-white-200 ml-auto">
              {formData.comment.length}/500
            </Text>
          </View>
          <View className="bg-primary-50 rounded-lg overflow-hidden">
            <View className="flex-row border-l-4 border-primary-400">
              <TextInput
                className="p-3 flex-1"
                placeholder="Share your experience at this clinic"
                value={formData.comment}
                onChangeText={(text) => handleChange("comment", text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
                placeholderTextColor={colors.gray[400]}
                style={{ minHeight: 100 }}
              />
            </View>
          </View>
          {errors.comment && (
            <Text className="text-red-500 text-xs mt-1">{errors.comment}</Text>
          )}
        </View>

        {/* Detailed Ratings */}
        <View className="mb-6">
          <Text className="font-ossemibold text-sm text-white-200 mb-3">
            Rate Specific Aspects (Optional)
          </Text>

          <View className="rounded-lg overflow-hidden mb-4">
            {/* Service Quality */}
            <View className="p-3 border-b border-primary-100">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center gap-2 ">
                  <View className="bg-primary-100 rounded-full p-2">
                    <Icon
                      source="medical-bag"
                      size={18}
                      color={colors.primary[600]}
                      style={{ marginRight: 8 }}
                    />
                  </View>
                  <Text className="font-osregular text-sm text-white-200">
                    Service Quality
                  </Text>
                </View>
                <Text className="font-ossemibold text-xs text-primary-600">
                  {formData.serviceQuality || 0}/5
                </Text>
              </View>
              <AirbnbRating
                count={5}
                defaultRating={formData.serviceQuality}
                size={20}
                showRating={false}
                onFinishRating={(rating) =>
                  handleChange("serviceQuality", rating)
                }
                selectedColor={colors.warning}
                isDisabled={false}
                starContainerStyle={{ alignItems: "flex-start" }}
              />
            </View>

            {/* Facilities */}
            <View className="p-3 border-b border-primary-100">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center gap-2 ">
                  <View className="bg-primary-100 rounded-full p-2">
                    <Icon
                      source="hospital-building"
                      size={18}
                      color={colors.primary[600]}
                      style={{ marginRight: 8 }}
                    />
                  </View>
                  <Text className="font-osregular text-sm text-white-200">
                    Facilities
                  </Text>
                </View>
                <Text className="font-ossemibold text-xs text-primary-600">
                  {formData.facilities || 0}/5
                </Text>
              </View>
              <AirbnbRating
                count={5}
                defaultRating={formData.facilities}
                size={20}
                showRating={false}
                onFinishRating={(rating) => handleChange("facilities", rating)}
                selectedColor={colors.warning}
                isDisabled={false}
                starContainerStyle={{ alignItems: "flex-start" }}
              />
            </View>

            {/* Staff Behavior */}
            <View className="p-3">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center gap-2 ">
                  <View className="bg-primary-100 rounded-full p-2">
                    <Icon
                      source="account-group"
                      size={18}
                      color={colors.primary[600]}
                      style={{ marginRight: 8 }}
                    />
                  </View>
                  <Text className="font-osregular text-sm text-white-200">
                    Staff Behavior
                  </Text>
                </View>
                <Text className="font-ossemibold text-xs text-primary-600">
                  {formData.staffBehavior || 0}/5
                </Text>
              </View>
              <AirbnbRating
                count={5}
                defaultRating={formData.staffBehavior}
                size={20}
                showRating={false}
                onFinishRating={(rating) =>
                  handleChange("staffBehavior", rating)
                }
                selectedColor={colors.warning}
                isDisabled={false}
                starContainerStyle={{ alignItems: "flex-start" }}
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <CustomBtn
          title="Submit Review"
          handlePress={handleSubmit}
          loading={loading}
          className="rounded-xl"
          useGradient
          gradientColors={colors.gradients.success}
        />
      </ScrollView>
    </GradientCard>
  );
};

export default ReviewForm;
