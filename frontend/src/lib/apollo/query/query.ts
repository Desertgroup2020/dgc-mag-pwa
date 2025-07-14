import { Country, Emirates } from "@/generated/types";
import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query getCountries {
    countries {
      available_regions {
        code
        id
        name
      }
      full_name_english
      full_name_locale
      id
      three_letter_abbreviation
      two_letter_abbreviation
    }
  }
`;

export type GetCountriesType = {
  Response: {
    countries: Country[];
  };
};

export const GET_EMIRATES = gql`
  query getEmirates {
    getEmirates {
      name
      region {
        id
        name
      }
    }
  }
`;

export type GetEmiratesType = {
  Response: {
    getEmirates: Emirates[]
  }
}
