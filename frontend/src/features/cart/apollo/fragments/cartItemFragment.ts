import { PRODUCTS_FRAGMENT_PDP } from "@/features/dynamic-url/apollo/fragments/product";
import { gql } from "@apollo/client";

const cartItemFragment = gql`
  ${PRODUCTS_FRAGMENT_PDP}
  fragment CartItemFragment on CartItemInterface {
    uid
    quantity
    prices {
      price {
        value
      }
      row_total {
        value
      }

      total_item_discount {
        value
      }
    }
    product {
      ...ProductItem
      crosssell_products{
        ...ProductItem
      }
    }
    ... on ConfigurableCartItem {
      configurable_options {
        option_label
        value_label
      }      
    }
  }
`;

export default cartItemFragment;
