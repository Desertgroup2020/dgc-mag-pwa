"use client";

import React, { useEffect, useState } from "react";
import { DefaultProps } from "../[...slug]/page";
import Image from "next/image";
import Smile from "@/components/icons/Smile";
import Link from "next/link";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { useAppDispatch } from "@/redux/hooks";
import useAuth from "@/features/authentication/hooks/useAuth";
import { updateToken } from "@/features/authentication/slice/auth";
import { withoutAuth } from "@/hocs/ProtectedRoutes";
import { notFound } from "next/navigation";

function AccountConfirmation({ searchParams }: DefaultProps) {
  // hooks
  const {
    accountConfirmation: [accountConfirmation, accountConfirmationStatus],
  } = useAuth();
  const dispatch = useAppDispatch();

  // constatns
  const token = searchParams.token;
  const id = searchParams.id;

  //   states
  const [disableScreen, setDisableScreen] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);
  const [displayMsg, setDisplayMsg] = useState("");

  useEffect(() => {
    if (token && id) {
      accountConfirmation({
        variables: {
          id: id as string,
          token: token as string,
        },
        onCompleted(data, clientOptions) {
          if (
            data.confirmAccount.status &&
            data.confirmAccount.customer?.token
          ) {
            dispatch(updateToken(data.confirmAccount.customer?.token));

            setTimeout(() => {
              setIsSuccess(true);
              setDisplayMsg(
                data.confirmAccount.message || "Welcome to Dubai Garden Centre"
              );
              setDisableScreen(false);
            }, 5000);
          } else {
            setIsSuccess(false);
            setDisplayMsg(
              data.confirmAccount.message || "Something Went Wrong!"
            );
            setDisableScreen(false);
          }
        },
        onError(error, clientOptions) {
          setIsSuccess(false);
          setDisplayMsg("Something Went Wrong!");
          setDisableScreen(false);
        },
      });
    }

    return () => {
      setIsSuccess(false);
      setDisplayMsg("");
      setDisableScreen(true);
    };
  }, [id, token]);

  if (!token || !id) notFound();
  if (disableScreen)
    return (
      <div
        className="loading_stage flex items-center justify-center fixed"
        style={{
          height: "100vh",
          width: "100vw",
          transition: "0.4s ease-in-out",
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      >
        <Image
          src={"/assets/images/Splashscreen.jpg"}
          alt="splash"
          width={1920}
          height={1080}
          className=" h-full w-full object-cover"
        />
      </div>
    );
  return (
    <div className="confirm_account">
      <div className="container">
        <div className="amazone_response">
          <div className="container">
            <h1 className=" text-h1 text-center">
              {isSuccess ? "Welcome!" : "Ooops!"}
            </h1>

            <div className="status_view">
              {isSuccess ? (
                <div className="success">
                  <Smile width={120} />
                  <div className="txt">
                    <p>{displayMsg}</p>
                  </div>
                </div>
              ) : (
                <div className="success">
                  <Ban width={80} height={80} stroke="red" />
                  <div className="txt">
                    <p>{displayMsg}</p>
                  </div>
                </div>
              )}

              <Link href={`/`}>
                <Button
                  variant={"action_green"}
                  className="btn_action_green_rounded"
                >
                  <BtnRightArrow />
                  <span>CONTINUE SHOPPING</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountConfirmation;
