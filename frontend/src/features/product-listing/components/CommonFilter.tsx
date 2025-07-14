import { KeyValuePair } from "@/app/[...slug]/page";
import { AggregationOption } from "@/generated/types";
import React, { useContext } from "react";
import style from "../styles/filter.module.scss";
import {
  ContextControllerType,
  FilterStateContext,
} from "../hooks/productFilterContext";

interface CommonFilterProps {
  label: string;
  options: AggregationOption[];
  attrCode: string;
  searchParams: KeyValuePair;
  onFilter?: ()=> void

}
function CommonFilter({ label, options, attrCode }: CommonFilterProps) {
  const filterContext = useContext<ContextControllerType>(FilterStateContext);

  const onSelectItem = (opt: AggregationOption) => {
    if (filterContext?.filterState?.[attrCode] === opt?.value) {
      filterContext?.deleteFilter(attrCode);
    } else {
      filterContext?.updateFilter(attrCode, opt?.value as string);
    }
  };
  const isSelected = (opt: AggregationOption) => {
    if (filterContext?.filterState?.[attrCode] === opt?.value) {
      return "selected";
    }
  };

  return (
    <div className={`common_filter ${style.common_filter}`}>
      <h2 className="sentence_case">{`Filter by ${label}`}</h2>
      <ul className="color_list">
        {options.map((opt, i) => (
          <li key={i}>
            <button onClick={() => onSelectItem(opt)}>
              <div className="clr_block">
                <span className={`checker ${isSelected(opt)}`}></span>
                <span className="label">{opt.label}</span>
              </div>
              <span className="count">{opt.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommonFilter;
