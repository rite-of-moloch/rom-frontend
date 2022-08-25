import React from "react";
import { useCountdown } from "../hooks/useCountdown";
import { Box, Flex, Text, Image, Heading } from "@chakra-ui/react";
import { sixMonthsInSeconds } from "../utils/constants";

export const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds, secondsLeft] = useCountdown(targetDate);

  const color = `hsl(347, ${Math.floor(
    100 - (secondsLeft / sixMonthsInSeconds) * 100
  )}%, 50%)`;

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

const ExpiredNotice = () => {
  return (
    <Flex my={6}>
      <Heading color="red.500" fontFamily={"rubik"}>
        You have been sacrificed to the great Moloch.
      </Heading>
    </Flex>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <Flex
      fontSize="medium"
      alignItems="center"
      justifyContent="space-between"
      gap={3}
      fontFamily={"spaceMono"}
      color={"red"}
      py={3}
      bgColor="black"
      w="small"
      padding={"0.75rem"}
      borderRadius={"5px"}
      mt={6}
    >
      {/* <Image src='/assets/citipati.png' alt='citipati' w={16} opacity={0.13} /> */}
      <Image src="/assets/hourglass.png" alt="citipati" w={5} />
      <Flex gap={6}>
        <DateTimeDisplay value={days} type="D" isDanger={days <= 3} />
        <DateTimeDisplay value={hours} type="H" isDanger={false} />
        <DateTimeDisplay value={minutes} type="M" isDanger={false} />
        <DateTimeDisplay value={seconds} type="S" isDanger={false} />
      </Flex>
      <Image src="/assets/hourglass.png" alt="citipati" w={5} />
      {/* <Image src='/assets/triskele.png' alt='citipati' w={16} opacity={0.13} /> */}
    </Flex>
  );
};

const DateTimeDisplay = ({ value, type }) => {
  return (
    <Box textAlign="center" display={"flex"} gap={2}>
      <Text fontWeight={"bold"}>{value}</Text>
      <Text>{type}</Text>
    </Box>
  );
};
