import { gql } from "@apollo/client";

const shippingAddressFragment = gql`
  fragment ShippingAddressFragment on ShippingCartAddress {
    firstname
    lastname
    city
    street
    customer_notes
    customer_address_id
    uid
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
    available_shipping_methods {
      amount {
        value
        currency
      }
      available
      carrier_code
      carrier_title
      error_message
      method_title
      method_code
    }
    selected_shipping_method {
      amount {
        value
      }
      carrier_code
      carrier_title
      method_title
      method_code
    }
  }
`;

export default shippingAddressFragment
