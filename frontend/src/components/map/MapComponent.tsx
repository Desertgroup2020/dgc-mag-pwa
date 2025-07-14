"use client";

import React, { useCallback, useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { LocateFixed } from "lucide-react";
import styles from "./style.module.scss";
import { Input } from "../ui/input";
import { GetLocationFromCoordsType } from "./apollo/queries";
import useMap from "./hooks/useMap";
import { useAppSelector } from "@/redux/hooks";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

type MapComponentProps = {
  onGetingLocation: (
    locationDetails: GetLocationFromCoordsType["Response"],
    coords: google.maps.LatLngLiteral | null
  ) => void;
  onError: (errMsg: string) => void;
  setGetingLocation: React.Dispatch<React.SetStateAction<boolean>>;
  addressCoords: google.maps.LatLngLiteral | null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  onGetingLocation,
  onError,
  setGetingLocation,
  addressCoords,
}) => {
  // hooks
  const { getMapLocation } = useMap();
  const mapPinAddress = useAppSelector(
    (state) => state.storeConfig.data?.storeConfig.google_map_pin_address
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
    version: "beta",
  });

  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.LatLngLiteral>(center);
  const [inputValue, setInputValue] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  // AutocompleteService and Geocoder references
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  // Initialize services after the Google Maps API is loaded
  useEffect(() => {
    if (isLoaded) {
      setAutocompleteService(new google.maps.places.AutocompleteService());
      setGeocoder(new google.maps.Geocoder());
    }
  }, [isLoaded]);
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);

    if (event.target.value && autocompleteService) {
      autocompleteService.getPlacePredictions(
        { input: event.target.value },
        (results) => {
          if (results) {
            setPredictions(results);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handleSelectSuggestion = (placeId: string) => {
    if (geocoder) {
      geocoder.geocode({ placeId }, (results, status) => {
        if (status === "OK" && results && results[0].geometry?.location) {
          const location = results[0].geometry.location;
          const lat = parseFloat(location.lat().toFixed(7));
          const lng = parseFloat(location.lng().toFixed(7));

          const normalizedLocation = { lat, lng };

          setSelectedLocation(normalizedLocation);
          setInputValue(results[0].formatted_address || "");
          setPredictions([]);

          getMapLocation({
            input: { input: normalizedLocation },
            onError,
            onSuccess: (locationDetail) => {
              onGetingLocation(locationDetail, normalizedLocation);
            },
            setGetingLocation,
          });
        }
      });
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(7));
          const lng = parseFloat(position.coords.longitude.toFixed(7));
          const normalizedLocation = { lat, lng };

          setSelectedLocation(normalizedLocation);
          getMapLocation({
            input: { input: normalizedLocation },
            onError,
            onSuccess: (locationDetail) => {
              onGetingLocation(locationDetail, normalizedLocation);
            },
            setGetingLocation,
          });
        },
        (error) => {
          console.error("Error getting current location: ", error);
          onError(error as any);
        }
      );
    }
  };

  useEffect(() => {
    if (addressCoords) {
      setSelectedLocation({
        lat: addressCoords.lat,
        lng: addressCoords.lng,
      });
      
    } else if (mapPinAddress?.latitude && mapPinAddress.longitude) {
      setSelectedLocation({
        lat: parseFloat(mapPinAddress?.latitude),
        lng: parseFloat(mapPinAddress?.longitude),
      });
    }

    // console.log("address coords", addressCoords);
    // console.log("BE given coods", mapPinAddress);
  }, [mapPinAddress, addressCoords]);

  // console.log("selected location", selectedLocation);
  // console.log("address coords", addressCoords);
  
  // useEffect(() => {
  //   if (
  //     addressCoords
  //   ) {
  //     console.log("address coords", addressCoords);

  //   }
  // }, [addressCoords]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className={`google_map_wraper ${styles.google_map_wraper}`}>
      <button className="current_location_btn" onClick={handleCurrentLocation}>
        <LocateFixed />
        <span>Use Current Location</span>
      </button>

      {/* Custom Autocomplete input for location search */}
      <div className="input_grup">
        <Input
          type="text"
          placeholder="Search a location"
          value={inputValue}
          onChange={handleInputChange}
        />
        {predictions.length > 0 && (
          <div className="autocomplete-suggestions">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(prediction.place_id)}
              >
                {prediction.description}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Map with marker */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedLocation}
        zoom={15}
        onClick={(e) => {
          const lat = parseFloat(e.latLng!.lat().toFixed(7));
          const lng = parseFloat(e.latLng!.lng().toFixed(7));
          const normalizedLocation = { lat, lng };

          setSelectedLocation(normalizedLocation);
          getMapLocation({
            input: { input: normalizedLocation },
            onError,
            onSuccess: (locationDetail) => {
              onGetingLocation(locationDetail, normalizedLocation);
            },
            setGetingLocation,
          });
        }}
      >
        <Marker
          position={selectedLocation}
          draggable // Enables dragging of the marker
          onDragEnd={(e) => {
            const lat = parseFloat(e.latLng!.lat().toFixed(7));
            const lng = parseFloat(e.latLng!.lng().toFixed(7));
            const normalizedLocation = { lat, lng };

            setSelectedLocation(normalizedLocation);
            getMapLocation({
              input: { input: normalizedLocation },
              onError,
              onSuccess: (locationDetail) => {
                onGetingLocation(locationDetail, normalizedLocation);
              },
              setGetingLocation,
            });
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
