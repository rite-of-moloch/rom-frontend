import { React } from "react";
import { Flex, VStack, Image, Text, Checkbox, Button } from "@chakra-ui/react";
import { CountdownTimer } from "./CountdownTimer";
import { StakingFlow } from "./StakingFlow";
import styled from "@emotion/styled";

const StyledButton = styled(Button)`
  height: 50px;
  width: auto;
  border-radius: "2px";
  padding-left: "24px";
  padding-right: "24px";
`;

export const RiteStaked = ({
  displaySponsorCohort,
  setDisplaySponsorCohort,
  balance,
  deadline,
  minimumStake,
  context,
  raidBalance,
  allowance,
  isChecked,
  handleIsChecked,
  cohortAddress,
  handleCohortAddress,
  isApproveTxPending,
  makeAnAllowance,
  canStake,
  canNotStakeTooltipLabel,
  isStakeTxPending,
  depositStake,
  claim,
  guildMember,
}) => {
  const handleSponsorCohort = () => {
    setDisplaySponsorCohort(!displaySponsorCohort);
  };

  return (
    <Flex
      w="100%"
      direction="column"
      alignItems="center"
      justifyContent="space-between"
      p="15px"
      mb="4em"
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
      {guildMember ? (
        <VStack>
          <Text mb="2em" textAlign="center" color="white">
            You're an official Raid Guild member! <br />
            Claim your cohort stake back, soldier...
          </Text>
          <StyledButton
            bg="transparent"
            border="2px solid"
            borderColor="red"
            color="red"
            onClick={claim}
            _hover={{
              opacity: 0.8,
            }}
          >
            Claim Stake
          </StyledButton>
        </VStack>
      ) : null}
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        mt="2em"
      >
        <Checkbox onChange={handleSponsorCohort} />
        <Text color="red" fontFamily="jetbrains" fontSize=".8rem" ml="1em">
          Sponsor an Initiate
        </Text>
      </Flex>
      {displaySponsorCohort ? (
        <StakingFlow
          minimumStake={minimumStake}
          context={context}
          raidBalance={raidBalance}
          allowance={allowance}
          isChecked={isChecked}
          displaySponsorCohort={displaySponsorCohort}
          checkboxDisplay={displaySponsorCohort ? "none" : null}
          sponsorCohortTextDisplay={displaySponsorCohort ? "none" : null}
          handleIsChecked={handleIsChecked}
          cohortAddress={cohortAddress}
          handleCohortAddress={handleCohortAddress}
          isApproveTxPending={isApproveTxPending}
          makeAnAllowance={makeAnAllowance}
          canStake={canStake}
          canNotStakeTooltipLabel={canNotStakeTooltipLabel}
          isStakeTxPending={isStakeTxPending}
          depositStake={depositStake}
        />
      ) : null}
    </Flex>
  );
};
