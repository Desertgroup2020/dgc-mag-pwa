import React, { useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { ChevronDown } from "lucide-react";
import styles from "../styles/cartStyles.module.scss";
import dynamic from "next/dynamic";
import { useRewardContext } from "../hooks/rewardContext";

const RewardSlider = dynamic(() => import("./RewardSlider"), {
  loading: () => <span>loading...</span>,
});

const RewardPoints = () => {
  const { config, loading } = useRewardContext();
  const customer = useAppSelector((state) => state.auth.value);
  const cart = useAppSelector((state) => state.cart.data.cart);
  const customerPoint = useMemo(
    () => customer?.mp_reward?.point_balance,
    [customer]
  );
  const rewardsPoints = useMemo(() => cart?.prices?.mp_reward_segments, [cart]);

  const [openReward, setOpenReward] = useState(true);

  const maxPrice = useMemo(() => Number(customerPoint), [customerPoint]);
  const isPassedMinPointsRequired = useMemo(() => {
    if (
      config?.spending?.minimum_balance &&
      config?.spending?.minimum_balance <= maxPrice
    ) {
      return true;
    } else if (!!!config?.spending?.minimum_balance) {
      return true;
    }

    return false;
  }, [config, maxPrice]);

  // console.log("config", config);
  // console.log("maxprice", maxPrice);
  // console.log("isPassedMinPointsRequired", isPassedMinPointsRequired);

  if (
    !rewardsPoints?.length ||
    !maxPrice ||
    loading ||
    !isPassedMinPointsRequired
  )
    return null;
  return (
    <div className={`reward_points ${styles.reward_points}`}>
      <div className={`reward_dropdown ${openReward ? "open" : ""}`}>
        <span>
          Spent Your Points: <span>{customer?.mp_reward?.point_balance}</span>
        </span>
        {/* <button
          onClick={() => setOpenReward((prev) => !prev)}
          aria-label="reward_dropdown"
        >
          <ChevronDown stroke="#fff" className={`${openReward ? 'rotate-180' : ''}`} />
        </button> */}
      </div>
      {openReward ? (
        <div className={`reward_content_parent`}>
          <RewardSlider />
        </div>
      ) : null}
    </div>
  );
};

export default RewardPoints;
