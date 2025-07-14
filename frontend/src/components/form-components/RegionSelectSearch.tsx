import { useAddressContext } from "@/features/checkout/hooks/addressContext";
import { Region } from "@/generated/types";
import { CountryCode, useCountryCodes } from "@/lib/countryCodes";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import { debounce } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { delay } from "@/utils";
import CircularProgress from "../icons/CircularProgress";

interface RegionSelectBoxProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onSelectRegion: (region: Region) => void; // Callback function
  regions: Region[];
  regionId?: number | null;
}

const filterRegionsAsync = (
  regions: Region[],
  keyWords: string,
  delay = 300
): Promise<Region[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredRegions = regions.filter((region) =>
        region.name?.toLowerCase().includes(keyWords.toLowerCase())
      );

      // Resolve the promise with the matched regions or the full array if no match
      resolve(filteredRegions.length > 0 ? filteredRegions : regions);
    }, delay); // Delay in milliseconds
  });
};
function RegionSelectBox({
  onSelectRegion,
  regions,
  regionId,
  ...props
}: RegionSelectBoxProps) {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { emirates } = useCountryCodes();

  // states
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [filteredRegions, setFilteredRegions] = useState<Region[] | null>(null);
  const [filtering, setFiltering] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  // features
  const handleSelectRegion = (region: Region) => {
    const selectedRegionName = region.name;
    const selectedRegion = regions?.find(
      (region) => region?.name === selectedRegionName
    );

    if (selectedRegion) {
      setSelectedRegion(selectedRegion);
      onSelectRegion(selectedRegion);
      if (searchRef.current) searchRef.current.value = "";
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearchRegion = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      const keyWords = e.target.value;

      setFiltering(true);
      filterRegionsAsync(regions, keyWords, 1000)
        .then((filteredRegions) => {
            // console.log("filtered region", filteredRegions);
            
          setFilteredRegions(filteredRegions);
        })
        .finally(() => {
          setFiltering(false);
        });
    }, 1000),
    [regions]
  );

  //effects
  useEffect(() => {
    const region = regions.find((region) => region.id == regionId);

    if (region) {
      setSelectedRegion(region);
      onSelectRegion(region);
    }
    if (regions.length) {
      setFilteredRegions(regions);
    }
    // console.log("region frm region select box", region);
    // console.log("regions frm region select box", regions);
  }, [onSelectRegion, regionId, regions]);

  if (!regions?.length) return null;
  return (
    <div className="country_select region">
      <Popover open={resultOpen} modal={true}>
        <PopoverTrigger className="flex items-center" asChild>
          <div
            role="combobox"
            aria-expanded={resultOpen}
            aria-controls="region-search-results" // Points to the dropdown element ID
          >
            {/* <div className="input_grup"> */}
            <div className="region_search_input_wrap">
              <Input
                ref={searchRef}
                type="text"
                placeholder={selectedRegion?.name || "Region"}
                onChange={(e) => {
                  setResultOpen(true);
                  onSearchRegion(e);
                }}
                onFocus={() => {
                  setResultOpen(true);
                }}
                onBlur={async () => {
                  await delay(20);
                  setResultOpen(false);
                }}
              />
              {filtering ? (
                <CircularProgress className="progress" width={20} />
              ) : null}
            </div>
            {/* </div> */}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="search_popover region"
          id="region-search-results"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            // if (!e.target.closest('.search_input_wrapper')) {
            //   setPopOpen(false);
            // }
          }}
        >
          <div className={`region_search_results`}>
            <ul className="search_results">
              {filteredRegions?.map((region) => (
                <li key={region.id}>
                  <button
                    className="search_item"
                    onClick={() => handleSelectRegion(region)}
                  >
                    {region.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default RegionSelectBox;
