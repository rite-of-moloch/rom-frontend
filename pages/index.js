/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { Flex, Box, Spinner, Heading, Link, useToast } from "@chakra-ui/react";
import { ethers, utils } from "ethers";
// import styled from "@emotion/styled";

import {
  getMinimumStake,
  getTokenBalance,
  getStakeDeadline,
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

export default function Home() {
  const appContext = useContext(AppContext);
  const toast = useToast();

  const [riteBalance, setRiteBalance] = useState(0);
  const [stakeDeadline, setStakeDeadline] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initialFetch = async () => {
    setIsLoading(true);
    await fetchRiteBalance();
    setIsLoading(false);
  };

  const fetchRiteBalance = async () => {
    const _riteBalance = await getTokenBalance(
      appContext.ethersProvider,
      appContext.signerAddress,
      CONTRACT_ADDRESSES[appContext.chainId].riteOfMolochAddress
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
      appContext.ethersProvider,
      CONTRACT_ADDRESSES[appContext.chainId].riteOfMolochAddress,
      appContext.signerAddress
    );
    // setStakeDeadline(Number(_stakeDeadline) + 60 * 60 * 24 * 30 * 6); // for rinkeby testing
    setStakeDeadline(Number(_stakeDeadline));
  };

  const fetchMinimumStake = async () => {
    const _stake = await getMinimumStake(
      appContext.ethersProvider,
      CONTRACT_ADDRESSES[appContext.chainId].riteOfMolochAddress
    );
    setMinimumStake(_stake);
  };

  const fetchAllowance = async () => {
    const _allowance = await getAllowance(
      appContext.ethersProvider,
      CONTRACT_ADDRESSES[appContext.chainId].erc20TokenAddress,
      appContext.signerAddress,
      CONTRACT_ADDRESSES[appContext.chainId].riteOfMolochAddress
    );
    setAllowance(_allowance);
  };

  const fetchRaidBalance = async () => {
    const _raidBalance = await getTokenBalance(
      appContext.ethersProvider,
      appContext.signerAddress,
      CONTRACT_ADDRESSES[appContext.chainId].erc20TokenAddress
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
          <Link
            href={`${EXPLORER_URLS[appContext.chainId]}/tx/${txHash}`}
            isExternal
            textDecoration="underline"
            cursor="pointer"
          >
            transaction
          </Link>
        </Box>
      ),
    });
  };

  const makeAnAllowance = async () => {
    setIsApproveTxPending(true);
    try {
      const tx = await approveRaid(
        appContext.ethersProvider,
        CONTRACT_ADDRESSES[appContext.chainId].erc20TokenAddress,
        CONTRACT_ADDRESSES[appContext.chainId].riteOfMolochAddress,
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
          ),
        });
        return;
      }
    }

    //Start stake process
    setIsStakeTxPending(true);
    try {
      const tx = await joinInitiation(
        appContext.ethersProvider,
        CONTRACT_ADDRESSES[appContext.chainId].riteOfMolochAddress,
        cohortAddress != "" && isChecked
          ? cohortAddress
          : appContext.signerAddress
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
    if (appContext.chainId in SUPPORTED_NETWORK_IDS) {
      initialFetch();
    }
  }, [appContext.chainId]);

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
    appContext.signerAddress && appContext.chainId in SUPPORTED_NETWORK_IDS;

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
      {!appContext.signerAddress && <PreStake />}

      {!appContext.signerAddress ? <DeployCohortButton /> : null}

      {appContext.signerAddress &&
        !(appContext.chainId in SUPPORTED_NETWORK_IDS) && <NetworkError />}

      {isLoading && <Spinner color="red" size="xl" />}

      <Flex
        opacity={!show || isLoading ? 0 : 1}
        transition="opacity 0.25s"
        w="100%"
      >
        {!isLoading &&
          (riteBalance > 0 ? (
            <RiteStaked
              balance={riteBalance}
              deadline={stakeDeadline}
              makeAnAllowance={makeAnAllowance}
              canStake={canStake}
              canNotStakeTooltipLabel={canNotStakeTooltipLabel}
              depositStake={depositStake}
            />
          ) : (
            <StakingFlow
              makeAnAllowance={makeAnAllowance}
              canStake={canStake}
              canNotStakeTooltipLabel={canNotStakeTooltipLabel}
              depositStake={depositStake}
            />
          ))}
      </Flex>
    </Flex>
  );
}
