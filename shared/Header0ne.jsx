import { useContext } from "react";
import { VStack, Heading, Image } from "@chakra-ui/react";
import { AppContext } from "../context/AppContext";
import { useRouter } from "next/router";

export const HeaderOne = () => {
  const context = useContext(AppContext);
  const router = useRouter();

  return (
    <VStack justifyContent="center" m="auto">
      <Heading
        as="h1"
        fontFamily="uncial"
        color="red"
        textAlign="center"
        mb={4}
      >
        {router.pathname === "/deploy-cohort"
          ? "MOLOCH COHORT DEPLOYER"
          : "SLAY OR BE SLAIN..."}
      </Heading>

      {!context.signerAddress && (
        <Image
          src="assets/season-v-token.svg"
          alt="SLAY OR BE SLAIN..."
          boxSize="50%"
        />
      )}
    </VStack>
  );
};
