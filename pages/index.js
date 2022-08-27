/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import {
  Flex,
  Box,
  Spinner,
  Link as ChakraLink,
  useToast
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { ethers, utils } from "ethers";

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
    const _riteBalance = await getTokenBalance(
      context.ethersProvider,
      context.signerAddress,
      contractAddress().riteOfMolochAddress
    );

    if (_riteBalance > 0) {
      setRiteBalance(_riteBalance);
      await fetchStakeDeadline();
    } else {
      await fetchMinimumStake();
      await fetchAllowance();
      await fetchRaidBalance();
    }
    setIsLoading(false);
  };

  const fetchStakeDeadline = async () => {
    const _stakeDeadline = await getStakeDeadline(
      context.ethersProvider,
      contractAddress().riteOfMolochAddress,
      context.signerAddress
    );
    // setStakeDeadline(Number(_stakeDeadline) + 60 * 60 * 24 * 30 * 6); // for rinkeby testing
    setStakeDeadline(Number(_stakeDeadline));
  };

  const fetchMinimumStake = async () => {
    const _stake = await getMinimumStake(
      context.ethersProvider,
      contractAddress().riteOfMolochAddress
    );
    setMinimumStake(_stake);
  };

  const fetchAllowance = async () => {
    const _allowance = await getAllowance(
      context.ethersProvider,
      contractAddress().erc20TokenAddress,
      context.signerAddress,
      contractAddress().riteOfMolochAddress
    );
    setAllowance(_allowance);
  };

  const fetchRaidBalance = async () => {
    const _raidBalance = await getTokenBalance(
      context.ethersProvider,
      context.signerAddress,
      contractAddress().erc20TokenAddress
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
      )
    });
  };

  const makeAnAllowance = async () => {
    setIsApproveTxPending(true);
    try {
      const tx = await approveRaid(
        context.ethersProvider,
        contractAddress().erc20TokenAddress,
        contractAddress().riteOfMolochAddress,
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
            )
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
        )
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
        contractAddress().riteOfMolochAddress,
        (cohortAddress != '' && isChecked) ? cohortAddress : context.signerAddress
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
            )
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
        )
      });
    }
    setIsStakeTxPending(false);
  };

  useEffect(() => {
    if (context.chainId in SUPPORTED_NETWORK_IDS) {
      initialFetch();
    }
  }, [context.chainId]);
  
  const contractAddress = () => CONTRACT_ADDRESSES[context.chainId];
  const tokenTicker = () => TOKEN_TICKER[context.chainId];

  const formatedAllowance = () => utils.formatUnits(allowance, "ether");
  const formatedMinumumStake = () => utils.formatUnits(minimumStake, "ether");
  const formatedRaidBalance = () => utils.formatUnits(raidBalance, "ether");

  const canStake =
  formatedAllowance() > formatedMinumumStake() &&
  formatedRaidBalance() > formatedMinumumStake() &&
    !ethers.utils.isAddress(cohortAddress);

  const canNotStakeTooltipLabel = !ethers.utils.isAddress(cohortAddress)
    ? "Please input a valid wallet address"
    : formatedAllowance() < formatedMinumumStake()
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
      )}
    </Flex>
  );
}
