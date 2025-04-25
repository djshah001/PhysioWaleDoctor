import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip, Searchbar, Divider, Appbar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToastSate } from "../../atoms/store.js";
import { apiUrl } from "../../components/Utility/Repeatables.jsx";
import AppointmentCard from "../../components/Appointments/AppointmentCard";
import EmptyState from "../../components/EmptyState";
import colors from "../../constants/colors";
import { CustomChip } from "../../components/ReUsables/CustomChip.jsx";
import { cssInterop } from "nativewind";
import GradientCard from "../../components/UI/GradientCard.jsx";
import { LinearGradient } from "expo-linear-gradient";
import CustomHeader from "../../components/UI/CustomHeader.jsx";

cssInterop(Appbar, { className: "style" });
cssInterop(Searchbar, { className: "style" });

const MyAppointments = () => {
  const router = useRouter();
  const [setToast] = useToastSate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rejected", value: "rejected" },
    { label: "Expired", value: "expired" },
  ];

  const fetchAppointments = useCallback(
    async (pageNum = 1, refresh = false) => {
      try {
        if (refresh) {
          setPage(1);
          pageNum = 1;
        }

        const authToken = await AsyncStorage.getItem("authToken");
        if (!authToken) {
          setToast({
            visible: true,
            message: "Authentication required. Please log in again.",
            type: "error",
          });
          return;
        }

        const response = await axios.get(
          `${apiUrl}/api/v/appointments/doctor/appointments`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            params: {
              page: pageNum,
              limit: 10,
            },
          }
        );

        if (response.data.success) {
          const newAppointments = response.data.data;
          if (refresh) {
            setAppointments(newAppointments);
          } else {
            setAppointments((prev) => [...prev, ...newAppointments]);
          }
          setHasMore(newAppointments.length === 10);
        } else {
          throw new Error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error(
          "Error fetching appointments:",
          error.response?.data || error
        );
        setToast({
          visible: true,
          message: "Failed to fetch appointments",
          type: "error",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments(1, true);
  }, [fetchAppointments]);

  const loadMoreAppointments = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAppointments(nextPage);
    }
  }, [fetchAppointments, hasMore, loading, page]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    // Filter appointments based on search query and selected status
    let filtered = [...appointments];

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === selectedStatus
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (appointment) =>
          (appointment.userId?.name &&
            appointment.userId.name.toLowerCase().includes(query)) ||
          (appointment.clinicId?.name &&
            appointment.clinicId.name.toLowerCase().includes(query)) ||
          (appointment.serviceId?.name &&
            appointment.serviceId.name.toLowerCase().includes(query))
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, selectedStatus]);

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        setToast({
          visible: true,
          message: "Authentication required. Please log in again.",
          type: "error",
        });
        return;
      }

      const response = await axios.patch(
        `${apiUrl}/api/v/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        // Update the appointment in the local state
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );

        setToast({
          visible: true,
          message: `Appointment ${newStatus} successfully`,
          type: "success",
        });
      } else {
        throw new Error("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setToast({
        visible: true,
        message: "Failed to update appointment status",
        type: "error",
      });
    }
  };

  const renderAppointmentItem = ({ item }) => (
    <AppointmentCard
      appointment={item}
      onPress={() => router.push(`/appointments/${item._id}`)}
      onUpdateStatus={(status) => updateAppointmentStatus(item._id, status)}
    />
  );

  const renderEmptyState = () => {
    if (loading) return null;
    return (
      <EmptyState
        icon="calendar-clock"
        title="No appointments found"
        description={
          searchQuery || selectedStatus !== "all"
            ? "Try changing your filters"
            : "You don't have any appointments yet"
        }
      />
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.primary[500]} />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50" edges={["top"]}>
      <CustomHeader
        title="My Appointments"
        gradient={colors.gradients.secondary}
        className="mb-0 pb-4 "
        Children={
          <Appbar.Action
            icon="refresh"
            color={colors.white[400]}
            onPress={onRefresh}
            disabled={refreshing}
          />
        }
        BottomChildren={
          <View className="px-4">
            <Searchbar
              placeholder="Search appointments"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="rounded-xl"
              style={{ backgroundColor: colors.white[100] }}
            />
          </View>
        }
      />

      <View className="py-3 bg-white">
        <FlatList
          horizontal
          data={statusOptions}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <CustomChip
              text={item.label}
              selected={selectedStatus === item.value}
              onPress={() => setSelectedStatus(item.value)}
              // compact
              otherStyles="rounded-full"
              className="rounded-full"
              iconName={selectedStatus === item.value ? "check-all" : null}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      <Divider />

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item._id}
          renderItem={renderAppointmentItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreAppointments}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MyAppointments;
