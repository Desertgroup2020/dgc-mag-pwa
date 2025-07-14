import React, { useRef } from "react";
export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Complete"
  | "Canceled"
  | "Closed";
type OrderStatusBlockProps = {
  status: OrderStatus;
};
function OrderStatusBlock({ status }: OrderStatusBlockProps) {
  const barRef = useRef<HTMLDivElement | null>(null);

  if (status === "Canceled") {
    return (
      <div className="status_cancel">
        <p className=" font-600">Your Order Had been Canceled!</p>
      </div>
    );
  }
  if (status === "Closed") {
    return (
      <div className="status_cancel">
        <p className=" font-600">Your Order Had been Closed!</p>
      </div>
    );
  }

  return (
    <div className="status_viewer">
      <div className="status_bar" ref={barRef}>
        <div
          className={`juice ${
            status === "Pending"
              ? "pending_juice"
              : status === "Processing"
              ? "processing_juice"
              : "complete_juice"
          }`}
        ></div>
        <div className="initial">
          <span className={`indicator active`}></span>
        </div>
        <div className="pending">
          <span className="txt">Pending</span>
          <span className={`indicator active`}></span>
        </div>
        <div className="processing">
          <span className="txt">Processing</span>
          <span
            className={`indicator ${status !== "Pending" ? "active" : ""}`}
          ></span>
        </div>
        <div className="complete">
          <span className="txt">Complete</span>
          <span
            className={`indicator ${status === "Complete" ? "active" : ""}`}
          ></span>
        </div>
      </div>
    </div>
  );
}

export default OrderStatusBlock;
