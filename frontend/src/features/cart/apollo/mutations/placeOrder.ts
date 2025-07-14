import { PlaceOrderInput, PlaceOrderOutput } from "@/generated/types";
import { gql } from "@apollo/client";

const PLACE_ORDER = gql`
  mutation placeOrder($input: PlaceOrderInput) {
    placeOrder(input: $input) {
      errors {
        code
        message
      }
      orderV2 {
        id
        number
        total {
          grand_total {
            value
          }
        }
        items {
          quantity_ordered
          product_sku
          discounts {
            label
            amount {
              value
            }
          }
          product {
            name
            sku
            price_range {
              minimum_price {
                regular_price {
                  value
                }
                final_price {
                  value
                  currency
                }
              }
              maximum_price {
                final_price {
                  value
                }
              }
            }
            special_price
          }
        }
        applied_coupons {
          code
        }
      }
    }
  }
`;

export type PlaceOrderType = {
  Response: {
    placeOrder: PlaceOrderOutput;
  };
  Variables: {
    input: PlaceOrderInput;
  };
};

export default PLACE_ORDER;
