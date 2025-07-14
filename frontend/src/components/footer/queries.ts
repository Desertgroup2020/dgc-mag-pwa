import { Menu } from "@/generated/types";
import { gql } from "@apollo/client";

export const GET_DYNAMIC_MENU_FOOTER = gql`
  query getFooterMenu {
    getMenu {
      footerMenu {
        categories {
          link
          text
        }
        usefulLinks {
          link
          text
        }
      }
    }
  }
`;

export type GetDynamicMenuType = {
  Response: {
    getMenu: Menu;
  };
};
