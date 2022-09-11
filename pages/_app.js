import { ChakraProvider } from "@chakra-ui/react";
import { AppContextProvider } from "../context/AppContext";
import { StakingContextProvider } from "../context/StakingContext";
import { theme } from "../styles/theme";
import { Layout } from "../shared/Layout";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <StakingContextProvider>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </StakingContextProvider>
    </AppContextProvider>
  );
}

export default MyApp;
