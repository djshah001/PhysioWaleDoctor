import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
  registerSheet,
} from "react-native-actions-sheet";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ClinicSummary } from "~/types/models";

// ─── Public types ─────────────────────────────────────────────────────────────

export type ApptType = "In-Clinic" | "Home-Visit" | "Video-Call";

export interface FilterSheetPayload {
  clinics: ClinicSummary[];
  current: {
    appointmentType?: ApptType;
    clinicId?: string;
    clinicName?: string;
  };
}

export interface FilterSheetResult {
  appointmentType?: ApptType;
  clinicId?: string;
  clinicName?: string;
}

export const FILTER_SHEET_ID = "appointment-filter-sheet";

// Augment the Sheets interface so SheetManager.show/hide are fully typed
declare module "react-native-actions-sheet" {
  interface Sheets {
    "appointment-filter-sheet": {
      payload: FilterSheetPayload;
      returnValue: FilterSheetResult;
    };
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────

const APPT_TYPES: {
  key: ApptType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}[] = [
  {
    key: "In-Clinic",
    label: "In-Clinic",
    icon: "business",
    color: "#4f46e5",
    bg: "#ede9fe",
  },
  {
    key: "Home-Visit",
    label: "Home Visit",
    icon: "home",
    color: "#0891b2",
    bg: "#cffafe",
  },
  {
    key: "Video-Call",
    label: "Video Call",
    icon: "videocam",
    color: "#059669",
    bg: "#d1fae5",
  },
];

// ─── Sheet Component ──────────────────────────────────────────────────────────

function FilterSheet({
  sheetId,
  payload,
}: SheetProps<"appointment-filter-sheet">) {
  const clinics = payload?.clinics ?? [];
  const current = payload?.current ?? {};

  /** Close the sheet and return the selected filters to the caller. */
  const resolve = (result: FilterSheetResult) => {
    SheetManager.hide(sheetId, { payload: result });
  };

  const activeCount =
    (current.appointmentType ? 1 : 0) + (current.clinicId ? 1 : 0);

  return (
    <ActionSheet
      id={sheetId}
      gestureEnabled
      indicatorStyle={s.indicator}
      containerStyle={s.container}
      defaultOverlayOpacity={0.4}
    >
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.headerIcon}>
              <Ionicons name="options" size={18} color="#4f46e5" />
            </View>
            <View>
              <Text style={s.headerTitle}>Filters</Text>
              {activeCount > 0 && (
                <Text style={s.headerSub}>
                  {activeCount} filter{activeCount > 1 ? "s" : ""} active
                </Text>
              )}
            </View>
          </View>
          {activeCount > 0 && (
            <TouchableOpacity
              onPress={() =>
                resolve({
                  appointmentType: undefined,
                  clinicId: undefined,
                  clinicName: undefined,
                })
              }
              style={s.clearBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={14} color="#dc2626" />
              <Text style={s.clearText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.divider} />

        {/* ── Appointment Type ─────────────────────────────────────────── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={15}
              color="#6b7280"
            />
            <Text style={s.sectionTitle}>Appointment Type</Text>
          </View>

          <View style={{ gap: 10 }}>
            {APPT_TYPES.map((t) => {
              const isActive = current.appointmentType === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() =>
                    resolve({
                      ...current,
                      appointmentType: isActive ? undefined : t.key,
                    })
                  }
                  activeOpacity={0.75}
                  style={[
                    s.typeChip,
                    { backgroundColor: isActive ? t.color : "#f3f4f6" },
                  ]}
                >
                  <View
                    style={[
                      s.typeIconWrap,
                      {
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.22)"
                          : t.bg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={t.icon}
                      size={18}
                      color={isActive ? "#fff" : t.color}
                    />
                  </View>
                  <Text
                    style={[
                      s.typeLabel,
                      { color: isActive ? "#fff" : "#374151" },
                    ]}
                  >
                    {t.label}
                  </Text>
                  {isActive ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="rgba(255,255,255,0.9)"
                    />
                  ) : (
                    <View style={s.radioEmpty} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Clinics ──────────────────────────────────────────────────── */}
        {clinics.length > 0 && (
          <>
            <View style={s.dividerLight} />
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Ionicons name="business-outline" size={15} color="#6b7280" />
                <Text style={s.sectionTitle}>Clinic</Text>
              </View>

              <View style={{ gap: 8 }}>
                {/* All Clinics (clear clinic filter) */}
                <ClinicRow
                  id={null}
                  name="All Clinics"
                  icon="layers-outline"
                  isActive={!current.clinicId}
                  onPress={() =>
                    resolve({
                      ...current,
                      clinicId: undefined,
                      clinicName: undefined,
                    })
                  }
                />

                {clinics.map((clinic) => (
                  <ClinicRow
                    key={clinic._id}
                    id={clinic._id}
                    name={clinic.name}
                    address={clinic.address}
                    city={clinic.city}
                    icon="business"
                    isActive={current.clinicId === clinic._id}
                    onPress={() =>
                      resolve({
                        ...current,
                        clinicId: clinic._id,
                        clinicName: clinic.name,
                      })
                    }
                  />
                ))}
              </View>
            </View>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </ActionSheet>
  );
}

// ─── ClinicRow helper ─────────────────────────────────────────────────────────

function ClinicRow({
  icon,
  name,
  address,
  city,
  isActive,
  onPress,
}: {
  id: string | null;
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  address?: string;
  city?: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[s.clinicRow, isActive && s.clinicRowActive]}
    >
      <View
        style={[
          s.clinicAvatar,
          { backgroundColor: isActive ? "#ede9fe" : "#f3f4f6" },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isActive ? "#4f46e5" : "#9ca3af"}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[s.clinicName, { color: isActive ? "#3730a3" : "#111827" }]}
          numberOfLines={1}
        >
          {name}
        </Text>
        {(address || city) && (
          <Text style={s.clinicSub} numberOfLines={1}>
            {[address, city].filter(Boolean).join(", ")}
          </Text>
        )}
      </View>
      <View style={[s.radioOuter, isActive && s.radioOuterActive]}>
        {isActive && <View style={s.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

// ─── Register so SheetManager.show() works from anywhere ─────────────────────

registerSheet(FILTER_SHEET_ID, FilterSheet);

export default FilterSheet;

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#fff",
  },
  indicator: {
    width: 36,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 2,
  },
  scroll: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 14,
    paddingBottom: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#ede9fe",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  headerSub: { fontSize: 12, color: "#6b7280", marginTop: 1 },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  clearText: { fontSize: 12, color: "#dc2626", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginBottom: 16 },
  dividerLight: { height: 1, backgroundColor: "#f9fafb", marginVertical: 16 },
  section: { marginBottom: 4 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  typeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  typeLabel: { flex: 1, fontSize: 14, fontWeight: "600" },
  radioEmpty: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
  },
  clinicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  clinicRowActive: { backgroundColor: "#f5f3ff", borderColor: "#c4b5fd" },
  clinicAvatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  clinicName: { fontSize: 14, fontWeight: "600" },
  clinicSub: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: "#4f46e5" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4f46e5",
  },
});
