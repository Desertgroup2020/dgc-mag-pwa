"use client";

import { useAppSelector } from "@/redux/hooks";
import styles from "../styles/account.module.scss";
import moment from "moment";
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function RewardPoints() {
  // hooks
  const rewards = useAppSelector((state) => state.auth.value?.mp_reward);

  const transactions = useMemo(() => {
    return rewards?.transactions?.items;
  }, [rewards?.transactions?.items]);
  const sortedTransactions = useMemo(() => {
    return transactions
      ?.slice()
      .sort((a, b) => moment(b?.created_at).diff(moment(a?.created_at)));
  }, [rewards?.transactions?.items]);

  if (!rewards || (rewards.point_balance === 0 && rewards.point_spent === 0)) {
    return (
      <div className={`no_reward_exist`}>
        <div className="noitemsParent">
          <p className="no-transaction">You don&rsquo;t have any rewards</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`reward_points ${styles.reward_points}`}>
      <h1>Points and Rewards</h1>
      <div className="rewards">
        <div className="reward-point">
          <div className="reward-balance-div">
            <p className="text">Available Balance</p>
            <p className="points">{rewards?.point_balance}</p>
          </div>
        </div>
        <div className="spent-point">
          <div className="spent-point-div">
            <p className="text">Spent Points</p>
            <p className="points">{rewards?.point_spent}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="transaction">Reward Transactions</h2>
        {!rewards?.transactions?.items ||
          (rewards.transactions.items.length === 0 && (
            <div className="no-transaction">
              <p>No transactions found</p>
            </div>
          ))}
        {rewards?.transactions?.items &&
          rewards.transactions.items.length > 0 && (
            <div className="rewards-transaction">              
              <Table className="reward_table">
                <TableHeader className="table_head">
                  <TableRow>
                    <TableHead className="table_head_item">Transaction</TableHead>
                    <TableHead className="table_head_item" >Date</TableHead>
                    <TableHead className="table_head_item" >Title</TableHead>
                    <TableHead className="table_head_item" >Points</TableHead>
                    <TableHead className="table_head_item" >Status</TableHead>
                    <TableHead className="table_head_item" >Expire</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions?.map((i) => (
                    <TableRow key={i?.order_id}>
                      <TableCell className="table_cell">{i?.transaction_id}</TableCell>
                      <TableCell className="table_cell">
                        {i?.created_at &&
                          moment(i?.created_at).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className="table_cell w-[300px]">{i?.comment}</TableCell>
                      <TableCell className="table_cell">{i?.point_amount}</TableCell>
                      <TableCell className="table_cell">
                        {i?.status === 2 && "Completed"}
                        {i?.status === 1 && "Pending"}
                        {i?.status === 3 && "Canceled"}
                        {i?.status === 4 && "Expired"}
                      </TableCell>
                      <TableCell className="table_cell">{i?.expiration_date || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
      </div>
    </div>
  );
}

export default RewardPoints;
