import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryAllByAltText, RenderResult, render as RtlRender } from "@testing-library/react";
import { PropsWithChildren, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { generateQueryClient } from "@/react-query/queryClient";
const generateTestQueryClient = () => {
  const client = generateQueryClient();
  client.setDefaultOptions({
    queries: {
      ...client.getDefaultOptions().queries,
      retry: false,
    },
  });
  return client;
}

// ** FOR TESTING CUSTOM HOOKS ** //
// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
// export const createQueryClientWrapper = () => {
//   const queryClient = generateQueryClient();
//   return ({ children }: PropsWithChildren) => (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// };

// reference: https://testing-library.com/docs/react-testing-library/setup#custom-render
export function customRender(ui: ReactElement, client?: QueryClient) {
  const queryClient = client ?? generateTestQueryClient()
  return RtlRender(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// override render method
export { customRender as render };
