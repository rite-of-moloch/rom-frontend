/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import React from "react";
import {
  Flex,
  Box,
  Spinner,
  Image,
  Link as ChakraLink,
  HStack,
  useToast,
  Checkbox,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { ethers, utils } from "ethers";
import styled from "@emotion/styled";

import {
  getMinimumStake,
  getTokenBalance,
  getStakeDeadline,
  getAllowance,
  approveRaid,
  joinInitiation
} from "../utils/web3";

import { AppContext } from "../context/AppContext";
import { CONTRACT_ADDRESSES, EXPLORER_URLS } from "../utils/constants";
import { SUPPORTED_NETWORK_IDS } from "../config";
import { NetworkError } from "../shared/NetworkError";
import { RiteStaked } from "../shared/RiteStaked";
import { StakingFlow } from "../shared/StakingFlow";
import { CohortHeader } from "../shared/CohortHeader";
import { PreStake } from "../shared/PreStake";

const StyledButton = styled(Button)`
  height: 50px;
  width: 100%;
  border-radius: "2px";
  padding-left: "24px";
  padding-right: "24px";
`;

const StyledHStack = styled(HStack)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export default function Home() {
  const context = useContext(AppContext);
  const toast = useToast();

  const [minimumStake, setMinimumStake] = useState(0);
  const [riteBalance, setRiteBalance] = useState(0);
  const [raidBalance, setRaidBalance] = useState(0);
  const [stakeDeadline, setStakeDeadline] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isApproveTxPending, setIsApproveTxPending] = useState(false);
  const [isStakeTxPending, setIsStakeTxPending] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [cohortAddress, setCohortAddress] = useState("");

  const initialFetch = async () => {
    setIsLoading(true);
    await fetchRiteBalance();
    setIsLoading(false);
  };

  const fetchRiteBalance = async () => {
    const _riteBalance = await getTokenBalance(
      context.ethersProvider,
      context.signerAddress,
      CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress
    );

    if (_riteBalance > 0) {
      setRiteBalance(_riteBalance);
      await fetchStakeDeadline();
    } else {
      await fetchMinimumStake();
      await fetchAllowance();
      await fetchRaidBalance();
    }
  };

  const fetchStakeDeadline = async () => {
    const _stakeDeadline = await getStakeDeadline(
      context.ethersProvider,
      CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress,
      context.signerAddress
    );
    // setStakeDeadline(Number(_stakeDeadline) + 60 * 60 * 24 * 30 * 6); // for rinkeby testing
    setStakeDeadline(Number(_stakeDeadline));
  };

  const fetchMinimumStake = async () => {
    const _stake = await getMinimumStake(
      context.ethersProvider,
      CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress
    );
    setMinimumStake(_stake);
  };

  const fetchAllowance = async () => {
    const _allowance = await getAllowance(
      context.ethersProvider,
      CONTRACT_ADDRESSES[context.chainId].erc20TokenAddress,
      context.signerAddress,
      CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress
    );
    setAllowance(_allowance);
  };

  const fetchRaidBalance = async () => {
    const _raidBalance = await getTokenBalance(
      context.ethersProvider,
      context.signerAddress,
      CONTRACT_ADDRESSES[context.chainId].erc20TokenAddress
    );
    setRaidBalance(_raidBalance);
  };

  const triggerToast = (txHash) => {
    toast({
      position: "bottom-left",
      duration: 9000,
      render: () => (
        <Box
          color="white"
          fontFamily="spaceMono"
          fontSize=".8rem"
          bg="blackLight"
          p="15px"
          borderRadius="10px"
          width="auto"
        >
          <i className="fa-solid fa-circle-info"></i> View your{" "}
          <ChakraLink
            href={`${EXPLORER_URLS[context.chainId]}/tx/${txHash}`}
            isExternal
            textDecoration="underline"
            cursor="pointer"
          >
            transaction
          </ChakraLink>
        </Box>
      ),
    });
  };

  const handleIsChecked = () => {
    setIsChecked(!isChecked);
  };

  const handleCohortAddress = (e) => {
    setCohortAddress(e.target.value);
  };

  const makeAnAllowance = async () => {
    setIsApproveTxPending(true);
    try {
      const tx = await approveRaid(
        context.ethersProvider,
        CONTRACT_ADDRESSES[context.chainId].erc20TokenAddress,
        CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress,
        minimumStake
      );
      if (tx) {
        triggerToast(tx.hash);
        const { status } = await tx.wait();
        if (status === 1) {
          await fetchAllowance();
        } else {
          toast({
            position: "bottom-left",
            render: () => (
              <Box color="white" p={3} bg="red.500">
                Transaction failed.
              </Box>
            ),
          });
        }
      }
    } catch (err) {
      toast({
        position: "bottom-left",
        render: () => (
          <Box color="white" p={3} bg="red.500">
            {err.message}
          </Box>
        ),
      });
    }
    setIsApproveTxPending(false);
  };

  const depositStake = async () => {
    //Check if cohortAddress is an actual address
    if (cohortAddress != "" && isChecked) {
      if (!utils.isAddress(cohortAddress)) {
        toast({
          position: "bottom-left",
          duration: 5000,
          render: () => (
            <Box color="white" p={3} bg="red.500">
              Wrong sponsor's address
            </Box>
          )
        });
        return;
      }
    }

    //Start stake process
    setIsStakeTxPending(true);
    try {
      const tx = await joinInitiation(
        context.ethersProvider,
        CONTRACT_ADDRESSES[context.chainId].riteOfMolochAddress,
        cohortAddress != "" && isChecked ? cohortAddress : context.signerAddress
      );
      if (tx) {
        triggerToast(tx.hash);
        const { status } = await tx.wait();
        if (status === 1) {
          await fetchRiteBalance();
        } else {
          toast({
            position: "bottom-left",
            render: () => (
              <Box color="white" p={3} bg="red.500">
                Transaction failed.
              </Box>
            ),
          });
        }
      }
    } catch (err) {
      toast({
        position: "bottom-left",
        render: () => (
          <Box color="white" p={3} bg="red.500">
            {err.message}
          </Box>
        ),
      });
    }
    setIsStakeTxPending(false);
  };

  useEffect(() => {
    if (context.chainId in SUPPORTED_NETWORK_IDS) {
      initialFetch();
    }
  }, [context.chainId]);

  const canStake =
    utils.formatUnits(allowance, "ether") >=
      utils.formatUnits(minimumStake, "ether") &&
    utils.formatUnits(raidBalance, "ether") >=
      utils.formatUnits(minimumStake, "ether") &&
    !ethers.utils.isAddress(cohortAddress);

  const canNotStakeTooltipLabel = !ethers.utils.isAddress(cohortAddress)
    ? "Please input a valid wallet address"
    : utils.formatUnits(allowance, "ether") <
      utils.formatUnits(minimumStake, "ether")
    ? "Allowance is smaller than the minimum stake amount."
    : "Your RAID balance is too low";

  const show =
    context.signerAddress && context.chainId in SUPPORTED_NETWORK_IDS;

  return (
    <Flex
      minH="350px"
      minW="80%"
      direction="column"
      alignItems="center"
      fontFamily="spaceMono"
      px="2rem"
    >
          <CohortHeader />
      {!context.signerAddress && <PreStake />}

      {isLoading && <Spinner color="red" size="xl" />}

      <Flex opacity={!show || isLoading ? 0 : 1} transition="opacity 0.25s" w="100%">
        {!isLoading &&
          (riteBalance > 0 ? (
            <RiteStaked balance={riteBalance} deadline={stakeDeadline} />
          ) : (
            <StakingFlow
              minimumStake={minimumStake}
              context={context}
              raidBalance={raidBalance}
              allowance={allowance}
              isChecked={isChecked}
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
          ))}
      </Flex>

      {context.signerAddress && !(context.chainId in SUPPORTED_NETWORK_IDS) && (
        <NetworkError />
      <Image
        src="assets/full-h1-graphic.svg"
        alt="SLAY OR BE SLAIN..."
        boxSize="40%"
        opacity="0.6"
      />

      <Text
        w="100%"
        bg="purple"
        p="15px"
        fontFamily="rubik"
        fontSize={{ lg: "1.2rem", sm: "1rem" }}
        my="2rem"
        textAlign="center"
      >
        Cohort - Season 5
      </Text>
      {!context.signerAddress && (
        <Text color="white" textAlign="center">
          Connect your wallet to stake & commit to our cohort!
        </Text>
      )}

      {!context.signerAddress && (
        <Link href="/deploy-cohort">
          <Text
            w="50%"
            bg="red"
            p="15px"
            fontFamily="rubik"
            fontSize={{ lg: "1.2rem", sm: "1rem" }}
            mt="6rem"
            mb="2rem"
            textAlign="center"
            rounded="md"
            _hover={{
              cursor: "pointer",
            }}
          >
            Deploy Your Own Cohort{" "}
          </Text>
        </Link>
      )}
      {!context.signerAddress && (
        <Text color="white" textAlign="center" mb="6rem">
          Deploy your own Cohort to begin slaying Moloch for your DAO today!
        </Text>
      )}

      {context.signerAddress && context.chainId in SUPPORTED_NETWORK_IDS && (
        <>
          {isLoading && <Spinner color="red" size="xl" />}
          {!isLoading &&
            (riteBalance > 0 ? (
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

                <Text
                  color="red"
                  fontSize={{ lg: "1.2rem", sm: "1rem" }}
                  mb="5px"
                >
                  You own a stake for {Number(riteBalance)} RITE
                </Text>
                <Text color="white" fontFamily="jetbrains" fontSize=".8rem">
                  Deadline - {new Date(stakeDeadline * 1000).toLocaleString()}
                </Text>
                <CountdownTimer
                  targetDate={new Date(stakeDeadline * 1000).getTime()}
                />
              </Flex>
            ) : (
              <Flex
                w="100%"
                direction="column"
                alignItems="flex-start"
                p="15px"
              >
                <StyledHStack mb="1rem">
                  <Text color="red" fontSize={{ lg: "1.2rem", sm: ".8rem" }}>
                    Required Stake
                  </Text>
                  <Text color="white" fontSize={{ lg: "1.2rem", sm: ".8rem" }}>
                    {utils.formatUnits(minimumStake, "ether")}{" "}
                    {TOKEN_TICKER[context.chainId]}
                  </Text>
                </StyledHStack>
                <StyledHStack>
                  <Text color="red" fontFamily="jetbrains" fontSize=".8rem">
                    Your {TOKEN_TICKER[context.chainId]} balance
                  </Text>
                  <Text color="white" fontSize=".8rem">
                    {utils.formatUnits(raidBalance, "ether")}{" "}
                    {TOKEN_TICKER[context.chainId]}
                  </Text>
                </StyledHStack>
                <StyledHStack>
                  <Text color="red" fontFamily="jetbrains" fontSize=".8rem">
                    Your {TOKEN_TICKER[context.chainId]} allowance
                  </Text>
                  <Text color="white" fontSize=".8rem">
                    {utils.formatUnits(allowance, "ether")}{" "}
                    {TOKEN_TICKER[context.chainId]}
                  </Text>
                </StyledHStack>
                <Flex
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  mt="2em"
                >
                  <Checkbox
                    defaultChecked
                    isChecked={isChecked}
                    onChange={handleIsChecked}
                  />
                  <Text
                    color="red"
                    fontFamily="jetbrains"
                    fontSize=".8rem"
                    ml="1em"
                  >
                    Sponsor a Cohort
                  </Text>
                </Flex>
                <Input
                  onChange={handlCohortAddress}
                  placeholder="Input Cohort Wallet Address or ENS"
                  _placeholder={{ color: "white", fontSize: "sm" }}
                  display={isChecked ? "inline" : "none"}
                  bg="#741739"
                  color="white"
                  rounded="none"
                  border="0px"
                  opacity="none"
                  width={{ md: "50%", sm: "full" }}
                  mt="1rem"
                  fontSize="sm"
                />
                <Flex mt="2rem" w="100%">
                  <StyledButton
                    bg="transparent"
                    border="2px solid"
                    borderColor="red"
                    color="red"
                    mr="1rem"
                    isLoading={isAppoveTxPending}
                    loadingText="Approving..."
                    disabled={
                      utils.formatUnits(allowance, "ether") >=
                      utils.formatUnits(minimumStake, "ether")
                    }
                    onClick={makeAnAllowance}
                    _hover={{
                      opacity: 0.8,
                    }}
                  >
                    Approve
                  </StyledButton>
                  <StyledButton
                    bg="red"
                    color="black"
                    isLoading={isStakeTxPending}
                    loadingText="Staking..."
                    disabled={
                      utils.formatUnits(allowance, "ether") <
                        utils.formatUnits(minimumStake, "ether") ||
                      utils.formatUnits(raidBalance, "ether") <
                        utils.formatUnits(minimumStake, "ether")
                    }
                    onClick={depositStake}
                    _hover={{
                      opacity: 0.8,
                    }}
                  >
                    Stake
                  </StyledButton>
                </Flex>
                <Flex
                  color="white"
                  mt="2rem"
                  mx="auto"
                  p="0.5rem"
                  textDecoration="underline"
                  textUnderlineOffset="4px"
                  _hover={{ cursor: "pointer" }}
                >
                  <Link href="/deploy-cohort">
                    <Text>Click Here To Deploy Your Own Cohort</Text>
                  </Link>
                </Flex>
              </Flex>
            ))}
        </>
      )}

      {context.signerAddress && !(context.chainId in SUPPORTED_NETWORK_IDS) && (
        <Flex direction="column" alignItems="center">
          <Box fontSize="40px" color="red">
            <i className="fa-solid fa-circle-xmark"></i>
          </Box>
          <Text fontFamily="spaceMono" color="white" fontSize="1.2rem">
            Unsupported network
          </Text>
        </Flex>
      )}
    </Flex>
  );
}
