import { ProductInterface, SearchResultPageInfo } from "@/generated/types";
import React, { MouseEventHandler, useEffect, useMemo, useState } from "react";
import style from "../styles/style.module.scss";
import ProductCard from "@/components/product/ProductCard";
import { KeyValuePair } from "@/app/[...slug]/page";
import {
  getSort,
  queriesToVariables,
} from "@/features/dynamic-url/utils/utils";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import PRODUCTS, {
  ProductsQuery,
} from "@/features/dynamic-url/apollo/queries/productPlp";
import Link from "next/link";
import useProduct from "@/components/product/useProduct";
import makeClient from "@/lib/apollo/apolloProvider";
import VIEW_ALL_PRODUCTS, {
  ViewAllProductsType,
} from "@/features/view-all-products/query/viewallProducts";

interface ProductsHolderProps {
  products: ProductInterface[] | null;
  pageInfo: SearchResultPageInfo | null;
  view: "list" | "grid";
  searchParams: KeyValuePair;
  id: string;
  from: "VIEW_ALL" | "PLP";
  blockId?: number;
}

const ProductLinkMaker = ({
  product,
  i,
}: {
  product: ProductInterface;
  i: number;
}) => {
  const { productLink } = useProduct({ product });

  return (
    <Link href={`/${productLink}`} rel={product.name || ""}>
      <ProductCard
        product={product}
        clasName={(i + 1) % 2 === 0 ? "item_even" : "item_odd"}
      />
    </Link>
  );
};

function ProductsHolder({
  products,
  view,
  pageInfo,
  searchParams,
  id,
  from,
  blockId,
}: ProductsHolderProps) {
  const pathname = usePathname();
  const [clientProducts, setClientProducts] = useState<ProductInterface[] | []>(
    []
  );
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const totalPages = useMemo(
    () => (pageInfo?.total_pages && pageInfo.total_pages) || 1,
    [pageInfo]
  );

  const [currentPage, setCurrentPage] = useState(2);
  useEffect(() => {
    if (products) {
      setClientProducts(products);
      setCurrentPage(2);
    }
  }, [products]);

  const fetchMore: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setFetchingProducts(true);
    let page = currentPage.toString();
    const variables =
      pathname === "/search"
        ? queriesToVariables({ ...searchParams, page })
        : queriesToVariables({ ...searchParams, category_id: id, page });
    if (from === "VIEW_ALL") {
      makeClient()
        .query<
          ViewAllProductsType["Response"],
          ViewAllProductsType["Variables"]
        >({
          query: VIEW_ALL_PRODUCTS,
          variables: {
            currentPage: currentPage,
            pageSize: 12,
            input: {
              Id: blockId,
            },
            sort: getSort({ ...searchParams }) as any,
          },
          fetchPolicy: "no-cache",
        })
        .then(({ data }) => {
          const products = data.viewallProducts.products as
            | ProductInterface[]
            | [];
          setClientProducts((prev) => [...prev, ...products]);
          setCurrentPage((prev) => prev + 1);
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          setFetchingProducts(false);
        });
    } else {
      makeClient()
        .query<ProductsQuery["Response"], ProductsQuery["Variables"]>({
          query: PRODUCTS,
          variables,
          fetchPolicy: "no-cache",
        })
        .then(({ data }) => {
          const products = data.products.items as ProductInterface[] | [];
          setClientProducts((prev) => [...prev, ...products]);
          setCurrentPage((prev) => prev + 1);
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          setFetchingProducts(false);
        });
    }
  };

  // console.log("current page:", currentPage);
  // console.log("total pages:", totalPages);
  // console.log("pathname", pathname);
  

  return (
    <div className={`product_holder_screen ${style.product_holder_screen}`}>
      <ul className={`product_list ${view === "list" ? "list" : ""}`}>
        {clientProducts?.map((product, i) => (
          <li key={product.uid}>
            <ProductLinkMaker i={i} product={product} />
          </li>
        ))}
      </ul>
      {currentPage <= totalPages ? (
        <div className="load_more_wrap">
          <button
            className="load_more"
            onClick={fetchMore}
            disabled={currentPage > totalPages}
          >
            {fetchingProducts ? (
              <LoaderCircle className="animate-spin" stroke="#7e8b53" />
            ) : (
              <span className="load_view_more">View More</span>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ProductsHolder;
