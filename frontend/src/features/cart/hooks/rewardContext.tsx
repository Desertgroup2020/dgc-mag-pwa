import { RewardConfig } from "@/generated/types";
import { useQuery } from "@apollo/client";
import { createContext, ReactNode, useContext } from "react";
import GET_REWARD_CONFIG, {
  GetRewardConfigType,
} from "../apollo/queries/rewardConfig";

type RewardContextType = {
  config: RewardConfig;
  loading: boolean;
  rangeIsUnderAllowed: (currentRange: number) => Promise<{ allowed: boolean }>;
} | null;

const rewardContext = createContext<RewardContextType>(null);

type RewardContextProvider = {
  children: ReactNode;
};
const RewardContextProvider = ({ children }: RewardContextProvider) => {
  const { data, loading } = useQuery<GetRewardConfigType["Response"]>(
    GET_REWARD_CONFIG,
    {}
  );

  const rangeIsUnderAllowed = async (currentRange: number) => {
    const maxPoints = data?.MpRewardConfig.spending?.maximum_point_per_order;

    return {
      allowed: maxPoints == null || currentRange <= maxPoints, // Handles both `null` and `undefined`
    };
  };

  return (
    <rewardContext.Provider
      value={{ config: data?.MpRewardConfig, loading, rangeIsUnderAllowed } as RewardContextType}
    >
      {children}
    </rewardContext.Provider>
  );
};

export const useRewardContext = () => {
  const context = useContext(rewardContext);
  if (!context) {
    throw new Error(
      "useRewardContext must be used within a useRewardContextProvider"
    );
  }
  return context;
};

export default RewardContextProvider;
