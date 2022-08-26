import { Flex, Box } from "@chakra-ui/react";

import { Meta } from "./Meta";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = ({ children }) => {
  return (
    <Box
      background="radial-gradient(97.27% 170.54% at 98.7% 2.73%, #24003A 0%, rgba(0, 0, 0, 0) 100%),
    radial-gradient(100% 350.19% at 100% 100%, #170011 0%, rgba(23, 0, 17, 0) 100%),
    radial-gradient(50% 175.1% at 0% 100%, #130000 0%, rgba(31, 0, 0, 0) 100%),
    radial-gradient(50% 175.1% at 0% 0%, #330F00 0%, rgba(51, 15, 0, 0) 100%),
    linear-gradient(0deg, #000000, #000000)"
    >
      <Meta />
      <Flex
        direction="column"
        minH="100vh"
        maxW="80rem"
        alignItems="center"
        justifyContent="space-between"
        mx="auto"
      >
        <Box
          bgImage="/assets/ai_2.png"
          position="fixed"
          height="-webkit-fill-available"
          left="0"
          width="100%"
          opacity="0.09"
          bgPos="top"
          bgSize="cover"
          zIndex={1}
          pointerEvents="none"
        />
        <Header />
        {children}
        <Footer />
      </Flex>
    </Box>
  );
};
