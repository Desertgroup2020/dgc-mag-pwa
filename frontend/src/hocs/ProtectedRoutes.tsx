import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ComponentType, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useAppSelector } from "@/redux/hooks";
import { delay } from "@/utils";

type WithAuthProps = any

type WithoutAuthProps  = any;

export const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithAuthProps> => {
  const WithAuth: React.FC<P & WithAuthProps> = (props) => {
    const renderOnceRef = useRef(true);
    const navigate = useRouter();
    const token = useAppSelector((state) => state.auth.token);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const paramsObject = Object.fromEntries(searchParams.entries());
    // delete searchParams. .signin

    console.log("search parms", props.type);

    useEffect(() => {
      if (!token && renderOnceRef.current) {
        navigate.replace(
          `${pathname}?${props.type ? `type=${props.type}&` : ``}${
            props.productId ? `productId=${props.productId}` : ``
          }${!Object.keys(paramsObject).includes("signin") ? '&signin=dgc-login': ''} `
        );

        delay(100);
        renderOnceRef.current = false
      }

      return (()=>{
        renderOnceRef.current = true
      })
    }, [token]);

    return <WrappedComponent {...(props as P)} />;
  };

  return WithAuth;
};

export const withoutAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithoutAuthProps> => {
  const WithoutAuth: React.FC<P & WithoutAuthProps> = (props) => {
    const navigate = useRouter();
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
      if (token) {
        navigate.replace("/");
      }
    }, [navigate, token]);

    if (token) return null;

    return <WrappedComponent {...(props as P)} />;
  };

  return WithoutAuth;
};
