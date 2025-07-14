import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { Button } from "@/components/ui/button";
import useCustomer from "@/features/authentication/hooks/useCustomer";
import React from "react";

function LogOutConfirmation() {
    const {handleLogOut} = useCustomer();
  return (
    <div className="logout_confirmation">
      <h2 className=" text-h2 mb-4">Are you sure want to Log Out ?</h2>

      <Button
        variant={"action_green"}
        type="button"
        onClick={handleLogOut}
        className="btn_action_green_rounded"
      >
        <BtnRightArrow />
        <span>Log Out</span>
      </Button>
    </div>
  );
}

export default LogOutConfirmation;
