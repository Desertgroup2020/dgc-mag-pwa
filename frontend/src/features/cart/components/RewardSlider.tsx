import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useCartMutations from "../hooks/useCartMutations";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Slider } from "@/components/ui/slider";
// import CircularProgress from "@/components/icons/CircularProgress";
import dynamic from "next/dynamic";
import makeClient from "@/lib/apollo/apolloProvider";
import { fetchCart } from "../slice/cart";
import { useRewardContext } from "../hooks/rewardContext";
import { useToast } from "@/components/ui/use-toast";

const CircularProgress = dynamic(
  () => import("@/components/icons/CircularProgress")
);

function RewardSlider() {
  // refs
  const sliderRef = useRef(null);

  // hooks
  const {
    mpRewardPoints: [mpRewardPoints, mpRewardPointsStatus],
  } = useCartMutations();
  const { rangeIsUnderAllowed, config } = useRewardContext();
  const client = makeClient();
  const { toast, dismiss } = useToast();

  const customer = useAppSelector((state) => state.auth.value);
  const cart = useAppSelector((state) => state.cart.data.cart);
  const customerPoint = useMemo(
    () => customer?.mp_reward?.point_balance,
    [customer]
  );
  const dispatch = useAppDispatch();
  const rewardsPoints = useMemo(() => cart?.prices?.mp_reward_segments, [cart]);

  const cartStatus = useAppSelector((state) => state.cart.status);
  const cartLoading = useMemo(
    () => cartStatus === "loading" || mpRewardPointsStatus.loading,
    [cartStatus, mpRewardPointsStatus]
  );

  const minPrice = Number(0);
  const maxPrice = useMemo(() => Number(customerPoint), [customerPoint]);
  const step = useMemo(() => {
    const calculatedStep = Math.round((maxPrice - minPrice) / 100);
    return Math.max(calculatedStep, 1);
  }, [minPrice, maxPrice]);
  const maximum_point_per_order = useMemo(
    () => config.spending?.maximum_point_per_order,
    [config]
  );

  // ===
  const [sliderValue, setSliderValue] = useState(0);

  // features
  const handleSliderChange = useCallback((rangeValue: number[]) => {
    if (!Number.isNaN(rangeValue[0])) {
      setSliderValue(rangeValue?.[0]);
    }
  }, []);
  const handleValueChange = useCallback(
    (rangeValue: number[]) => {
      const newValue = rangeValue?.[0];
      // if (Number.isNaN(newValue)) {
      //   return true;
      // }

      if (!Number.isNaN(newValue)) {
        rangeIsUnderAllowed(newValue).then(({allowed}) => {
          if (allowed) {
            setSliderValue(newValue);
            mpRewardPoints({
              variables: {
                cartId: cart?.id as string,
                points: newValue as any,
                // points: values[1] as any,
                rule_id: "rate",
                address_information: {},
              },
            }).then(({ data }) => {
              if (!!data?.MpRewardSpendingPoint) {
                dispatch(fetchCart({ cartId: cart?.id as string, client }));
              }
            });
          } else {
            // setSliderValue(maximum_point_per_order!);
            toast({
              variant: "warning",
              title: `Maximum Points: ${maximum_point_per_order}`,
              description: `Maximum points per order exceeds!`,
            });
          } 
        });
      }
    },
    [cart?.id, dispatch, mpRewardPoints, config, rangeIsUnderAllowed]
  );
  // effects
  useEffect(() => {
    const rewardAlreadySpend = rewardsPoints?.find(
      (item) => item?.code === "mp_reward_spent"
    );
    if (!!rewardAlreadySpend?.value && rewardAlreadySpend?.value < maxPrice) {
      setSliderValue(rewardAlreadySpend?.value);
    }

    // console.log("reward points", rewardAlreadySpend);
  }, [rewardsPoints]);

  // console.log("rewardsPoints", customer?.mp_reward);

  return (
    <div className="reward_slider">
      <div className="reward_content">
        <span>
          You have{" "}
          <span className="highlight">
            {customer?.mp_reward?.point_balance}
          </span>{" "}
          points. Choose how many points to spend.
        </span>{" "}
        <br />
        <span>
          {customer?.mp_reward?.current_exchange_rates?.spending_rate}
        </span>
      </div>
      <div className="price_slider">
        <div className="info">
          <span className="value">{minPrice}</span>
          <span className="value">{maxPrice}</span>
        </div>
        <Slider
          value={[sliderValue]}
          defaultValue={[sliderValue]}
          minStepsBetweenThumbs={5}
          step={step}
          min={minPrice}
          max={maxPrice}
          onValueChange={handleSliderChange}
          onValueCommit={handleValueChange}
          className="price_slider"
          ref={sliderRef}
        />
      </div>
      <div className="total_point_scetion">
        <span>You will spend :&nbsp;</span>
        <span>
          {!cartLoading ? (
            <span className="total_points">{`${sliderValue} points`}</span>
          ) : (
            <CircularProgress width={20} />
          )}
        </span>
      </div>
    </div>
  );
}

export default RewardSlider;
