export const initialClinicData = {
  name: "",
  description: "",
  phoneNumber: "",
  address: "",
  country: "",
  state: "",
  city: "",
  pinCode: "",
  location: {
    type: "Point",
    coordinates: [],
  },
  open24hrs: false,
  images: [],
  timing: {
    sunday: { isClosed: false, opening: "", closing: "", unavailableSlots: [] },
    monday: { isClosed: false, opening: "", closing: "", unavailableSlots: [] },
    tuesday: {
      isClosed: false,
      opening: "",
      closing: "",
      unavailableSlots: [],
    },
    wednesday: {
      isClosed: false,
      opening: "",
      closing: "",
      unavailableSlots: [],
    },
    thursday: {
      isClosed: false,
      opening: "",
      closing: "",
      unavailableSlots: [],
    },
    friday: { isClosed: false, opening: "", closing: "", unavailableSlots: [] },
    saturday: {
      isClosed: false,
      opening: "",
      closing: "",
      unavailableSlots: [],
    },
  },
  services: [],
  facilities: [],
  insuranceAccepted: [],
  languages: [],
  rating: {
    overall: 0,
    reviewCount: 0,
  },
  specializations: [],
  emergencyServices: {
    available: false,
    contactNumber: "",
  },
  parking: {
    available: false,
    type: "",
    details: "",
  },
  accessibility: {
    wheelchairAccess: false,
    elevator: false,
    accessibleBathroom: false,
    otherFeatures: [],
  },
  status: "Active",
};
