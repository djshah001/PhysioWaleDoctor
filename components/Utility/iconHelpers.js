/**
 * Utility functions to get appropriate icons for facilities and services
 */

/**
 * Returns an appropriate icon name for a given facility
 * @param {string} facilityName - The name of the facility
 * @returns {string} - The icon name from Material Design Icons
 */
export const getFacilityIcon = (facilityName) => {
  const name = facilityName?.toLowerCase() || "";
  
  if (name.includes("parking")) return "parking";
  if (name.includes("wifi")) return "wifi";
  if (name.includes("wheelchair") || name.includes("accessible")) return "wheelchair-accessibility";
  if (name.includes("air") || name.includes("ac")) return "air-conditioner";
  if (name.includes("water")) return "water";
  if (name.includes("waiting")) return "seat";
  if (name.includes("toilet") || name.includes("restroom")) return "toilet";
  if (name.includes("emergency")) return "ambulance";
  if (name.includes("pharmacy")) return "pharmacy";
  if (name.includes("lab")) return "test-tube";
  if (name.includes("x-ray") || name.includes("xray")) return "radiology-box";
  if (name.includes("cafe") || name.includes("canteen")) return "coffee";
  if (name.includes("lift") || name.includes("elevator")) return "elevator";
  if (name.includes("reception")) return "account-voice";
  if (name.includes("payment") || name.includes("card")) return "credit-card";
  
  // Default icon
  return "check-circle";
};

/**
 * Returns an appropriate icon name for a given service
 * @param {string} serviceName - The name of the service
 * @returns {string} - The icon name from Material Design Icons
 */
export const getServiceIcon = (serviceName) => {
  const name = serviceName?.toLowerCase() || "";
  
  if (name.includes("consultation")) return "account-voice";
  if (name.includes("therapy") || name.includes("physiotherapy")) return "human-handsup";
  if (name.includes("massage")) return "hand-heart";
  if (name.includes("exercise")) return "dumbbell";
  if (name.includes("rehab")) return "run";
  if (name.includes("assessment")) return "clipboard-text";
  if (name.includes("scan") || name.includes("imaging")) return "radiology-box";
  if (name.includes("acupuncture")) return "needle";
  if (name.includes("check") || name.includes("examination")) return "stethoscope";
  if (name.includes("follow")) return "calendar-check";
  if (name.includes("home")) return "home-heart";
  if (name.includes("emergency")) return "ambulance";
  
  // Default icon
  return "medical-bag";
};