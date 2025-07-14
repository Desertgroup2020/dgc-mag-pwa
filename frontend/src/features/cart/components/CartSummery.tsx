import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import { usePrice } from "@/utils";
import styles from "../styles/cartStyles.module.scss";
import React, { useMemo } from "react";
import useCartMutations from "../hooks/useCartMutations";
import RewardPoints from "./RewardPoints";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import RewardContextProvider from "../hooks/rewardContext";

function CartSummery() {
  // hooks
  const { renderPrice } = usePrice();
  const { mpRewardPoints } = useCartMutations();
  const router = useRouter();

  // states
  const cart = useAppSelector((state) => state.cart.data.cart);

  const subTotal = useMemo(
    () => cart?.prices?.subtotal_including_tax?.value,
    [cart]
  );
  const discounts = useMemo(() => cart?.prices?.discounts, [cart]);
  const grandTotal = useMemo(() => cart?.prices?.grand_total?.value, [cart]);
  const mpReward = useMemo(
    () =>
      cart?.prices?.mp_reward_segments?.find(
        (segment) => segment?.code === "mp_reward_discount"
      ),
    [cart]
  );
  const totalDiscount = useMemo(() => {
    let totalPrice = 0;
    if (cart?.prices?.discounts?.length) {
      totalPrice = cart?.prices?.discounts?.reduce(
        (acc, item) => acc + (item?.amount?.value || 0),
        0
      );
    }

    return totalPrice;
  }, [cart?.prices?.discounts, mpReward?.value]);
  const youWillEarnSegment = useMemo(
    () =>
      cart?.prices?.mp_reward_segments?.find(
        (mpSeg) => mpSeg?.code === "mp_reward_earn"
      ),
    [cart]
  );
  return (
    <>
      <div className={`cart_summery ${styles.cart_summery}`}>
        <h2>CART TOTALS</h2>
        <div className="details">
          {youWillEarnSegment ? (
            <div className="sub_total">
              <span className="label">{youWillEarnSegment.title} &nbsp;</span>
              <span className="value">{youWillEarnSegment.value} points</span>
            </div>
          ) : null}
          <div className="sub_total">
            <span className="label">Subtotal</span>
            <span className="value">{renderPrice(subTotal || 0)}</span>
          </div>
          {discounts?.length ? (
            <div className="discounts">
              <Accordion
                type="single"
                collapsible
                className="discount_accordian"
              >
                <AccordionItem value="discount" className="acc_item">
                  <AccordionTrigger className="heading">
                    <ChevronDown stroke="#000" className="icon" />
                    <h4>
                      <span className="label">Discounts </span>
                      <span className="total_dis">
                        {renderPrice(totalDiscount || 0)}
                      </span>
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent className="acc_content">
                    <ul>
                      {discounts.map((discount, i) => (
                        <li key={i}>
                          <span className="label">{discount?.label}</span>
                          <span className="reduced_price">
                            {renderPrice(discount?.amount.value || 0)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : null}
          {mpReward ? (
            <div className="sub_total">
              <span className="label">{mpReward.title} &nbsp;</span>
              <span className="value">
                {renderPrice(mpReward.value ? mpReward.value * -1 : 0)}
              </span>
            </div>
          ) : null}
          <div className="grand_total">
            <span className="label">Total</span>
            <span className="value">{renderPrice(grandTotal || 0)}</span>
          </div>
        </div>
        <div className="continue_btn">
          <Button
            className="normal_btn"
            onClick={() => router.push("/checkout")}
          >
            <span>PROCEED TO CHECKOUT</span>
          </Button>
        </div>
      </div>
      <RewardContextProvider>
        <RewardPoints />
      </RewardContextProvider>
    </>
  );
}

export default CartSummery;
