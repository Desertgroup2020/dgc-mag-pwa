import { PRODUCTS_FRAGMENT_ORDER } from "@/features/dynamic-url/apollo/fragments/product";
import { gql } from "@apollo/client";

export const customerAddressFragment = gql`
  fragment customerAddressFragment on CustomerAddress {
    city
    company
    country_code
    country_id
    custom_attributesV2 {
      code
      ... on AttributeValue {
        value
      }
      ... on AttributeSelectedOptions {
        selected_options {
          label
          value
        }
      }
    }
    customer_id
    default_billing
    default_shipping
    extension_attributes {
      attribute_code
      value
    }
    fax
    firstname
    id
    lastname
    middlename
    postcode
    prefix
    region {
      region
      region_code
      region_id
    }
    region_id
    street
    suffix
    telephone
    vat_id
  }
`;

export const customerFragment = gql`
  ${customerAddressFragment}
  ${PRODUCTS_FRAGMENT_ORDER}
  fragment Customer on Customer {
    additional_info {
      profile_type
    }
    token
    firstname
    lastname
    email
    mobilenumber
    id
    wishlists {
      id
    }
    orders(pageSize: 300) {
      items {
        number
        id
        total {
          subtotal {
            value
          }
          discounts {
            amount {
              value
            }
          }
          taxes {
            amount {
              value
            }
          }
          total_shipping {
            value
          }
          grand_total {
            value
          }
        }
        shipping_address {
          firstname
          lastname
          street
          city
          postcode
          region
          country_code
        }
        billing_address {
          firstname
          lastname
          street
          city
          postcode
          region
          country_code
        }
        order_date
        order_number
        items {
          __typename
          product_name
          product_sale_price {
            value
          }
          product {
            ...ProductItem
          }
          id
          product_url_key
          product_sku
          quantity_ordered
          entered_options {
            label
            value
          }
          selected_options {
            label
            value
          }
          product_name
          product_type
          product_image
        }
        shipping_method
        status
        payment_methods {
          name
        }
      }
      total_count
      page_info {
        page_size
        total_pages
        current_page
      }
    }

    mp_reward {
      point_balance
      point_earned
      point_spent
      reward_id
      refer_code
      transactions(pageSize: 50) {
        items {
          point_amount
          action_code
          created_at
          expiration_date
          status
          action_type
          point_remaining
          point_used
          order_id
          transaction_id
          comment
        }
      }
    }
    additional_info {
      approval_status
      company_name
      customer_proof
      licence_number
      mobilenumber
      profile_type
    }
    addresses {
      ...customerAddressFragment
    }
  }
`;
export const customerFragmentWithoutReward = gql`
  ${customerAddressFragment}
  fragment Customer on Customer {
    additional_info {
      profile_type
    }
    token
    firstname
    lastname
    email
    mobilenumber
    id
    additional_info {
      approval_status
      company_name
      customer_proof
      licence_number
      mobilenumber
      profile_type
    }
    addresses {
      ...customerAddressFragment
    }
  }
`;
