"use client";

import { FeaturedBrandsBlock } from "@/generated/types";
import makeClient from "@/lib/apollo/apolloProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
interface BrandPageClientProps {
  featuredBrandsBlock: FeaturedBrandsBlock;
}
function BrandPageClient({ featuredBrandsBlock }: BrandPageClientProps) {
  // hooks
  const router = useRouter();

  return (
    <div className="brand_client">
      <div className="container">
        <div className="brand_lister">
          {featuredBrandsBlock.featured_brands?.map((brand, i) => (
            <div className="brand_item" key={brand?.brand_id}>
              <button
                type="button"
                onClick={() => {
                  router.push(`/brands/${brand?.brand_id}`);
                }}
              >
                <Image
                  src={brand?.image || ""}
                  alt={brand?.label || "brand image"}
                  width={200}
                  height={200}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandPageClient;
