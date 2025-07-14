import { gql } from "@apollo/client";
import shippingAddressFragment from "./shippingAddressFragment";
import billingAddressFragment from "./billingAddressFragment";
import cartItemFragment from "./cartItemFragment";

const cartFragment = gql`
  ${shippingAddressFragment}
  ${billingAddressFragment}
  ${cartItemFragment}
  fragment CartFragment on Cart {
    id
    email
    total_quantity
    freeshipping_note
    gtm_add_to_cart
    gtm_remove_from_cart

    gift_message {
      from
      to
      message
    }
    applied_coupons {
      code
    }

    available_payment_methods {
      code
      title
    }
    selected_payment_method {
      code
      purchase_order_number
      title
    }
    shipping_addresses {
      ...ShippingAddressFragment
    }
    billing_address {
      ...BillingAddressFragment
    }

    prices {
      mp_reward_segments {
        code
        title
        value
      }

      grand_total {
        value
      }
      subtotal_including_tax {
        value
      }

      applied_taxes {
        amount {
          value
        }
        label
      }
      discounts {
        label
        amount {
          value
        }
      }
    }

    itemsV2 {
      items {
        ...CartItemFragment

        ... on BundleCartItem {
          bundle_options {
            uid
            label
            type
            values {
              id
              label
              price
              quantity
            }
          }
        }
      }
      page_info {
        current_page
        page_size
        total_pages
      }
      total_count
    }
  }
`;

export default cartFragment;
