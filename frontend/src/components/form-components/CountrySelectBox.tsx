import React, { useState, useEffect } from "react";
import { useCountryCodes } from "@/lib/countryCodes";
import { Country } from "@/generated/types";

// type Country = {
//   name: string;
//   dial_code: string;
//   code: string;
// };

interface CountrySelectBoxProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onSelectCountry: (country: Country) => void; // Callback function
  defaultCountryCode?: string; // Optional prop for default country code
}

const CountrySelectBox: React.FC<CountrySelectBoxProps> = ({
  onSelectCountry,
  defaultCountryCode = "AE", // Default to "AE" if no prop is provided
  ...selectProps // Spread operator to capture other props
}) => {
  // Retrieve country data
  const {countries} = useCountryCodes();

  // Default selected country: based on `defaultCountryCode` prop
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>(defaultCountryCode);  

  // Trigger the callback with the default selected country on mount
  useEffect(() => {
    const defaultCountry = countries.find(
      (country) => country.id === defaultCountryCode
    );
    if (defaultCountry) {
      setSelectedCountryCode(defaultCountryCode);
      onSelectCountry(defaultCountry);
    }
  }, [countries, defaultCountryCode, onSelectCountry]);

  // Handle country selection
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    setSelectedCountryCode(selectedCode);

    const selectedCountry = countries.find(
      (country) => country.id === selectedCode
    );
    if (selectedCountry) {
      onSelectCountry(selectedCountry);
      // setCurrentCountry(selectedCountry)
    }
  };

  return (
    <div className="country_select">
      <select
        id="country-select"
        value={selectedCountryCode}
        onChange={handleChange}
        {...selectProps}
      >
        {countries.map((country) => (
          <option key={country.id} value={country.id as string}>
            {country.full_name_english} ({country.id})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelectBox;
