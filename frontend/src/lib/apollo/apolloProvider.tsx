// "use client";

// import { ApolloLink, HttpLink } from "@apollo/client";
// import {
//   NextSSRApolloClient,
//   ApolloNextAppProvider,
//   NextSSRInMemoryCache,
//   SSRMultipartLink,
// } from "@apollo/experimental-nextjs-app-support/ssr";
// import Cookies from "js-cookie";

// function makeClient() {
//   const isDevelopment = process.env.NODE_ENV !== "production";
//   const token = Cookies.get("token");
//   const baseUrl = isDevelopment
//     ? "http://localhost:3007"
//     : "https://dubaigardencentre.cmxdev.com";
//   const httpLink = new HttpLink({
//     uri: `${baseUrl}/api/graphql`,
//   });

//   return new NextSSRApolloClient({
//     cache: new NextSSRInMemoryCache(),
//     link:
//       typeof window === "undefined"
//         ? ApolloLink.from([
//             new SSRMultipartLink({
//               stripDefer: true,
//             }),
//             httpLink,
//           ])
//         : httpLink,

//   });
// }

// export function ApolloWrapper({ children }: React.PropsWithChildren) {
//   return (
//     <ApolloNextAppProvider makeClient={makeClient}>
//       {children}
//     </ApolloNextAppProvider>
//   );
// }

"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

function makeClient() {
  const isDevelopment = process.env.NODE_ENV !== "production";
  // const basePath = process.env.BASE_PATH;

  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

  // Create an http link:
  const httpLink = new HttpLink({
    uri: `${baseUrl}/api/graphql`,
  });

  // Middleware to set headers
  const authLink = setContext((_, { headers }) => {
    const token = Cookies.get("token"); // Replace 'token' with your actual cookie name
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  // Combine the auth link and http link
  const link = ApolloLink.from([
    ...(typeof window === "undefined"
      ? [
          new SSRMultipartLink({
            stripDefer: true,
          }),
        ]
      : []),
    authLink,
    httpLink,
  ]);

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: link,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}

export default makeClient
