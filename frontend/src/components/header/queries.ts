import { Menu } from "@/generated/types";
import { gql } from "@apollo/client";

export const GET_DYNAMIC_MENU = gql`
  query getHeaderMenu {
    getMenu {
      headerMenu {
        menuItems {
          link
          text
        }
      }
    }
  }
`;

export type GetDynamicMenuType = {
    Response: {
        getMenu: Menu
    }
}
