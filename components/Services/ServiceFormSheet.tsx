import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
  registerSheet,
} from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import {
  Service,
  ServiceFormData,
  ServiceCategory,
  SERVICE_CATEGORIES,
  Clinic,
} from "~/types/models";
import { serviceApi } from "~/apis/services";
import colors from "tailwindcss/colors";

// ─── Sheet ID + payload types ─────────────────────────────────────────────────

export const SERVICE_FORM_SHEET_ID = "service-form-sheet" as const;

export type ServiceFormSheetPayload = {
  service?: Service;
  clinics: Clinic[];
  onSaved: (service: Service) => void;
};

export type ServiceFormSheetResult = void;

declare module "react-native-actions-sheet" {
  interface Sheets {
    "service-form-sheet": {
      payload: ServiceFormSheetPayload;
      returnValue: ServiceFormSheetResult;
    };
  }
}

// ─── Field helper ─────────────────────────────────────────────────────────────

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <View className="mb-4">
    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
      {label}
      {required && <Text className="text-red-500"> *</Text>}
    </Text>
    {children}
  </View>
);

const inputCls =
  "bg-white/60 border border-white/40 rounded-xl px-3 py-3 text-gray-800 text-sm font-medium";

// ─── Component ────────────────────────────────────────────────────────────────

function ServiceFormSheet({
  sheetId,
  payload,
}: SheetProps<"service-form-sheet">) {
  const editing = !!payload?.service;
  const clinics = payload?.clinics ?? [];

  // ── Form state ────────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Consultation");
  const [duration, setDuration] = useState("30");
  const [price, setPrice] = useState("0");
  const [clinicId, setClinicId] = useState("");
  const [isHomeVisit, setIsHomeVisit] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showClinicPicker, setShowClinicPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // ── Populate form when editing ────────────────────────────────────────────
  useEffect(() => {
    if (payload?.service) {
      const s = payload.service;
      setName(s.name);
      setDescription(s.description ?? "");
      setCategory(s.category as ServiceCategory);
      setDuration(String(s.duration));
      setPrice(String(s.price));
      setClinicId(typeof s.clinic === "object" ? s.clinic._id : s.clinic);
      setIsHomeVisit(s.isHomeVisit);
      setIsActive(s.isActive);
    } else {
      setName("");
      setDescription("");
      setCategory("Consultation");
      setDuration("30");
      setPrice("0");
      setClinicId(clinics[0]?._id ?? "");
      setIsHomeVisit(false);
      setIsActive(true);
    }
    setErrors({});
    setShowCategoryPicker(false);
    setShowClinicPicker(false);
  }, [payload]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!clinicId) e.clinicId = "Please select a clinic";
    if (isNaN(Number(duration)) || Number(duration) < 5)
      e.duration = "At least 5 minutes";
    if (isNaN(Number(price)) || Number(price) < 0) e.price = "Must be ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate() || !payload) return;
    setSaving(true);
    try {
      const formData: ServiceFormData = {
        name: name.trim(),
        description: description.trim(),
        category,
        duration: Number(duration),
        price: Number(price),
        clinic: clinicId,
        isHomeVisit,
        isActive,
      };

      let saved: Service;
      if (editing && payload.service) {
        const res = await serviceApi.updateService(
          payload.service._id,
          formData,
        );
        saved = res.data.data;
      } else {
        const res = await serviceApi.createService(formData);
        saved = res.data.data;
      }

      payload.onSaved(saved);
      SheetManager.hide(sheetId);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to save service. Try again.";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const selectedClinic = clinics.find((c) => c._id === clinicId);

  return (
    <ActionSheet
      id={sheetId}
      snapPoints={[92]}
      initialSnapIndex={0}
      gestureEnabled
      backgroundInteractionEnabled={false}
      containerStyle={{
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: "#f1f5f9",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
          <TouchableOpacity
            onPress={() => SheetManager.hide(sheetId)}
            className="p-2"
          >
            <Ionicons name="close" size={22} color={colors.gray[500]} />
          </TouchableOpacity>
          <Text className="font-bold text-gray-800 text-base">
            {editing ? "Edit Service" : "New Service"}
          </Text>
          <Button
            onPress={handleSave}
            loading={saving}
            title="Save"
            className="bg-indigo-600 rounded-xl px-4 py-2 shadow-none"
            textClassName="text-white font-bold text-sm"
          />
        </View>

        <ScrollView
          className="px-5 pt-5"
          contentContainerStyle={{ paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name */}
          <Field label="Service Name" required>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Dry Needling Session"
              placeholderTextColor={colors.gray[400]}
              className={inputCls}
            />
            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
            )}
          </Field>

          {/* Description */}
          <Field label="Description">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description (optional)"
              placeholderTextColor={colors.gray[400]}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className={`${inputCls} min-h-[80px]`}
            />
          </Field>

          {/* Category */}
          <Field label="Category" required>
            <TouchableOpacity
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              className={`${inputCls} flex-row justify-between items-center`}
            >
              <Text className="text-gray-800 text-sm font-medium">
                {category}
              </Text>
              <Ionicons
                name={showCategoryPicker ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.gray[400]}
              />
            </TouchableOpacity>
            {showCategoryPicker && (
              <View className="bg-white border border-gray-100 rounded-xl mt-1 overflow-hidden shadow-sm">
                {SERVICE_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                    className={`px-4 py-3 border-b border-gray-50 flex-row justify-between items-center ${
                      category === cat ? "bg-indigo-50" : ""
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        category === cat ? "text-indigo-700" : "text-gray-700"
                      }`}
                    >
                      {cat}
                    </Text>
                    {category === cat && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={colors.indigo[600]}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Field>

          {/* Duration + Price */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Field label="Duration (min)" required>
                <TextInput
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor={colors.gray[400]}
                  className={inputCls}
                />
                {errors.duration && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.duration}
                  </Text>
                )}
              </Field>
            </View>
            <View className="flex-1">
              <Field label="Price (₹)" required>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholder="500"
                  placeholderTextColor={colors.gray[400]}
                  className={inputCls}
                />
                {errors.price && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.price}
                  </Text>
                )}
              </Field>
            </View>
          </View>

          {/* Clinic picker */}
          <Field label="Clinic" required>
            <TouchableOpacity
              onPress={() => setShowClinicPicker(!showClinicPicker)}
              className={`${inputCls} flex-row justify-between items-center`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedClinic ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {selectedClinic?.name ?? "Select a clinic"}
              </Text>
              <Ionicons
                name={showClinicPicker ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.gray[400]}
              />
            </TouchableOpacity>
            {errors.clinicId && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.clinicId}
              </Text>
            )}
            {showClinicPicker && (
              <View className="bg-white border border-gray-100 rounded-xl mt-1 overflow-hidden shadow-sm">
                {clinics.map((c) => (
                  <TouchableOpacity
                    key={c._id}
                    onPress={() => {
                      setClinicId(c._id);
                      setShowClinicPicker(false);
                    }}
                    className={`px-4 py-3 border-b border-gray-50 flex-row justify-between items-center ${
                      clinicId === c._id ? "bg-indigo-50" : ""
                    }`}
                  >
                    <View>
                      <Text
                        className={`text-sm font-medium ${
                          clinicId === c._id
                            ? "text-indigo-700"
                            : "text-gray-700"
                        }`}
                      >
                        {c.name}
                      </Text>
                      <Text className="text-xs text-gray-400">{c.city}</Text>
                    </View>
                    {clinicId === c._id && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={colors.indigo[600]}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Field>

          {/* Toggles */}
          <View className="bg-white/60 border border-white/40 rounded-xl overflow-hidden mb-4">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="home-outline"
                  size={16}
                  color={colors.cyan[600]}
                />
                <Text className="text-sm font-semibold text-gray-700">
                  Home Visit Service
                </Text>
              </View>
              <Switch
                value={isHomeVisit}
                onValueChange={setIsHomeVisit}
                trackColor={{ true: colors.cyan[500], false: colors.gray[200] }}
                thumbColor="white"
              />
            </View>
            <View className="flex-row items-center justify-between px-4 py-3">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name={isActive ? "eye-outline" : "eye-off-outline"}
                  size={16}
                  color={isActive ? colors.emerald[600] : colors.gray[400]}
                />
                <Text className="text-sm font-semibold text-gray-700">
                  Active (visible to patients)
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{
                  true: colors.emerald[500],
                  false: colors.gray[200],
                }}
                thumbColor="white"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ActionSheet>
  );
}

// ─── Register so SheetManager.show() works from anywhere ─────────────────────

registerSheet(SERVICE_FORM_SHEET_ID, ServiceFormSheet);

export default ServiceFormSheet;
