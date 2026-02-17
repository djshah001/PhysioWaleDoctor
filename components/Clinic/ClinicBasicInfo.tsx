import React, { useRef } from "react";
import { View, Text, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { PremiumInput } from "~/components/ui/premium/PremiumInput";

interface ClinicBasicInfoProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  consultationFee: string;
  setConsultationFee: (value: string) => void;
}

const ClinicBasicInfo: React.FC<ClinicBasicInfoProps> = ({
  name,
  setName,
  description,
  setDescription,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  website,
  setWebsite,
  consultationFee,
  setConsultationFee,
}) => {
  const descRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const websiteRef = useRef<TextInput>(null);
  const feeRef = useRef<TextInput>(null);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="gap-5"
    >
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </Text>
        <Text className="text-gray-500 text-sm font-medium">
          Let's start with the essential details about your clinic
        </Text>
      </View>

      <PremiumInput
        label="Clinic Name"
        icon="hospital-building"
        iconFamily="MaterialCommunityIcons"
        placeholder="Enter Clinic Name"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
        onSubmitEditing={() => descRef.current?.focus()}
        submitBehavior="blurAndSubmit"
      />

      <PremiumInput
        ref={descRef}
        label="Description"
        placeholder="Describe your clinic, services, and what makes it special..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
      />

      <PremiumInput
        ref={phoneRef}
        label="Clinic Phone Number"
        icon="phone"
        iconFamily="MaterialCommunityIcons"
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />

      <PremiumInput
        ref={emailRef}
        label="Email (Optional)"
        icon="email"
        iconFamily="MaterialCommunityIcons"
        placeholder="clinic@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => websiteRef.current?.focus()}
      />

      <PremiumInput
        ref={websiteRef}
        label="Website (Optional)"
        icon="web"
        iconFamily="MaterialCommunityIcons"
        placeholder="https://www.yourclinic.com"
        value={website}
        onChangeText={setWebsite}
        keyboardType="url"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => feeRef.current?.focus()}
      />

      <PremiumInput
        ref={feeRef}
        label="Consultation Fee (₹)"
        icon="currency-inr"
        iconFamily="MaterialCommunityIcons"
        placeholder="500"
        value={consultationFee}
        onChangeText={setConsultationFee}
        keyboardType="decimal-pad"
        returnKeyType="done"
      />
    </Animated.View>
  );
};

export default ClinicBasicInfo;
