import { AggregationOption } from "@/generated/types";
import { usePrice } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import { useFilterContext } from "../hooks/productFilterContext";
import { Slider } from "@/components/ui/slider";
import { deepEquals } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KeyValuePair } from "@/app/[...slug]/page";
import style from "../styles/filter.module.scss";

interface PriceFilterProps {
  label: string;
  options: AggregationOption[];
  attrCode: string;
  searchParams: KeyValuePair;
  onFilter?: ()=> void
}
function PriceFilter({
  label,
  options,
  attrCode,
  searchParams,
  
}: PriceFilterProps) {
  const { renderPrice } = usePrice();
  const filterContext = useFilterContext();
  const sliderRef = useRef(null);
  //gather info about the price slider

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [step, setStep] = useState<number>(200);
  const [urlValue, setUrlValue] = useState<number[]>([minPrice, maxPrice]);
  const [values, setValues] = useState<number[]>(() => {
    return [minPrice, maxPrice];
  });
  const [priceRange, setPriceRange] = useState<number[]>(() => {
    return [minPrice, maxPrice];
  });

  const handlePriceChange = (newValues: number[]) => {
    if (!deepEquals(priceRange, newValues)) {
      setPriceRange(newValues);
    }
  };
  const handleSliderChange = (newValues: number[]) => {
    // console.log("sldier chnage", newValues);
    
    setValues(newValues);
  };

  const onFilter = () => {
    filterContext?.updateFilter(attrCode, values.join("_"));
  };

  useEffect(() => {
    const priceFromUrl = searchParams?.price;
    const parsedPriceArray = (priceFromUrl as string)?.split("_");
    if (parsedPriceArray?.length) {
      const valuesForSlider = parsedPriceArray.reduce(
        (acc, item) => [...acc, parseInt(item)],
        [] as number[]
      );
      setValues(valuesForSlider);
      setPriceRange(valuesForSlider);
      setUrlValue(valuesForSlider);
    } else {
      if (options.length) {
        const lastIndex = (options?.length || 0) - 1;
        const minPrice = Number(options?.[0]?.value.split("_")[0]);
        const maxPrice = Number(options?.[lastIndex]?.value.split("_")[1]);
        const step = Math.round((maxPrice - minPrice) / 100);

        setMinPrice(minPrice);
        setMaxPrice(maxPrice);
        setStep(step);
        setPriceRange([minPrice, maxPrice]);
        setValues([minPrice, maxPrice]);        
        setUrlValue([minPrice, maxPrice]);        
      }
    }
  }, [options, searchParams]);


  // console.log("min price", minPrice);
  // console.log("max price", maxPrice);
  // console.log("values", values);
  
  // console.log("url values", urlValue);

  return (
    <div className={`price_filter ${style.price_filter}`}>
      <h2 className="sentence_case">{`Filter by ${label}`}</h2>
      <Slider
        value={[values[0], values[1]]}
        defaultValue={[values[0], values[1]]}
        minStepsBetweenThumbs={10}
        step={10}
        min={minPrice}
        max={maxPrice}
        onValueChange={handleSliderChange}
        onValueCommit={handlePriceChange}
        className="price_slider"
        ref={sliderRef}
      />
      <div className="contents">
        <div className="price">
          <span className="value">
            {renderPrice(priceRange[0])} - {renderPrice(priceRange[1])}
          </span>
        </div>
        <Button
          variant={"itself"}
          onClick={onFilter}
          disabled={deepEquals(priceRange, urlValue)}
        >
          <span>Filter</span>
        </Button>
      </div>
    </div>
  );
}

export default PriceFilter;
