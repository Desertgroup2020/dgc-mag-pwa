import { gql } from "@apollo/client";

const billingAddressFragment = gql`
  fragment BillingAddressFragment on BillingCartAddress {
    firstname
    lastname
    customer_address_id
    city
    street
    country {
      code
      label
    }
    region {
      label
      region_id
      code
    }
    postcode
    telephone
    uid
  }
`;

export default billingAddressFragment
