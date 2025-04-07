import * as Yup from "yup";

export const clinicRegistrationSchema = Yup.object().shape({
  // Basic Information
  name: Yup.string().required("Clinic name is required"),
  description: Yup.string().required("Description is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  address: Yup.string().required("Address is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  pinCode: Yup.string()
    .required("PIN code is required")
    .matches(/^[0-9]{6}$/, "PIN code must be 6 digits"),

  // Location
  location: Yup.object().shape({
    type: Yup.string().required(),
    coordinates: Yup.array().min(2, "Location coordinates are required"),
  }),

  // Timing
  open24hrs: Yup.boolean(),
  timing: Yup.object().when("open24hrs", {
    is: false,
    then: () =>
      Yup.object({
        sunday: Yup.object().shape({
          isClosed: Yup.boolean(),
          opening: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Opening time is required"),
          }),
          closing: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Closing time is required"),
          }),
          unavailableSlots: Yup.array(),
        }),
        monday: Yup.object().shape({
          isClosed: Yup.boolean(),
          opening: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Opening time is required"),
          }),
          closing: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Closing time is required"),
          }),
          unavailableSlots: Yup.array(),
        }),
        tuesday: Yup.object().shape({
          isClosed: Yup.boolean(),
          opening: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Opening time is required"),
          }),
          closing: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Closing time is required"),
          }),
          unavailableSlots: Yup.array(),
        }),
        wednesday: Yup.object().shape({
          isClosed: Yup.boolean(),
          opening: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Opening time is required"),
          }),
          closing: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Closing time is required"),
          }),
          unavailableSlots: Yup.array(),
        }),
        thursday: Yup.object().shape({
          isClosed: Yup.boolean(),
          opening: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Opening time is required"),
          }),
          closing: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Closing time is required"),
          }),
          unavailableSlots: Yup.array(),
        }),
        friday: Yup.object().shape({
          isClosed: Yup.boolean(),
          opening: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Opening time is required"),
          }),
          closing: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Closing time is required"),
          }),
          unavailableSlots: Yup.array(),
        }),
        saturday: Yup.object().shape({
          isClosed: Yup.boolean(),
          opening: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Opening time is required"),
          }),
          closing: Yup.string().when("isClosed", {
            is: false,
            then: (schema) => schema.required("Closing time is required"),
          }),
          unavailableSlots: Yup.array(),
        }),
      }).test(
        "at-least-one-day-open",
        "At least one day must be open",
        function (value) {
          if (!value) return false;
          return Object.values(value).some((day) => !day.isClosed);
        }
      ),
  }),

  // Services
  services: Yup.array()
    .min(1, "At least one service is required")
    .of(
      Yup.object().shape({
        name: Yup.string().required("Service name is required"),
        duration: Yup.string().required("Service duration is required"),
        price: Yup.string().required("Service price is required"),
      })
    ),

  // Facilities
  facilities: Yup.array().min(1, "At least one facility is required"),

  // Insurance
  // insuranceAccepted: Yup.array(),

  // Languages
  languages: Yup.array().min(1, "At least one language is required"),

  // Specializations
  specializations: Yup.array().min(
    1,
    "At least one specialization is required"
  ),

  // Rating
  rating: Yup.object().shape({
    overall: Yup.number(),
    reviewCount: Yup.number(),
  }),

  // Emergency Services
  emergencyServices: Yup.object().shape({
    available: Yup.boolean(),
    contactNumber: Yup.string().when("available", {
      is: true,
      then: (schema) => schema.required("Emergency contact number is required"),
    }),
  }),

  // Parking
  parking: Yup.object().shape({
    available: Yup.boolean(),
    type: Yup.string().when("available", {
      is: true,
      then: (schema) => schema.required("Parking type is required"),
    }),
    details: Yup.string(),
  }),

  // Accessibility
  // accessibility: Yup.object().shape({
  //   wheelchairAccess: Yup.boolean(),
  //   elevator: Yup.boolean(),
  //   accessibleBathroom: Yup.boolean(),
  //   otherFeatures: Yup.array()
  // }),

  // Status
  // status: Yup.string(),

  // Images
  images: Yup.array().min(1, "At least one clinic image is required"),

  // Appointment Fee
  appointmentFee: Yup.object().shape({
    initialAssessment: Yup.string().required(
      "Initial assessment fee is required"
    ),
    followUp: Yup.string(),
    emergency: Yup.string(),
    homeVisit: Yup.string(),
    groupSession: Yup.string(),
    cancellationFee: Yup.string(),
    noShowFee: Yup.string(),
    reschedulingFee: Yup.string(),
    specialNotes: Yup.string(),
  }),
});
