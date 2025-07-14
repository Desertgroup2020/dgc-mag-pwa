import { Address, GetLatLong } from "@/generated/types";
import { gql } from "@apollo/client";

const GET_LOCATION_DETAILS_FROM_COORDS = gql`
  query getLocationFromCoords($input: GetLatLong) {
    getAddress(input: $input) {
      city
      country
      postcode
      state
      street
    }
  }
`;

export type GetLocationFromCoordsType = {
    Response: {
        getAddress: Address[]
    },
    Variables: {
        input: GetLatLong
    }
}

export default GET_LOCATION_DETAILS_FROM_COORDS
