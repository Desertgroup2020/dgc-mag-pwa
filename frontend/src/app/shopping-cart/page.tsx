// import CartClient from "@/features/cart/screens/CartClient";
// export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";
import styles from "../../features/cart/styles/cartStyles.module.scss";

const CartClient = dynamicImport(() => import("@/features/cart/screens/CartClient"), {
  ssr: false,
});

export default function ShoppingCart() {
  return (
    <section className={`shopping_cart ${styles.shopping_cart}`}>
        <CartClient />
    </section>
  );
}
