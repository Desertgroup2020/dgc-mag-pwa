"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type BlockingProps = {
  isBlocked: boolean;
  setIsBlocked: Dispatch<SetStateAction<boolean>>;
  storeToLocalStorage: () => Promise<number>;
  formatTime: (s: number) => string;
  isBlockExpired: () => boolean;
  blockedTime: number;
  blockUserTiming: number | null;
  setBlockUserTiming: Dispatch<SetStateAction<number | null>>;
  clearBlocking: () => void;
} | null;

const BlockingContext = createContext<BlockingProps>(null);

const BlockingContextProvider = ({ children }: { children: ReactNode }) => {
  const [blockUser, setBlockUser] = useState(false);
  const [blockUserTiming, setBlockUserTiming] = useState<null | number>(null);
  const [blockedTime, setBlockedTime] = useState(0);
  !!localStorage.getItem("blockedTime")
    ? parseInt(localStorage.getItem("blockedTime") as string)
    : Date.now() / 1000;

  const clearBlocking = useCallback(() => {
    clearLocalStorage().then(() => {
      setBlockUser(false);
      setBlockUserTiming(null);
    });
  }, []);

  const formatTime = useCallback((seconds: number) => {
    // Convert milliseconds to seconds

    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    // Format the time
    // console.log("formated time", hours, minutes, seconds);
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  }, []);

  const isBlockExpired = useCallback(() => {
    const currentTimeInSec = Date.now() / 1000;

    // console.log("time difference", Math.floor(currentTimeInSec - blockedTime));

    if (Math.floor(currentTimeInSec - blockedTime) > 60 * 5) {
      console.log("block expired..");
      clearLocalStorage().then(() => {
        setBlockUser(false);
      });
      // setOpen(false);
      return true;
    }
    return false;
  }, [blockedTime, setBlockUser]);

  const storeToLocalStorage: () => Promise<number> = useCallback(() => {
    return new Promise((resolve, reject) => {
      try {
        const numberOfOtpItems = localStorage.getItem("num_of_otp_try");
        const otpCount = numberOfOtpItems ? parseInt(numberOfOtpItems) : 0;

        if (otpCount > 3) {
          if (!localStorage.getItem("blockedTime")) {
            localStorage.setItem("blockedTime", (Date.now() / 1000).toString());
          }
          setBlockUser(true);
        } else {
          localStorage.setItem("num_of_otp_try", (otpCount + 1).toString());
        }

        resolve(otpCount); // Resolve the promise if everything runs successfully
      } catch (error) {
        reject(error); // Reject the promise if an error occurs
      }
    });
  }, [blockUser, setBlockUser]);

  useEffect(() => {
    const blockedTime = !!localStorage.getItem("blockedTime")
      ? parseInt(localStorage.getItem("blockedTime") as string)
      : Date.now() / 1000;

    setBlockedTime(blockedTime);
  }, [blockUser]);

  //user block functinality
  useEffect(() => {
    if (blockUserTiming !== null && blockUserTiming > 0 && blockUser) {
      // Start the timer if remaining time exists and is greater than 0
      const timerInterval = setInterval(() => {
        setBlockUserTiming((prevTime) => {
          if (prevTime) {
            const newTime = prevTime - 1;
            localStorage.setItem("blockUserTiming", newTime.toString()); // Store updated time in localStorage
            if (newTime <= 0 || isBlockExpired()) {
              clearInterval(timerInterval);
              console.log("block expired..");
              clearLocalStorage().then(() => {
                setBlockUser(false);
              });
              return 0;
            }
            return Math.floor(newTime);
          } else {
            return null;
          }
        });
      }, 1000);

      return () => clearInterval(timerInterval); // Clean up the interval on component unmount
    }
  }, [blockUserTiming, blockUser, isBlockExpired]);
  // ===
  // console.log("block user from modal", isBlocked);
  useEffect(() => {
    if (blockUser) {
      const localtime = localStorage.getItem("blockUserTiming");

      if (isBlockExpired()) {
        // console.log("blocking expired..");
      } else {
        if (localtime) {
          setBlockUserTiming(parseInt(localtime));
        } else {
          setBlockUserTiming(60 * 5);
        }
      }
    }
  }, [blockUser]);

  const contextObj: BlockingProps = {
    isBlocked: blockUser,
    setIsBlocked: setBlockUser,
    storeToLocalStorage: storeToLocalStorage,
    formatTime,
    isBlockExpired,
    blockedTime,
    blockUserTiming,
    setBlockUserTiming,
    clearBlocking,
  };

  return (
    <BlockingContext.Provider value={contextObj}>
      {children}
    </BlockingContext.Provider>
  );
};

// Hook to use the BlockingContext
export const useBlocking = () => {
  const context = useContext(BlockingContext);
  if (!context) {
    throw new Error(
      "useBlocking must be used within a BlockingContextProvider"
    );
  }
  return context;
};

export function clearLocalStorage(): Promise<void> {
  return new Promise((resolve) => {
    localStorage.removeItem("num_of_otp_try");
    localStorage.removeItem("blockedTime");
    localStorage.removeItem("blockUserTiming");
    resolve(); // Resolve the promise once all operations are complete
  });
}

export default BlockingContextProvider;
