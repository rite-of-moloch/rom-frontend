import { React, useContext } from "react";
import { Flex, Image, Text, Checkbox } from "@chakra-ui/react";
import { CountdownTimer } from "./CountdownTimer";
import { StakingFlow } from "./StakingFlow";
// import { AppContext } from "../context/AppContext";
import { StakingContext } from "../context/StakingContext";

export const RiteStaked = ({
  balance,
  deadline,
  makeAnAllowance,
  canStake,
  canNotStakeTooltipLabel,
  depositStake,
}) => {
  // const appContext = useContext(AppContext);
  const stakingContext = useContext(StakingContext);

  return (
    <Flex
      w="100%"
      direction="column"
      alignItems="center"
      justifyContent="space-between"
      p="15px"
    >
      <Image
        src="/assets/season-v-token.svg"
        w="250px"
        borderRadius="20px"
        mt="-3rem"
        alt="Rite Token"
      />

      <Text color="red" fontSize={{ lg: "1.2rem", sm: "1rem" }} mb="5px">
        You own a stake for {Number(balance)} RITE
      </Text>
      <Text color="white" fontFamily="jetbrains" fontSize=".8rem">
        Deadline - {new Date(deadline * 1000).toLocaleString()}
      </Text>
      <CountdownTimer targetDate={new Date(deadline * 1000).getTime()} />

      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        mt="2em"
      >
        <Checkbox onChange={stakingContext.handleSponsorCohort} />
        <Text color="red" fontFamily="jetbrains" fontSize=".8rem" ml="1em">
          Sponsor an Initiate
        </Text>
      </Flex>
      {displaySponsorCohort ? (
        <StakingFlow
          makeAnAllowance={makeAnAllowance}
          canStake={canStake}
          canNotStakeTooltipLabel={canNotStakeTooltipLabel}
          depositStake={depositStake}
        />
      ) : null}
    </Flex>
  );
};
