import useProduct from "@/components/product/useProduct";
import { ProductInterface } from "@/generated/types";
import { usePrice } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

type OrderedProductType = {
  product: ProductInterface;
};
function OrderedProduct({ product }: OrderedProductType) {
  const { renderPrice } = usePrice();

  const { productImage, title, productLink, price } = useProduct({
    product: product,
  });

  return (
    <div className="initial_product_block">
      <Link href={`/${productLink}`} >
      <figure className="product_img">
        <Image
          src={`${productImage?.url}`}
          alt={productImage?.label || title || "product image"}
          width={110}
          height={171}
        />
      </figure>
      </Link>
      <div className="description">
        <span className="name">{title}</span>

        <span className="price">{renderPrice(price || 0)}</span>
      </div>
    </div>
  );
}

export default OrderedProduct;
