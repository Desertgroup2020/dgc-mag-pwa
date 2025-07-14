"use client";

import { ProductBlock, ProductInterface } from "@/generated/types";
import React, { useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import useProduct from "@/components/product/useProduct";
import { useAppSelector } from "@/redux/hooks";

interface ProductBlockClientProps {
  productBlock: ProductBlock;
}
interface HomeProductCardProps {
  product: ProductInterface;
  clasName?: string;
}

const HomeProductLinkMaker = ({
  product,
  i,
}: {
  product: ProductInterface;
  i: number;
}) => {
  const { productLink } = useProduct({ product });

  return (
    <Link href={`/${productLink}`}>
      <ProductCard
        product={product as ProductInterface}
        clasName={(i + 1) % 2 === 0 ? "item_even" : "item_odd"}
      />
    </Link>
  );
};

export function ProductCarousel({
  products,
}: {
  products: ProductInterface[];
}) {
  // hooks
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  // fetures
  const canAllowNavs = useCallback(() => {
    if (winWidth > 1200) {
      return products.length > 4;
    } else if (winWidth > 991) {
      return products.length > 3;
    } else if (winWidth > 776) {
      return products.length > 2;
    } else {
      return products.length > 1;
    }
  }, [winWidth, products]);

  return (
    <Carousel className="product_carousel">
      <CarouselContent className="ml-0">
        {products?.map((product, i) => {
          return (
            <CarouselItem
              key={product?.sku}
              className={`pl-0 carousel_item mobile_basis-100 ipad:basis-1/2 ipadpro:basis-1/3 basis-1/4`}
            >
              <HomeProductLinkMaker
                i={i}
                product={product as ProductInterface}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {canAllowNavs() ? (
        <div className="controls">
          <CarouselPrevious className="nav nav_prev static translate-y-0" />
          <CarouselNext className="nav nav_next static translate-y-0" />
        </div>
      ) : null}
    </Carousel>
  );
}

function ProductBlockClient({ productBlock }: ProductBlockClientProps) {
  return (
    <ProductCarousel products={productBlock.products as ProductInterface[]} />
  );
}

export default ProductBlockClient;
