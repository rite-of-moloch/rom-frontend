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
  getTokenBalance,
  getAllowance,
  approveRaid,
  joinInitiation,
} from "../utils/web3";

import { AppContext } from "../context/AppContext";
import { CONTRACT_ADDRESSES, EXPLORER_URLS } from "../utils/constants";
import { SUPPORTED_NETWORK_IDS } from "../config";
import { NetworkError } from "../shared/NetworkError";
import { RiteStaked } from "../shared/RiteStaked";
import { StakingFlow } from "../shared/StakingFlow";
import { CohortHeader } from "../shared/CohortHeader";
import { PreStake } from "../shared/PreStake";
import { HeaderOne } from "../shared/Header0ne";
import { DeployCohortButton } from "../shared/DeployCohortButton";
import { useCohort, useInitiate } from "../hooks/useSubgraph";

export default function Home() {
  const context = useContext(AppContext);
  const toast = useToast();

  const [raidBalance, setRaidBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isApproveTxPending, setIsApproveTxPending] = useState(false);
  const [isStakeTxPending, setIsStakeTxPending] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [cohortAddress, setCohortAddress] = useState("");

  const initiate = useInitiate(); //Use user's address, filtering by S5 cohort
  const cohort = useCohort(); //S5 cohort object

  const initialFetch = async () => {
    setIsLoading(true);
    if (!initiate) {
      console.log("Fetching ERC20 data");
      await fetchAllowance();
      await fetchRaidBalance();
    }
    setIsLoading(false);
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
        cohort.tokenAmount
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
          ),
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
        if (status !== 1) {
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

  const canStake = cohort &&
    utils.formatUnits(allowance, "ether") >=
    utils.formatUnits(cohort.tokenAmount, "ether") &&
    utils.formatUnits(raidBalance, "ether") >=
    utils.formatUnits(cohort.tokenAmount, "ether") &&
    !ethers.utils.isAddress(cohortAddress);

  const canNotStakeTooltipLabel = !ethers.utils.isAddress(cohortAddress)
    ? "Please input a valid wallet address"
    : utils.formatUnits(allowance, "ether") <
      utils.formatUnits(cohort.tokenAmount, "ether")
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
      <HeaderOne />
      <CohortHeader />
      {!context.signerAddress && <PreStake />}

      {!context.signerAddress && <DeployCohortButton />}

      {context.signerAddress && !(context.chainId in SUPPORTED_NETWORK_IDS) && (
        <NetworkError />
      )}

      {isLoading && <Spinner color="red" size="xl" />}

      <Flex
        opacity={!show || isLoading ? 0 : 1}
        transition="opacity 0.25s"
        w="100%"
      >
        {!isLoading &&
          (initiate ? (
            <RiteStaked balance={initiate ? 1 : 0} deadline={initiate.deadline} />
          ) : cohort && (
            <StakingFlow
              minimumStake={cohort.tokenAmount}
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
    </Flex>
  );
}
