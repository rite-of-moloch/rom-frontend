import React from "react";

import { Flex, Image as ChakraImage, Text } from "@chakra-ui/react";
import { CountdownTimer } from "./CountdownTimer";

export const RiteStaked = ({ balance, deadline }) => {
  return (
    <Flex
      w="100%"
      direction="column"
      alignItems="center"
      justifyContent="space-between"
      p="15px"
    >
      <ChakraImage
        src="/assets/token_img.jpg"
        w="150px"
        borderRadius="20px"
        mb="2rem"
        alt="Rite Token"
      />

      <Text color="red" fontSize={{ lg: "1.2rem", sm: "1rem" }} mb="5px">
        You own a stake for {Number(balance)} RITE
      </Text>
      <Text color="white" fontFamily="jetbrains" fontSize=".8rem">
        Deadline - {new Date(deadline * 1000).toLocaleString()}
      </Text>
      <CountdownTimer targetDate={new Date(deadline * 1000).getTime()} />
    </Flex>
  );
};
