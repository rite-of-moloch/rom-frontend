import { ChakraProvider } from "@chakra-ui/react";

import AppContextProvider from "../context/AppContext";
import StakingFlowContextProvider from "../context/StakingContext";
import { theme } from "../styles/theme";
import { Layout } from "../shared/Layout";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <StakingFlowContextProvider>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </StakingFlowContextProvider>
    </AppContextProvider>
  );
}

export default MyApp;
