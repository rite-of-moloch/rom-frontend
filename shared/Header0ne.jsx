import { Flex, VStack, HStack, Heading, Image } from "@chakra-ui/react";

export const HeaderOne = () => {
  return (
    <>
      <VStack justifyContent="center" m="auto" mb="rem">
        <Heading
          as="h1"
          fontFamily="uncial"
          color="red"
          textAlign="center"
          mb="-2rem"
        >
          SLAY OR BE SLAIN...
        </Heading>
        <Image
          src="assets/season-v-token.svg"
          alt="SLAY OR BE SLAIN..."
          boxSize="50%"
        />
      </VStack>
    </>
  );
};
