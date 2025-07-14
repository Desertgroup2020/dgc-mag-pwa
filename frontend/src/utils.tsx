import { ApolloError } from "@apollo/client";
import { useToast } from "./components/ui/use-toast";
import { useAppDispatch } from "./redux/hooks";
import { logout } from "./features/authentication/slice/auth";
import useCart from "./features/cart/hooks/useCart";
import { updateCart } from "./features/cart/slice/cart";

export function usePrice() {
  const renderPrice = (price: number = 0) => {
    return <>AED {price.toFixed(2)}</>;
  };

  return {
    renderPrice,
  };
}

export const useErrorHandler = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();  

  const errorHandler = (error: ApolloError) => {
    // Default error message
    const defaultMessage = "An unexpected error occurred";

    // Check for GraphQL errors
    if (error?.graphQLErrors?.length) {
      // Iterate over the GraphQL errors
      // console.log("error", error.graphQLErrors);

      error.graphQLErrors.forEach(({ message, extensions }) => {
        // Handle specific authorization error
        if (extensions?.category === "graphql-authorization") {
          dispatch(logout());
        } else if(message !== "The cart isn't active.") {
          toast({
            title: "Ooops!!",
            description: message || defaultMessage,
            variant: "error",
          });
        }

        if(message === "The cart isn't active."){
          dispatch(updateCart(null));
        }
      });
    } else {
      // Fallback for other Apollo errors
      toast({
        title: "Ooops!!",
        description: error?.message || defaultMessage,
        variant: "error",
      });
    }
  };

  return errorHandler;
};

export const formatTime = (seconds: number) => {
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
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
