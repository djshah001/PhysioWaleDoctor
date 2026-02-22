import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { MotiView } from "moti";
import colors from "tailwindcss/colors";
import { GradientBackground } from "~/components/ui/premium/GradientBackground";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { appointmentApi } from "~/apis/appointments";
import { PopulatedAppointment, Patient, Clinic, Service } from "~/types/models";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBox = ({
  style,
  className = "",
}: {
  style?: ViewStyle;
  className?: string;
}) => {
  const opacity = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.82,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={[{ opacity }, style]}
      className={`bg-white/50 rounded-2xl ${className}`}
    />
  );
};

const DetailSkeleton = () => (
  <View className="px-4 gap-4 pt-4">
    <View className="flex-row items-center gap-3">
      <SkeletonBox style={{ width: 64, height: 64, borderRadius: 32 }} />
      <View className="gap-2 flex-1">
        <SkeletonBox style={{ width: 150, height: 20 }} />
        <SkeletonBox style={{ width: 100, height: 14 }} />
      </View>
    </View>
    <SkeletonBox style={{ height: 90 }} />
    <SkeletonBox style={{ height: 130 }} />
    <SkeletonBox style={{ height: 80 }} />
  </View>
);

// ─── Info row helper ──────────────────────────────────────────────────────────

const InfoRow = ({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <View className="flex-row items-start gap-3 py-2.5 border-b border-white/20 last:border-0">
    <View className="bg-indigo-50 p-1.5 rounded-lg mt-0.5">
      <Ionicons name={icon} size={14} color="#6366f1" />
    </View>
    <View className="flex-1">
      <Text className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide">
        {label}
      </Text>
      <Text
        className={`text-gray-800 text-sm mt-0.5 ${mono ? "font-mono tracking-widest text-indigo-700 font-bold text-base" : "font-medium"}`}
      >
        {value}
      </Text>
    </View>
  </View>
);

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<
  string,
  { bg: string; text: string; iconColor: string }
> = {
  pending: { bg: "bg-amber-500", text: "text-white", iconColor: "#fff" },
  confirmed: { bg: "bg-indigo-600", text: "text-white", iconColor: "#fff" },
  completed: { bg: "bg-emerald-600", text: "text-white", iconColor: "#fff" },
  cancelled: { bg: "bg-gray-400", text: "text-white", iconColor: "#fff" },
  rejected: { bg: "bg-red-600", text: "text-white", iconColor: "#fff" },
  expired: { bg: "bg-gray-300", text: "text-gray-700", iconColor: "#374151" },
};

const STATUS_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  pending: "time-outline",
  confirmed: "checkmark-circle-outline",
  completed: "ribbon-outline",
  cancelled: "close-circle-outline",
  rejected: "ban-outline",
  expired: "hourglass-outline",
};

// ─── Action bar ───────────────────────────────────────────────────────────────

interface ActionBarProps {
  status: string;
  updating: boolean;
  onAccept: () => void;
  onReject: () => void;
  onComplete: () => void;
}

const ActionBar = ({
  status,
  updating,
  onAccept,
  onReject,
  onComplete,
}: ActionBarProps) => {
  if (updating) {
    return (
      <View className="mx-4 mb-4">
        <GlassCard contentContainerClassName="flex-row items-center justify-center gap-3 py-4">
          <ActivityIndicator color={colors.indigo[600]} />
          <Text className="text-gray-600 font-semibold text-sm">
            Updating status…
          </Text>
        </GlassCard>
      </View>
    );
  }

  if (status === "pending") {
    return (
      <View className="flex-row gap-3 mx-4 mb-4">
        <TouchableOpacity
          onPress={onReject}
          className="flex-1 flex-row items-center justify-center gap-2 bg-red-500 py-3.5 rounded-2xl"
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle-outline" size={18} color="white" />
          <Text className="text-white font-bold text-sm">Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAccept}
          className="flex-1 flex-row items-center justify-center gap-2 bg-emerald-600 py-3.5 rounded-2xl"
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="white" />
          <Text className="text-white font-bold text-sm">Accept</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === "confirmed") {
    return (
      <View className="mx-4 mb-4">
        <TouchableOpacity
          onPress={onComplete}
          className="flex-row items-center justify-center gap-2 bg-indigo-600 py-3.5 rounded-2xl"
          activeOpacity={0.8}
        >
          <Ionicons name="ribbon-outline" size={18} color="white" />
          <Text className="text-white font-bold text-sm">
            Mark as Completed
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [appointment, setAppointment] = useState<PopulatedAppointment | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentApi.getAppointmentById(id);
      setAppointment(data);
    } catch (e) {
      console.error("fetchDetail error:", e);
      setError("Failed to load appointment details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleUpdate = useCallback(
    async (status: "confirmed" | "rejected" | "completed") => {
      const labels = {
        confirmed: "Accept",
        rejected: "Reject",
        completed: "Complete",
      };
      const msg =
        status === "completed"
          ? "Mark this appointment as completed?"
          : `${labels[status]} this appointment?`;

      Alert.alert(labels[status], msg, [
        { text: "Cancel", style: "cancel" },
        {
          text: labels[status],
          style: status === "rejected" ? "destructive" : "default",
          onPress: async () => {
            try {
              setUpdating(true);
              const updated = await appointmentApi.updateStatus(id, status);
              setAppointment(updated);
            } catch {
              Alert.alert("Error", "Failed to update. Please try again.");
            } finally {
              setUpdating(false);
            }
          },
        },
      ]);
    },
    [id],
  );

  // ── Helpers ────────────────────────────────────────────────────────────────

  const patient = appointment
    ? typeof appointment.patient === "object"
      ? (appointment.patient as Patient)
      : null
    : null;
  const clinic = appointment
    ? typeof appointment.clinic === "object"
      ? (appointment.clinic as Clinic)
      : null
    : null;
  const service = appointment
    ? typeof appointment.service === "object"
      ? (appointment.service as Service)
      : null
    : null;

  const formatDt = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const statusCfg = appointment
    ? (STATUS_COLOR[appointment.bookingStatus] ?? STATUS_COLOR.expired)
    : STATUS_COLOR.expired;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <GradientBackground>
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* Top bar */}
        <View className="flex-row items-center px-4 py-3 gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/70 border border-white/40 p-2 rounded-xl"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text
            className="text-lg font-bold text-gray-800 flex-1"
            numberOfLines={1}
          >
            Appointment Details
          </Text>
          {appointment && (
            <View
              className={`px-3 py-1 rounded-full flex-row items-center gap-1.5 ${statusCfg.bg}`}
            >
              <Ionicons
                name={STATUS_ICON[appointment.bookingStatus] ?? "time-outline"}
                size={12}
                color={statusCfg.iconColor}
              />
              <Text
                className={`text-xs font-bold capitalize ${statusCfg.text}`}
              >
                {appointment.bookingStatus}
              </Text>
            </View>
          )}
        </View>

        {/* Error */}
        {error && (
          <View className="mx-4 mb-3">
            <GlassCard contentContainerClassName="flex-row items-center gap-3 p-3">
              <Ionicons name="alert-circle-outline" size={18} color="#dc2626" />
              <Text className="text-red-700 text-sm font-medium flex-1">
                {error}
              </Text>
              <TouchableOpacity onPress={fetchDetail} hitSlop={8}>
                <Text className="text-indigo-600 text-sm font-bold">Retry</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}

        {/* Content */}
        {loading ? (
          <DetailSkeleton />
        ) : appointment ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Patient card */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 350 }}
              className="mx-4 mb-4"
            >
              <GlassCard
                className="rounded-3xl"
                contentContainerClassName="p-4 rounded-3xl"
              >
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                  Patient
                </Text>
                <View className="flex-row items-center gap-3 mb-4">
                  {patient?.profilePic ? (
                    <Image
                      source={{ uri: patient.profilePic }}
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                      className="bg-gray-200"
                    />
                  ) : (
                    <View className="w-[60px] h-[60px] rounded-full bg-indigo-100 items-center justify-center">
                      <Text className="text-indigo-600 font-extrabold text-2xl">
                        {(patient?.name ?? "P").charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base">
                      {patient?.name ?? "—"}
                    </Text>
                    {patient?.gender && (
                      <Text className="text-gray-500 text-sm capitalize mt-0.5">
                        {patient.gender}
                        {patient.DOB
                          ? ` · ${new Date().getFullYear() - new Date(patient.DOB).getFullYear()} yrs`
                          : ""}
                      </Text>
                    )}
                  </View>
                </View>

                {patient?.phoneNumber && (
                  <InfoRow
                    icon="call-outline"
                    label="Phone"
                    value={patient.phoneNumber}
                  />
                )}
                {patient?.email && (
                  <InfoRow
                    icon="mail-outline"
                    label="Email"
                    value={patient.email}
                  />
                )}
              </GlassCard>
            </MotiView>

            {/* Appointment details */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 350, delay: 80 }}
              className="mx-4 mb-4"
            >
              <GlassCard
                className="rounded-3xl"
                contentContainerClassName="p-4 rounded-3xl"
              >
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                  Appointment
                </Text>

                {(() => {
                  const { date, time } = formatDt(appointment.startDateTime);
                  const endTime = new Date(
                    appointment.endDateTime,
                  ).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <>
                      <InfoRow
                        icon="calendar-outline"
                        label="Date"
                        value={date}
                      />
                      <InfoRow
                        icon="time-outline"
                        label="Time"
                        value={`${time} – ${endTime}`}
                      />
                      <InfoRow
                        icon="timer-outline"
                        label="Duration"
                        value={`${appointment.duration ?? service?.duration ?? "—"} min`}
                      />
                      <InfoRow
                        icon={
                          appointment.appointmentType === "In-Clinic"
                            ? "business-outline"
                            : appointment.appointmentType === "Video-Call"
                              ? "videocam-outline"
                              : "home-outline"
                        }
                        label="Type"
                        value={appointment.appointmentType}
                      />
                    </>
                  );
                })()}
              </GlassCard>
            </MotiView>

            {/* Service & clinic */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 350, delay: 140 }}
              className="mx-4 mb-4"
            >
              <GlassCard
                className="rounded-3xl"
                contentContainerClassName="p-4 rounded-3xl"
              >
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                  Service & Clinic
                </Text>
                {service && (
                  <>
                    <InfoRow
                      icon="medkit-outline"
                      label="Service"
                      value={service.name}
                    />
                    {service.category && (
                      <InfoRow
                        icon="folder-outline"
                        label="Category"
                        value={service.category}
                      />
                    )}
                  </>
                )}
                {clinic && (
                  <InfoRow
                    icon="location-outline"
                    label="Clinic"
                    value={clinic.name}
                  />
                )}
              </GlassCard>
            </MotiView>

            {/* Financials */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 350, delay: 200 }}
              className="mx-4 mb-4"
            >
              <GlassCard
                className="rounded-3xl"
                contentContainerClassName="p-4 rounded-3xl"
              >
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                  Payment
                </Text>
                <InfoRow
                  icon="wallet-outline"
                  label="Bill Amount"
                  value={`₹${appointment.billAmount.toLocaleString()}`}
                />
                <InfoRow
                  icon="card-outline"
                  label="Payment Status"
                  value={appointment.paymentStatus}
                />
              </GlassCard>
            </MotiView>

            {/* Symptoms */}
            {appointment.symptoms && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 350, delay: 250 }}
                className="mx-4 mb-4"
              >
                <GlassCard
                  className="rounded-3xl"
                  contentContainerClassName="p-4 rounded-3xl"
                >
                  <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                    Symptoms
                  </Text>
                  <Text className="text-gray-700 text-sm leading-relaxed">
                    {appointment.symptoms}
                  </Text>
                </GlassCard>
              </MotiView>
            )}

            {/* Diagnosis */}
            {appointment.diagnosis && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 350, delay: 290 }}
                className="mx-4 mb-4"
              >
                <GlassCard
                  className="rounded-3xl"
                  contentContainerClassName="p-4 rounded-3xl"
                >
                  <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                    Diagnosis
                  </Text>
                  <Text className="text-gray-700 text-sm leading-relaxed">
                    {appointment.diagnosis}
                  </Text>
                </GlassCard>
              </MotiView>
            )}

            {/* Verification code (doctor only) */}
            {appointment.verificationCode && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 350, delay: 330 }}
                className="mx-4 mb-4"
              >
                <GlassCard
                  className="rounded-3xl"
                  contentContainerClassName="p-4 rounded-3xl"
                >
                  <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                    Patient Verification Code
                  </Text>
                  <Text className="text-indigo-700 font-extrabold text-2xl tracking-[0.3em] text-center py-2">
                    {appointment.verificationCode}
                  </Text>
                  <Text className="text-gray-400 text-xs text-center mt-1">
                    Ask the patient to show this code to check them in
                  </Text>
                </GlassCard>
              </MotiView>
            )}

            {/* Rating */}
            {appointment.rating?.stars && (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 350, delay: 360 }}
                className="mx-4 mb-4"
              >
                <GlassCard
                  className="rounded-3xl"
                  contentContainerClassName="p-4 rounded-3xl"
                >
                  <Text className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                    Patient Rating
                  </Text>
                  <View className="flex-row items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={
                          star <= appointment.rating!.stars
                            ? "star"
                            : "star-outline"
                        }
                        size={22}
                        color={
                          star <= appointment.rating!.stars
                            ? "#f59e0b"
                            : "#d1d5db"
                        }
                      />
                    ))}
                    <Text className="text-gray-700 font-bold text-sm ml-1">
                      {appointment.rating!.stars}/5
                    </Text>
                  </View>
                  {appointment.rating?.comment && (
                    <Text className="text-gray-600 text-sm italic">
                      "{appointment.rating.comment}"
                    </Text>
                  )}
                </GlassCard>
              </MotiView>
            )}

            {/* Spacer for action bar */}
            <View className="h-6" />
          </ScrollView>
        ) : null}

        {/* Action bar — fixed at bottom */}
        {appointment && !loading && (
          <View
            style={{ paddingBottom: insets.bottom + 12 }}
            className="pt-2 bg-transparent"
          >
            <ActionBar
              status={appointment.bookingStatus}
              updating={updating}
              onAccept={() => handleUpdate("confirmed")}
              onReject={() => handleUpdate("rejected")}
              onComplete={() => handleUpdate("completed")}
            />
          </View>
        )}
      </View>
    </GradientBackground>
  );
}
