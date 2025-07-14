import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React from "react";

function useRoute() {
  const router = useRouter();

  const routerPush = (href: string, options?: NavigateOptions) =>
    new Promise(() => {
      router.push(`${href}`, options);
    });
  return {routerPush};
}

export default useRoute;
