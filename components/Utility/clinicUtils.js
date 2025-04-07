import axios from "axios";
import { apiUrl } from "./Repeatables";
import { clinicRegistrationSchema } from "./validationSchemas";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const validateClinicForm = async (data) => {
  try {
    await clinicRegistrationSchema.validate(data, { abortEarly: false });
    return {};
  } catch (err) {
    const errors = {};
    err.inner.forEach((error) => {
      errors[error.path] = error.message;
    });
    return errors;
  }
};

export const getPlaceDetails = async (
  item,
  setClinicData,
  setShowSuggestions,
  setToast
) => {
  try {
    const placeDetailsApi = `${apiUrl}/api/v/clinics/place-details/${item.placePrediction.placeId}`;
    const res = await axios.get(placeDetailsApi);

    if (res.data) {
      const place = res.data;

      // Extract address components
      const addressComponents = place.addressComponents || [];
      // console.log(addressComponents)
      let city = "";
      let state = "";
      let country = "";
      let pinCode = "";

      addressComponents.forEach((component) => {
        if (component.types.includes("locality")) {
          city = component.longText;
        } else if (component.types.includes("administrative_area_level_1")) {
          state = component.longText;
        } else if (component.types.includes("country")) {
          country = component.longText;
        } else if (component.types.includes("postal_code")) {
          pinCode = component.longText;
        }
      });

      console.log(city, state, country, pinCode);

      // Update clinic data
      setClinicData((prev) => ({
        ...prev,
        name: place.displayName.text || prev.name,
        address: place.formattedAddress || prev.address,
        city: city || prev.city,
        state: state || prev.state,
        country: country || prev.country,
        pinCode: pinCode || prev.pinCode,
        location: {
          type: "Point",
          coordinates: [
            place.location?.longitude || 0,
            place.location?.latitude || 0,
          ],
        },
      }));

      setShowSuggestions(false);
    }
  } catch (error) {
    console.log("Error fetching place details:", error.response.data);
    setToast({
      message: "Error fetching place details",
      visible: true,
      type: "error",
    });
  }
};

export const getClinicDataFromLocation = async (
  userData,
  setClinicData,
  setToast
) => {
  try {
    // console.log(userData.location);
    if (!userData.location?.latitude || !userData.location?.longitude) {
      setToast({
        message: "Location not available",
        visible: true,
        type: "error",
      });
      return;
    }

    const reverseGeocodingApi = `${apiUrl}/api/v/clinics/reverse-geocode?latitude=${userData.location.latitude}&longitude=${userData.location.longitude}`;
    const res = await axios.get(reverseGeocodingApi);

    if (res.data && res.data.results && res.data.results.length > 0) {
      const place = res.data.results[0];

      // Extract address components
      const addressComponents = place.address_components || [];
      let city = "";
      let state = "";
      let country = "";
      let pinCode = "";

      addressComponents.forEach((component) => {
        if (component.types.includes("locality")) {
          city = component.long_name;
        } else if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (component.types.includes("country")) {
          country = component.long_name;
        } else if (component.types.includes("postal_code")) {
          pinCode = component.long_name;
        }
      });

      // Update clinic data
      setClinicData((prev) => ({
        ...prev,
        address: place.formatted_address || prev.address,
        city: city || prev.city,
        state: state || prev.state,
        country: country || prev.country,
        pinCode: pinCode || prev.pinCode,
        location: {
          type: "Point",
          coordinates: [
            userData.location.longitude,
            userData.location.latitude,
          ],
        },
      }));

      setToast({
        message: "Location updated successfully",
        visible: true,
        type: "success",
      });
    }
  } catch (error) {
    console.error("Error getting location data:", error.response.data);
    setToast({
      message: "Error getting location data",
      visible: true,
      type: "error",
    });
  }
};

export const uploadClinicImages = async (images, setClinicData, setToast) => {
  try {
    if (!images || images.length === 0) {
      setToast({
        message: "Please select images first",
        visible: true,
        type: "error",
      });
      return false;
    }

    const formData = new FormData();

    images.forEach((image, index) => {
      const fileExtension = image.uri.split(".").pop();
      const fileName = `clinic_image_${Date.now()}_${index}.${fileExtension}`;

      formData.append("images", {
        uri: image.uri,
        type: `image/${fileExtension}`,
        name: fileName,
      });
    });

    const uploadApi = `${apiUrl}/api/v/clinics/upload-images`;
    const res = await axios.post(uploadApi, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data && res.data.imageUrls) {
      setClinicData((prev) => ({
        ...prev,
        images: res.data.imageUrls,
      }));

      setToast({
        message: "Images uploaded successfully",
        visible: true,
        type: "success",
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error uploading images:", error);
    setToast({
      message: "Error uploading images",
      visible: true,
      type: "error",
    });
    return false;
  }
};

export const createClinic = async (clinicData, setToast, router) => {
  // console.log(clinicData.location);
  try {
    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) {
      setToast({
        message: "Please login first",
        visible: true,
        type: "error",
      });
      return false;
    }
    const createClinicApi = `${apiUrl}/api/v/clinics`;
    const res = await axios.post(createClinicApi, clinicData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    // console.log(res.data);

    setToast({
      message: "Clinic registered successfully",
      visible: true,
      type: "success",
    });

    // Navigate to clinic details or list
    setTimeout(() => {
      router.back();
    }, 1500);

    return true;
  } catch (error) {
    if (error.response.status === 401) {
      setToast({
        message: "Please login first",
        visible: true,
        type: "error",
      });
      return false;
    }
    if (!error.response?.data?.errors[0]?.msg) {
      console.error("Error creating clinic:", error.response.data);
    }
    setToast({
      message:
        error.response?.data?.errors[0]?.msg || "Error registering clinic",
      visible: true,
      type: "error",
    });
    return false;
  }
};
