"use client";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCountryCodes, getEmirates } from "./utils";
import { Country, Emirates, Region } from "@/generated/types";

interface AppWrapperprops {
  children: React.ReactNode;
}

type CountryCodeContextType = {
  countries: Country[];
  emirates: Emirates[];
  // currentCountry: Country;
  // setCurrentCountry: Dispatch<SetStateAction<Country>>;
} | null;
const CountryCodeContext = React.createContext<CountryCodeContextType>(null);

const CountryCodeProvider: React.FC<AppWrapperprops> = ({ children }) => {
  // states
  const [countryCodes, setCountryCodes] = useState<Country[]>([]);
  const [emirates, setEmirates] = useState<Emirates[]>([]);
  // const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  // const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  // effects
  useEffect(() => {
    getCountryCodes().then(setCountryCodes);
  }, []);
  useEffect(() => {
    getEmirates().then(setEmirates);
  }, []);

  // useEffect(() => {
  //   if (countryCodes.length) {
  //     const defaultCountry = countryCodes.find(
  //       (country) => country.id === "AE"
  //     );

  //     if (defaultCountry) setCurrentCountry(defaultCountry);
  //   }
  // }, [countryCodes]);

  // useEffect(() => {
  //   if (currentCountry?.available_regions?.length) {
  //     const selectedRegion = currentCountry.available_regions?.[0];

  //     if (selectedRegion) {
  //       setSelectedRegion(selectedRegion);
  //     }
  //   }
  // }, [currentCountry]);

  const providerObj = {
    countries: countryCodes,
    emirates
    // currentCountry: currentCountry,
    // setCurrentCountry: setCurrentCountry,
    
  } as CountryCodeContextType;

  return (
    <CountryCodeContext.Provider value={providerObj as CountryCodeContextType}>
      {children}
    </CountryCodeContext.Provider>
  );
};

export default CountryCodeProvider;

// export const useCountryCodes = () => useContext(CountryCodeContext);
export const useCountryCodes = () => {
  const context = useContext(CountryCodeContext);
  if (!context) {
    throw new Error("useCountryCodes must be used within a CountryCodeContext");
  }
  return context;
};

export type CountryCode =
  | "AC"
  | "AD"
  | "AE"
  | "AF"
  | "AG"
  | "AI"
  | "AL"
  | "AM"
  | "AO"
  | "AR"
  | "AS"
  | "AT"
  | "AU"
  | "AW"
  | "AX"
  | "AZ"
  | "BA"
  | "BB"
  | "BD"
  | "BE"
  | "BF"
  | "BG"
  | "BH"
  | "BI"
  | "BJ"
  | "BL"
  | "BM"
  | "BN"
  | "BO"
  | "BQ"
  | "BR"
  | "BS"
  | "BT"
  | "BW"
  | "BY"
  | "BZ"
  | "CA"
  | "CC"
  | "CD"
  | "CF"
  | "CG"
  | "CH"
  | "CI"
  | "CK"
  | "CL"
  | "CM"
  | "CN"
  | "CO"
  | "CR"
  | "CU"
  | "CV"
  | "CW"
  | "CX"
  | "CY"
  | "CZ"
  | "DE"
  | "DJ"
  | "DK"
  | "DM"
  | "DO"
  | "DZ"
  | "EC"
  | "EE"
  | "EG"
  | "EH"
  | "ER"
  | "ES"
  | "ET"
  | "FI"
  | "FJ"
  | "FK"
  | "FM"
  | "FO"
  | "FR"
  | "GA"
  | "GB"
  | "GD"
  | "GE"
  | "GF"
  | "GG"
  | "GH"
  | "GI"
  | "GL"
  | "GM"
  | "GN"
  | "GP"
  | "GQ"
  | "GR"
  | "GT"
  | "GU"
  | "GW"
  | "GY"
  | "HK"
  | "HN"
  | "HR"
  | "HT"
  | "HU"
  | "ID"
  | "IE"
  | "IL"
  | "IM"
  | "IN"
  | "IO"
  | "IQ"
  | "IR"
  | "IS"
  | "IT"
  | "JE"
  | "JM"
  | "JO"
  | "JP"
  | "KE"
  | "KG"
  | "KH"
  | "KI"
  | "KM"
  | "KN"
  | "KP"
  | "KR"
  | "KW"
  | "KY"
  | "KZ"
  | "LA"
  | "LB"
  | "LC"
  | "LI"
  | "LK"
  | "LR"
  | "LS"
  | "LT"
  | "LU"
  | "LV"
  | "LY"
  | "MA"
  | "MC"
  | "MD"
  | "ME"
  | "MF"
  | "MG"
  | "MH"
  | "MK"
  | "ML"
  | "MM"
  | "MN"
  | "MO"
  | "MP"
  | "MQ"
  | "MR"
  | "MS"
  | "MT"
  | "MU"
  | "MV"
  | "MW"
  | "MX"
  | "MY"
  | "MZ"
  | "NA"
  | "NC"
  | "NE"
  | "NF"
  | "NG"
  | "NI"
  | "NL"
  | "NO"
  | "NP"
  | "NR"
  | "NU"
  | "NZ"
  | "OM"
  | "PA"
  | "PE"
  | "PF"
  | "PG"
  | "PH"
  | "PK"
  | "PL"
  | "PM"
  | "PR"
  | "PS"
  | "PT"
  | "PW"
  | "PY"
  | "QA"
  | "RE"
  | "RO"
  | "RS"
  | "RU"
  | "RW"
  | "SA"
  | "SB"
  | "SC"
  | "SD"
  | "SE"
  | "SG"
  | "SH"
  | "SI"
  | "SJ"
  | "SK"
  | "SL"
  | "SM"
  | "SN"
  | "SO"
  | "SR"
  | "SS"
  | "ST"
  | "SV"
  | "SX"
  | "SY"
  | "SZ"
  | "TA"
  | "TC"
  | "TD"
  | "TG"
  | "TH"
  | "TJ"
  | "TK"
  | "TL"
  | "TM"
  | "TN"
  | "TO"
  | "TR"
  | "TT"
  | "TV"
  | "TW"
  | "TZ"
  | "UA"
  | "UG"
  | "US"
  | "UY"
  | "UZ"
  | "VA"
  | "VC"
  | "VE"
  | "VG"
  | "VI"
  | "VN"
  | "VU"
  | "WF"
  | "WS"
  | "XK"
  | "YE"
  | "YT"
  | "ZA"
  | "ZM"
  | "ZW";
