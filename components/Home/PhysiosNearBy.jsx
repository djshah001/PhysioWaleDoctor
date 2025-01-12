import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";

const PhysiosNearBy = ({ clinics }) => {
  const [photos, setPhotos] = useState({}); // To cache photo URLs by `place_id`
  // const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY; // Replace with your API key

  const apikey = "AlzaSy48uzEZAuaR7aq8iKNO8YAC4JxVgSimIzA";

  // Fetch photo for a given `photo_reference`
  const fetchPhoto = async (photoReference, placeId) => {
    if (!photoReference) return null;

    const photoUrl = `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apikey}`;
    try {
      const { config } = await axios.get(photoUrl);
      setPhotos((prevPhotos) => ({
        ...prevPhotos,
        [placeId]: config.url, // Use Axios config.url to get the full resolved URL
      }));
    } catch (error) {
      console.error(`Error fetching photo for place_id ${placeId}:`, error);
    }
  };

  // Fetch photos when clinics update
  useEffect(() => {
    clinics.forEach((clinic) => {
      if (clinic.photos && clinic.photos.length > 0) {
        fetchPhoto(clinic.photos[0].photo_reference, clinic.place_id);
      }
    });
  }, [clinics]);

  return (
    <View className="px-4 w-screen ">
      <View className="w-full flex-row items-center justify-between">
        <Text className="font-osbold text-xl ml-1">Physios Near-Me</Text>
        <TouchableOpacity>
          <Text className="font-ossemibold text-md text-secondary-300 underline decoration-8 underline-offset-8">
            See All
          </Text>
        </TouchableOpacity>
      </View>
      {clinics.map((clinic, i) => (
        <View
          key={clinic._id}
          className={`my-3 gap-3 justify-center bg-white-300 shadow-md shadow-black-200 rounded-3xl `}
        >
          <Image
            source={{
              uri: photos[clinic.place_id]
                ? photos[clinic.place_id]
                : "https://via.placeholder.com/400",
            }}
            className=" w-full h-72 rounded-2xl overflow-hidden "
            resizeMode="cover"
          />

          <View className=" absolute bottom-0 w-full">
            <View className="px-2 py-4 bg-black-200/50 rounded-b-2xl shadow-xl">
              {/* Overlayed content */}
              <View className="p-3 bg-white-300 rounded-2xl">
                <Text className="text-lg font-psemibold">{clinic.name}</Text>
                <Text numberOfLines={2}>
                  {clinic.address || "Address not available"}
                </Text>
              </View>
            </View>
          </View>
          {/* </> */}
        </View>
      ))}
    </View>
  );
};

export default PhysiosNearBy;
