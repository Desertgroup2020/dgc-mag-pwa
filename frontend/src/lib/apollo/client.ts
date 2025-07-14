import { HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { cookies } from "next/headers";

export const { getClient } = registerApolloClient(() => {
  const productionEndPoint = process.env.PRODUCTION_ENDPOINT;
  const cookieStore = cookies();
  const authToken = cookieStore.get("token")?.value;
  console.log("token from server", authToken);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${productionEndPoint}/graphql`,
      fetchOptions: {
        cache: "no-store",
      },
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    }),
  });
});
