import { Emirates } from "@/generated/types";
import { useCountryCodes } from "@/lib/countryCodes";
import React, { useEffect, useState } from "react";

interface EmiratesSelectBoxProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onSelectEmirate: (emrate: Emirates, regionId: any) => void; // Callback function
  regionId?: number | null;
}

function EmiratesSelectBox({
  onSelectEmirate,
  regionId,
  ...props
}: EmiratesSelectBoxProps) {
  const { emirates } = useCountryCodes();

  //   states
  const [selectedEmirate, setSelectedEmirate] = useState<Emirates | null>(null);

  // features
  const handleEmiratesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmirateName = e.target.value;
    const selectedEmirate = emirates.find(
      (emirate) => emirate.name === selectedEmirateName
    );

    if (selectedEmirate) {
      onSelectEmirate(selectedEmirate, selectedEmirate.region?.[0]?.id);
      setSelectedEmirate(selectedEmirate);
    }
  };

  useEffect(() => {
    if (regionId) {
      const emirateCurrespondingRegion = emirates.find((emirate) =>
        emirate.region?.find(
          (region) => region?.id?.toString() == regionId.toString()
        )
      );

      if(emirateCurrespondingRegion){
        setSelectedEmirate(emirateCurrespondingRegion);
        setSelectedEmirate(emirateCurrespondingRegion)
      }
    }
  }, [emirates, regionId]);

  return (
    <div className="country_select emirates">
      <select
        id="emirate-select"
        value={selectedEmirate?.name || ""}
        onChange={handleEmiratesChange}
        {...props}
      >
        {emirates.map((emirate) => (
          <option key={emirate.name} value={emirate.name!}>
            {emirate.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EmiratesSelectBox;
