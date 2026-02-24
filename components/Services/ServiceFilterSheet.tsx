import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { Clinic, SERVICE_CATEGORIES, ServiceCategory } from "~/types/models";

// ─── Sheet IDs & types ────────────────────────────────────────────────────────

export const SERVICE_FILTER_SHEET_ID = "service-filter-sheet" as const;

export interface ServiceFilterState {
  category: ServiceCategory | "all";
  status: "all" | "active" | "inactive";
  isHomeVisit: boolean | null; // null = any
  clinicId: string | null;
  clinicName: string | null;
}

export interface ServiceFilterSheetPayload {
  clinics: Clinic[];
  current: ServiceFilterState;
}

export const DEFAULT_SERVICE_FILTER: ServiceFilterState = {
  category: "all",
  status: "all",
  isHomeVisit: null,
  clinicId: null,
  clinicName: null,
};

declare module "react-native-actions-sheet" {
  interface Sheets {
    "service-filter-sheet": {
      payload: ServiceFilterSheetPayload;
      returnValue: ServiceFilterState;
    };
  }
}

// ─── Helper: count active filters ────────────────────────────────────────────

export const countActiveFilters = (f: ServiceFilterState): number => {
  let count = 0;
  if (f.category !== "all") count++;
  if (f.status !== "all") count++;
  if (f.isHomeVisit !== null) count++;
  if (f.clinicId) count++;
  return count;
};

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHeader = ({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) => (
  <View style={s.sectionHead}>
    <Ionicons name={icon} size={14} color="#6b7280" />
    <Text style={s.sectionTitle}>{label}</Text>
  </View>
);

// ─── Component ────────────────────────────────────────────────────────────────

function ServiceFilterSheet({
  sheetId,
  payload,
}: SheetProps<"service-filter-sheet">) {
  const clinics = payload?.clinics ?? [];
  const initial = payload?.current ?? DEFAULT_SERVICE_FILTER;

  const [category, setCategory] = useState<ServiceCategory | "all">(
    initial.category,
  );
  const [status, setStatus] = useState(initial.status);
  const [isHomeVisit, setIsHomeVisit] = useState(initial.isHomeVisit);
  const [clinicId, setClinicId] = useState(initial.clinicId);
  const [clinicName, setClinicName] = useState(initial.clinicName);

  const resolve = (result: ServiceFilterState) => {
    SheetManager.hide(sheetId, { payload: result });
  };

  const applyFilters = () => {
    resolve({ category, status, isHomeVisit, clinicId, clinicName });
  };

  const clearAll = () => {
    const empty = DEFAULT_SERVICE_FILTER;
    setCategory(empty.category);
    setStatus(empty.status);
    setIsHomeVisit(empty.isHomeVisit);
    setClinicId(empty.clinicId);
    setClinicName(empty.clinicName);
  };

  const activeCount =
    (category !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (isHomeVisit !== null ? 1 : 0) +
    (clinicId ? 1 : 0);

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
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.headerIcon}>
              <Ionicons name="options" size={18} color="#4f46e5" />
            </View>
            <View>
              <Text style={s.headerTitle}>Filter Services</Text>
              {activeCount > 0 && (
                <Text style={s.headerSub}>
                  {activeCount} filter{activeCount > 1 ? "s" : ""} active
                </Text>
              )}
            </View>
          </View>
          {activeCount > 0 && (
            <TouchableOpacity
              onPress={clearAll}
              style={s.clearBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={14} color="#dc2626" />
              <Text style={s.clearText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.divider} />

        {/* ── Category ── */}
        <View style={s.section}>
          <SectionHeader icon="grid-outline" label="Category" />
          <View style={s.chipWrap}>
            {(["all", ...SERVICE_CATEGORIES] as const).map((cat) => {
              const isOn = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.75}
                  style={[s.chip, isOn && s.chipActive]}
                >
                  <Text style={[s.chipText, isOn && s.chipTextActive]}>
                    {cat === "all" ? "All Categories" : cat}
                  </Text>
                  {isOn && (
                    <Ionicons name="checkmark" size={12} color="#4f46e5" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={s.dividerLight} />

        {/* ── Status ── */}
        <View style={s.section}>
          <SectionHeader icon="pulse-outline" label="Status" />
          <View style={{ gap: 8 }}>
            {(
              [
                {
                  key: "all",
                  label: "All Services",
                  icon: "layers-outline" as const,
                  color: "#6b7280",
                  bg: "#f3f4f6",
                },
                {
                  key: "active",
                  label: "Active",
                  icon: "eye-outline" as const,
                  color: "#059669",
                  bg: "#d1fae5",
                },
                {
                  key: "inactive",
                  label: "Inactive",
                  icon: "eye-off-outline" as const,
                  color: "#9ca3af",
                  bg: "#f3f4f6",
                },
              ] as const
            ).map((opt) => {
              const isOn = status === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setStatus(opt.key)}
                  activeOpacity={0.75}
                  style={[s.row, isOn && s.rowActive]}
                >
                  <View
                    style={[
                      s.rowIcon,
                      {
                        backgroundColor: isOn ? "rgba(79,70,229,0.12)" : opt.bg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={isOn ? "#4f46e5" : opt.color}
                    />
                  </View>
                  <Text
                    style={[
                      s.rowLabel,
                      { color: isOn ? "#3730a3" : "#111827" },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <View style={[s.radio, isOn && s.radioActive]}>
                    {isOn && <View style={s.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={s.dividerLight} />

        {/* ── Home Visit ── */}
        <View style={s.section}>
          <SectionHeader icon="home-outline" label="Visit Type" />
          <View style={{ gap: 8 }}>
            {(
              [
                {
                  key: null,
                  label: "All Types",
                  icon: "layers-outline" as const,
                },
                {
                  key: true,
                  label: "Home Visit Only",
                  icon: "home-outline" as const,
                },
                {
                  key: false,
                  label: "In-Clinic Only",
                  icon: "business-outline" as const,
                },
              ] as const
            ).map((opt) => {
              const isOn = isHomeVisit === opt.key;
              return (
                <TouchableOpacity
                  key={String(opt.key)}
                  onPress={() => setIsHomeVisit(opt.key)}
                  activeOpacity={0.75}
                  style={[s.row, isOn && s.rowActive]}
                >
                  <View
                    style={[
                      s.rowIcon,
                      {
                        backgroundColor: isOn
                          ? "rgba(79,70,229,0.12)"
                          : "#f3f4f6",
                      },
                    ]}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={isOn ? "#4f46e5" : "#9ca3af"}
                    />
                  </View>
                  <Text
                    style={[
                      s.rowLabel,
                      { color: isOn ? "#3730a3" : "#111827" },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <View style={[s.radio, isOn && s.radioActive]}>
                    {isOn && <View style={s.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Clinic ── */}
        {clinics.length > 0 && (
          <>
            <View style={s.dividerLight} />
            <View style={s.section}>
              <SectionHeader icon="business-outline" label="Clinic" />
              <View style={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={() => {
                    setClinicId(null);
                    setClinicName(null);
                  }}
                  activeOpacity={0.75}
                  style={[s.row, !clinicId && s.rowActive]}
                >
                  <View
                    style={[
                      s.rowIcon,
                      {
                        backgroundColor: !clinicId
                          ? "rgba(79,70,229,0.12)"
                          : "#f3f4f6",
                      },
                    ]}
                  >
                    <Ionicons
                      name="layers-outline"
                      size={18}
                      color={!clinicId ? "#4f46e5" : "#9ca3af"}
                    />
                  </View>
                  <Text
                    style={[
                      s.rowLabel,
                      { color: !clinicId ? "#3730a3" : "#111827" },
                    ]}
                  >
                    All Clinics
                  </Text>
                  <View style={[s.radio, !clinicId && s.radioActive]}>
                    {!clinicId && <View style={s.radioDot} />}
                  </View>
                </TouchableOpacity>

                {clinics.map((c) => {
                  const isOn = clinicId === c._id;
                  return (
                    <TouchableOpacity
                      key={c._id}
                      onPress={() => {
                        setClinicId(c._id);
                        setClinicName(c.name);
                      }}
                      activeOpacity={0.75}
                      style={[s.row, isOn && s.rowActive]}
                    >
                      <View
                        style={[
                          s.rowIcon,
                          {
                            backgroundColor: isOn
                              ? "rgba(79,70,229,0.12)"
                              : "#f3f4f6",
                          },
                        ]}
                      >
                        <Ionicons
                          name="business"
                          size={18}
                          color={isOn ? "#4f46e5" : "#9ca3af"}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            s.rowLabel,
                            { color: isOn ? "#3730a3" : "#111827" },
                          ]}
                          numberOfLines={1}
                        >
                          {c.name}
                        </Text>
                        <Text style={s.rowSub}>{c.city}</Text>
                      </View>
                      <View style={[s.radio, isOn && s.radioActive]}>
                        {isOn && <View style={s.radioDot} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}

        <View style={{ height: 16 }} />

        {/* ── Apply button ── */}
        <TouchableOpacity
          onPress={applyFilters}
          activeOpacity={0.85}
          style={s.applyBtn}
        >
          <Ionicons name="checkmark-circle" size={18} color="white" />
          <Text style={s.applyText}>
            Apply Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ActionSheet>
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────

registerSheet(SERVICE_FILTER_SHEET_ID, ServiceFilterSheet);

export default ServiceFilterSheet;

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

  // Header
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

  // Dividers
  divider: { height: 1, backgroundColor: "#f3f4f6", marginBottom: 16 },
  dividerLight: { height: 1, backgroundColor: "#f9fafb", marginVertical: 16 },

  // Section
  section: { marginBottom: 4 },
  sectionHead: {
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

  // Category chips (wrap)
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: "#ede9fe",
    borderColor: "#c4b5fd",
  },
  chipText: { fontSize: 13, fontWeight: "500", color: "#374151" },
  chipTextActive: { color: "#4f46e5", fontWeight: "700" },

  // Row items (status / home visit / clinic)
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  rowActive: { backgroundColor: "#f5f3ff", borderColor: "#c4b5fd" },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: "600" },
  rowSub: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#4f46e5" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4f46e5",
  },

  // Apply button
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4f46e5",
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  applyText: { color: "white", fontSize: 15, fontWeight: "700" },
});
