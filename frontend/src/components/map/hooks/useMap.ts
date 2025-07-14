import React, { SetStateAction, useState } from "react";
import GET_LOCATION_DETAILS_FROM_COORDS, {
  GetLocationFromCoordsType,
} from "../apollo/queries";
import makeClient from "@/lib/apollo/apolloProvider";

function useMap() {
  const client = makeClient();

  // states
  // const [getingLocation, setGetingLocation] = useState(false);

  const getMapLocation = async ({
    input,
    onSuccess,
    onError,
    setGetingLocation
  }: {
    onSuccess: (locationDetails: GetLocationFromCoordsType["Response"]) => void;
    onError: (errMsg: string) => void;
    input: GetLocationFromCoordsType["Variables"];
    setGetingLocation: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
    setGetingLocation(true);
    try {
      if (input.input.lat && input.input.lng) {
        const addressFields = await client.query<
          GetLocationFromCoordsType["Response"],
          GetLocationFromCoordsType["Variables"]
        >({
          query: GET_LOCATION_DETAILS_FROM_COORDS,
          variables: {
            input: input.input,
          },
        });

        if (addressFields.data.getAddress) {
          onSuccess(addressFields.data);
          setGetingLocation(false);
        }
      }
    } catch (err) {
      onError(err as string);
      setGetingLocation(false);
    }
  };

  return {
    getMapLocation,
  };
}

export default useMap;
