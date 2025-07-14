import { Breadcrumb, ProductInterface } from "@/generated/types";
import { useAppSelector } from "@/redux/hooks";
import React, { useMemo } from "react";

export interface UseProductProps {
  product: ProductInterface | null;
}
function useProduct({ product }: UseProductProps) {
  // hooks
  const wishlistItems = useAppSelector(
    (state) => state.wishlist.data?.items_v2?.items
  );

  const mpProductLabel = product?.mp_label_data?.[0] || null;
  const productImages = useMemo(() => product?.media_gallery, [product]);
  const productImage = useMemo(() => product?.image, [product]);
  const productVideos = product?.product_videos;
  const title = product?.name;
  const price = useMemo(
    () => product?.price_range?.minimum_price?.final_price.value,
    [product]
  );
  // const stockStatus = useMemo(
  //   () => (product?.stock_status === "IN_STOCK" ? "In Stock" : "Out of stock"),
  //   [product]
  // );
  const isInStock = useMemo(
    () => product?.stock_status === "IN_STOCK",
    [product]
  );
  const shortDescription = useMemo(() => product?.short_description, [product]);
  const qtyRemains = useMemo(() => product?.only_x_left_in_stock, [product]);

  const breadCrumbs = useMemo(() => {
    const catListOfAvilableBreadcrumbs = product?.categories?.filter(
      (item) => item?.breadcrumbs?.length
    );
    const lastBreadcrumbCatItem = catListOfAvilableBreadcrumbs?.length
      ? catListOfAvilableBreadcrumbs?.find(
          (item, index) => index === catListOfAvilableBreadcrumbs?.length - 1
        )
      : product?.categories?.[0]
      ? product?.categories?.[0]
      : null;

    if (!!lastBreadcrumbCatItem) {
      const breadcrumbs = [
        ...(lastBreadcrumbCatItem?.breadcrumbs || []),
        {
          category_name: lastBreadcrumbCatItem?.name,
          category_url_key: lastBreadcrumbCatItem?.url_key,
          category_url_path: lastBreadcrumbCatItem?.url_path,
        },
      ];

      return breadcrumbs;
    } else {
      return null;
    }
  }, [product]);

  const productLink = useMemo(() => {
    if (product?.url_rewrites?.length) {
      return product.url_rewrites?.[product.url_rewrites?.length - 1]?.url;
    } else {
      return `${product?.url_key}${product?.url_suffix}`;
    }
  }, [product]);

  const crossSellingProducts = useMemo(
    () => product?.crosssell_products,
    [product]
  );
  const upSellingProducts = useMemo(() => product?.upsell_products, [product]);
  const relatedProducts = useMemo(() => product?.related_products, [product]);
  const descriptionHtml = useMemo(() => product?.description?.html, [product]);
  const reviewCount = useMemo(() => product?.review_count, [product]);
  const sku = useMemo(() => product?.sku, [product]);
  const isConfigurable = useMemo(
    () =>
      (product as ProductInterface & { __typename: string })?.__typename ===
      "ConfigurableProduct",
    [product]
  );
  const categories = useMemo(()=> product?.categories, [product]);
  
  

  return {
    mpProductLabel,
    productImages,
    productVideos,
    title,
    price,
    // stockStatus,
    shortDescription,
    qtyRemains,
    breadCrumbs,
    productLink,
    crossSellingProducts,
    upSellingProducts,
    relatedProducts,
    descriptionHtml,
    reviewCount,
    sku,
    productImage,
    isInStock,
    isConfigurable,
    categories
  };
}

export default useProduct;
