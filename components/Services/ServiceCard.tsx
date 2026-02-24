import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "~/components/ui/premium/GlassCard";
import { Button } from "~/components/ui/button";
import { Service } from "~/types/models";
import colors from "tailwindcss/colors";

// ─── Category config ──────────────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  string,
  {
    icon: keyof typeof Ionicons.glyphMap;
    bgCls: string;
    textCls: string;
    iconColor: string;
  }
> = {
  Consultation: {
    icon: "chatbubble-ellipses-outline",
    bgCls: "bg-indigo-100",
    textCls: "text-indigo-700",
    iconColor: colors.indigo[600],
  },
  "Manual Therapy": {
    icon: "hand-left-outline",
    bgCls: "bg-emerald-100",
    textCls: "text-emerald-700",
    iconColor: colors.emerald[600],
  },
  Electrotherapy: {
    icon: "flash-outline",
    bgCls: "bg-amber-100",
    textCls: "text-amber-700",
    iconColor: colors.amber[600],
  },
  Rehabilitation: {
    icon: "fitness-outline",
    bgCls: "bg-violet-100",
    textCls: "text-violet-700",
    iconColor: colors.violet[600],
  },
  "Home Visit": {
    icon: "home-outline",
    bgCls: "bg-cyan-100",
    textCls: "text-cyan-700",
    iconColor: colors.cyan[600],
  },
  Pediatric: {
    icon: "happy-outline",
    bgCls: "bg-pink-100",
    textCls: "text-pink-700",
    iconColor: colors.pink[600],
  },
  Neurological: {
    icon: "pulse-outline",
    bgCls: "bg-rose-100",
    textCls: "text-rose-700",
    iconColor: colors.rose[600],
  },
  "Sports Recovery": {
    icon: "trophy-outline",
    bgCls: "bg-orange-100",
    textCls: "text-orange-700",
    iconColor: colors.orange[600],
  },
  Other: {
    icon: "ellipsis-horizontal-circle-outline",
    bgCls: "bg-gray-100",
    textCls: "text-gray-600",
    iconColor: colors.gray[500],
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceCardProps = {
  item: Service;
  onEdit: (service: Service) => void;
  onToggleActive: (service: Service) => void;
  onDelete: (service: Service) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ServiceCard: React.FC<ServiceCardProps> = ({
  item,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  const cfg = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG["Other"];
  const clinicName =
    typeof item.clinic === "object" ? item.clinic.name : "Unknown Clinic";

  const handleDelete = () => {
    Alert.alert(
      "Delete Service",
      `Are you sure you want to delete "${item.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(item),
        },
      ],
    );
  };

  return (
    <GlassCard
      className="mx-4 mb-3 overflow-hidden rounded-2xl"
      contentContainerClassName="p-0 rounded-2xl"
    >
      <View className="flex-row">
        {/* ── Left accent strip with category icon ── */}
        <View
          className={`w-[62px] items-center justify-center py-5 border-r border-white/20 ${cfg.bgCls}`}
        >
          <View className="p-2 bg-white/60 rounded-xl">
            <Ionicons name={cfg.icon} size={20} color={cfg.iconColor} />
          </View>
          {item.isHomeVisit && (
            <View className="mt-2 bg-white/70 px-1.5 py-0.5 rounded-full">
              <Text className="text-[8px] font-bold text-cyan-700">HOME</Text>
            </View>
          )}
        </View>

        {/* ── Right content ── */}
        <View className="flex-1 px-3 py-3">
          {/* Top row: name + status */}
          <View className="flex-row justify-between items-start mb-1">
            <Text
              className="font-bold text-gray-800 text-[14px] flex-1 mr-2"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <View
              className={`px-2 py-0.5 rounded-full flex-row items-center gap-1 ${
                item.isActive ? "bg-emerald-100" : "bg-gray-100"
              }`}
            >
              <View
                className={`w-1.5 h-1.5 rounded-full ${
                  item.isActive ? "bg-emerald-500" : "bg-gray-400"
                }`}
              />
              <Text
                className={`text-[9px] font-bold uppercase ${
                  item.isActive ? "text-emerald-700" : "text-gray-500"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          {/* Description */}
          {!!item.description && (
            <Text
              className="text-gray-500 text-[11px] mb-2 leading-4"
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}

          {/* Stats row: duration, price, category */}
          <View className="flex-row gap-2 flex-wrap mb-3">
            {/* Duration */}
            <View className="flex-row items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <Ionicons
                name="time-outline"
                size={11}
                color={colors.gray[400]}
              />
              <Text className="text-gray-600 text-[11px] font-semibold">
                {item.duration} min
              </Text>
            </View>

            {/* Price */}
            <View className="flex-row items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg">
              <Ionicons
                name="cash-outline"
                size={11}
                color={colors.indigo[500]}
              />
              <Text className="text-indigo-700 text-[11px] font-bold">
                ₹{item.price.toLocaleString()}
              </Text>
            </View>

            {/* Category chip */}
            <View className={`px-2 py-1 rounded-lg ${cfg.bgCls}`}>
              <Text className={`text-[10px] font-semibold ${cfg.textCls}`}>
                {item.category}
              </Text>
            </View>
          </View>

          {/* Clinic name */}
          <View className="flex-row items-center gap-1 mb-3">
            <Ionicons
              name="business-outline"
              size={11}
              color={colors.gray[400]}
            />
            <Text className="text-gray-400 text-[11px]" numberOfLines={1}>
              {clinicName}
            </Text>
          </View>

          {/* Action row */}
          <View className="flex-row border-t border-gray-100 -mx-3 px-1 pt-2 gap-1">
            {/* Toggle active */}
            <Button
              onPress={() => onToggleActive(item)}
              leftIcon={item.isActive ? "eye-off-outline" : "eye-outline"}
              leftIconSize={14}
              leftIconColor={
                item.isActive ? colors.gray[500] : colors.emerald[600]
              }
              title={item.isActive ? "Deactivate" : "Activate"}
              className="flex-1 bg-transparent rounded-none py-1.5 shadow-none"
              textClassName={`text-[11px] font-bold ${
                item.isActive ? "text-gray-500" : "text-emerald-600"
              }`}
            />

            {/* Divider */}
            <View className="w-px bg-gray-100 my-0.5" />

            {/* Edit */}
            <Button
              onPress={() => onEdit(item)}
              leftIcon="create-outline"
              leftIconSize={14}
              leftIconColor={colors.indigo[600]}
              title="Edit"
              className="flex-1 bg-transparent rounded-none py-1.5 shadow-none"
              textClassName="text-[11px] font-bold text-indigo-600"
            />

            {/* Divider */}
            <View className="w-px bg-gray-100 my-0.5" />

            {/* Delete */}
            <Button
              onPress={handleDelete}
              leftIcon="trash-outline"
              leftIconSize={14}
              leftIconColor={colors.red[500]}
              title="Delete"
              className="flex-1 bg-transparent rounded-none py-1.5 shadow-none"
              textClassName="text-[11px] font-bold text-red-500"
            />
          </View>
        </View>
      </View>
    </GlassCard>
  );
};
