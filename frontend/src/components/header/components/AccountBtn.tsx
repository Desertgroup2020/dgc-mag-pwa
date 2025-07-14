import { Button } from "@/components/ui/button";
import { updateToken } from "@/features/authentication/slice/auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { LoaderCircle, LogIn, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function AccountBtn() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const winWidth = useAppSelector((state)=> state.window.windDim.width);
  const firstLetter = auth.value?.firstname?.substring(-1, 1)

  

  return (
    <div className="account_btn">
      <Button variant={"itself"} onClick={()=>{
        if(auth && auth.status !== "loading"){
          router.push("/my-account/profile");
        }
      }} >
        {auth && auth.status !== "loading" ? (
          winWidth > 1199 ? 
          (<span>Hi {auth.value?.firstname}</span>) : (
            <User width={20} height={20} />
          )          
        ) : (
          <LoaderCircle className="animate-spin" />
        )}
      </Button>
    </div>
  );
}

export default AccountBtn;
