import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Icon, Chip } from "react-native-paper";
import axios from "axios";
import { apiUrl } from "../Utility/Repeatables";
import { useToastSate, useUserDataState } from "../../atoms/store";
import colors from "../../constants/colors";
import ReviewItem from "./ReviewItem";
import ReviewStatistics from "./ReviewStatistics";
import { CustomChip } from "../ReUsables/CustomChip";

// ReviewItem and ReviewStatistics components are now imported from separate files

const ReviewsList = ({
  clinicId,
  userId,
  showStatistics = true,
  limit = 5,
}) => {
  const [userData] = useUserDataState();
  const [, setToast] = useToastSate();

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: 0,
    pages: 0,
  });

  const [sortOption, setSortOption] = useState("newest");
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = async (page = 1, sort = sortOption) => {
    try {
      setLoading(true);

      const endpoint = userId
        ? `${apiUrl}/api/v/reviews/user?page=${page}&limit=${pagination.limit}`
        : `${apiUrl}/api/v/reviews/clinic/${clinicId}?page=${page}&limit=${pagination.limit}&sort=${sort}`;

      const headers =
        userData?.authToken || userData?.token
          ? {
              Authorization: `Bearer ${userData?.authToken || userData?.token}`,
            }
          : {};

      const response = await axios.get(endpoint, { headers });

      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setPagination(response.data.data.pagination);

        if (showStatistics && response.data.data.statistics) {
          setStatistics(response.data.data.statistics);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error.response?.data || error);
      setToast({
        message: error.response?.data?.message || "Failed to load reviews",
        visible: true,
        type: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [clinicId, userId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReviews(1);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages && !loading) {
      fetchReviews(pagination.page + 1);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    fetchReviews(1, option);
  };

  const handleEditReview = (review) => {
    // This would be handled by the parent component
    console.log("Edit review:", review);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.authToken || userData?.token}`,
          },
        }
      );

      if (response.data.success) {
        setToast({
          message: "Review deleted successfully",
          visible: true,
          type: "success",
        });

        // Refresh reviews
        fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error.response?.data || error);
      setToast({
        message: error.response?.data?.message || "Failed to delete review",
        visible: true,
        type: "error",
      });
    }
  };

  if (loading && !refreshing) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="large" color={colors.primary[400]} />
        <Text className="mt-2 text-gray-500">Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View>
      {showStatistics && statistics && (
        <ReviewStatistics statistics={statistics} />
      )}

      {!userId && (
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-2"
          >
            {["newest", "highest", "lowest"].map((option) => (
              <CustomChip
                key={option}
                text={option}
                selected={sortOption === option}
                onPress={() => handleSortChange(option)}
                iconName={
                  option === "newest"
                    ? "clock-outline"
                    : option === "highest"
                    ? "star"
                    : "star-outline"
                }
              />
            ))}
          </ScrollView>
        </View>
      )}

      {reviews.length === 0 ? (
        <View className="items-center justify-center py-12 bg-white-400 rounded-xl shadow-sm">
          <Icon source="star-outline" size={48} color={colors.gray[300]} />
          <Text className="mt-3 text-gray-500 text-center font-ossemibold">
            No reviews yet
          </Text>
          <Text className="mt-1 text-gray-400 text-center text-sm">
            Be the first to share your experience!
          </Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ReviewItem
              review={item}
              isUserReview={userId ? true : userData?.id === item.userId?._id}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          )}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={
            pagination.page < pagination.pages ? (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color={colors.primary[400]} />
              </View>
            ) : reviews.length > 0 ? (
              <Text className="text-center text-gray-500 py-4 font-osregular">
                No more reviews to load
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default ReviewsList;
