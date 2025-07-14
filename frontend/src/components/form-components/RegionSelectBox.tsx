import { useAddressContext } from "@/features/checkout/hooks/addressContext";
import { Region } from "@/generated/types";
import { CountryCode, useCountryCodes } from "@/lib/countryCodes";
import React, { useEffect, useState } from "react";

interface RegionSelectBoxProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onSelectRegion: (region: Region) => void; // Callback function
  regions: Region[];
  regionId?: number | null;
}
function RegionSelectBox({
  onSelectRegion,
  regions,
  regionId,
  ...props
}: RegionSelectBoxProps) {
  const { emirates } = useCountryCodes();

  // states
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  // features
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionName = e.target.value;
    const selectedRegion = regions?.find(
      (region) => region?.name === selectedRegionName
    );

    if (selectedRegion) {
      setSelectedRegion(selectedRegion);
      onSelectRegion(selectedRegion);
    }
  };

  //effects
  useEffect(() => {
    const region = regions.find((region) => region.id == regionId);

    if (region) {
      setSelectedRegion(region);
      onSelectRegion(region);
    }

    // console.log("region frm region select box", region);
    // console.log("regions frm region select box", regions);
    
  }, [onSelectRegion, regionId, regions]);


  if (!regions?.length) return null;
  return (
    <div className="country_select region">
      <select
        id="region-select"
        value={selectedRegion?.name || ""}
        onChange={handleChange}
        {...props}
      >
        {regions.map((region) => (
          <option key={region?.id} value={region?.name!}>
            {region?.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RegionSelectBox;
