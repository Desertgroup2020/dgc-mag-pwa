import React, { useState } from "react";
import useHot from "../hooks/useHot";


interface ProductTypeSelectBoxProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onSelectProductType: (productType: string) => void; // Callback function
}
function ProductTypeSelectBox({onSelectProductType, ...props}: ProductTypeSelectBoxProps) {
  const {productTypes} = useHot();

  // states
    const [selectedProductType, setSelectedProductType] = useState<string>("");

    // features
    const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const productType = e.target.value;

      if(productType){
        setSelectedProductType(productType)
        onSelectProductType(productType)
      }
    }

  return (
    <div className="country_select product_type">
      <select
        id="emirate-select"
        value={selectedProductType}
        onChange={handleProductTypeChange}
        {...props}
      >
        {productTypes.map((productType, i) => (
          <option key={i} value={productType}>
            {productType}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductTypeSelectBox;
