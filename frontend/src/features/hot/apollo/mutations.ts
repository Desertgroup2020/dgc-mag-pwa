import { HotRequestOutput } from "@/generated/types";
import { gql } from "@apollo/client";

const CREATE_HOT_REQUEST = gql`
  mutation createHotRequest(
    $firstName: String!
    $lastName: String!
    $email: String!
    $mobile: String!
    $furnitureType: String!
    $message: String!
    $size: String
    $material: String
    $color: String
  ) {
    createHotRequest(
      firstName: $firstName
      lastName: $lastName
      email: $email
      mobile: $mobile
      furnitureType: $furnitureType
      size: $size
      material: $material
      color: $color
      message: $message
    ) {
      message
      success
    }
  }
`;

export type CreateHotRequestType = {
  Response: {
    createHotRequest: HotRequestOutput;
  };
  Variables: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    furnitureType: string;
    size: string;
    material: string;
    color: string;
    message: string;
  };
};

export default CREATE_HOT_REQUEST;
