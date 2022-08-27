/* eslint-disable react-hooks/exhaustive-deps */
import {
  Flex,
  Text,
  Box,
  Button,
  Spinner,
  Image as ChakraImage,
  Link as ChakraLink,
  HStack,
  useToast,
  Checkbox,
  Input,
  Tooltip
} from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import { ethers, utils } from 'ethers';
import styled from '@emotion/styled';

import {
  getMinimumStake,
  getTokenBalance,
  getStakeDeadline,
  getAllowance,
  approveRaid,
  joinInitiation
} from '../utils/web3';

import { AppContext } from '../context/AppContext';
import { CONTRACT_ADDRESSES, TOKEN_TICKER, EXPLORER_URLS } from '../utils/constants';
import { SUPPORTED_NETWORK_IDS } from '../config';
import { CountdownTimer } from '../shared/CountdownTimer';

const StyledButton = styled(Button)`
  height: 50px;
  width: 100%;
  border-radius: '2px';
  padding-left: '24px';
  padding-right: '24px';
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
  const [isAppoveTxPending, setIsApproveTxPending] = useState(false);
  const [isStakeTxPending, setIsStakeTxPending] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [cohortAddress, setCohortAddress] = useState('');

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
      position: 'bottom-left',
      duration: 9000,
      render: () => (
        <Box
          color='white'
          fontFamily='spaceMono'
          fontSize='.8rem'
          bg='blackLight'
          p='15px'
          borderRadius='10px'
          width='auto'
        >
          <i className='fa-solid fa-circle-info'></i> View your{' '}
          <ChakraLink
            href={`${EXPLORER_URLS[context.chainId]}/tx/${txHash}`}
            isExternal
            textDecoration='underline'
            cursor='pointer'
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
            position: 'bottom-left',
            render: () => (
              <Box color='white' p={3} bg='red.500'>
                'Transaction failed.'
              </Box>
            )
          });
        }
      }
    } catch (err) {
      toast({
        position: 'bottom-left',
        render: () => (
          <Box color='white' p={3} bg='red.500'>
            {err.message}
          </Box>
        )
      });
    }
    setIsApproveTxPending(false);
  };

  const depositStake = async () => {
    //Check if cohortAddress is an actual address
    if (cohortAddress != '' && isChecked) {
      if (!utils.isAddress(cohortAddress)) {
        toast({
          position: "bottom-left",
          duration: 5000,
          render: () => (
            <Box color='white' p={3} bg='red.500'>
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
            position: 'bottom-left',
            render: () => (
              <Box color='white' p={3} bg='red.500'>
                Transaction failed.
              </Box>
            )
          });
        }
      }
    } catch (err) {
      toast({
        position: 'bottom-left',
        render: () => (
          <Box color='white' p={3} bg='red.500'>
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

  const formatedAllowance = () => utils.formatUnits(allowance, 'ether');
  const formatedMinumumStake = () => utils.formatUnits(minimumStake, 'ether');
  const formatedRaidBalance = () => utils.formatUnits(raidBalance, 'ether');

  const canStake =
    formatedAllowance() > formatedMinumumStake() &&
    formatedRaidBalance() > formatedMinumumStake() &&
    !ethers.utils.isAddress(cohortAddress);

  const canNotStakeTooltipLabel = !ethers.utils.isAddress(cohortAddress)
    ? 'Please input a valid wallet address'
    : formatedAllowance() < formatedMinumumStake()
    ? 'Allowance is smaller than the minimum stake amount.'
    : 'Your RAID balance is too low';

  return (
    <Flex
      minH='350px'
      minW='80%'
      direction='column'
      alignItems='center'
      fontFamily='spaceMono'
      px='2rem'
    >
      <Text
        w='100%'
        bg='purple'
        p='15px'
        fontFamily='rubik'
        fontSize={{ lg: '1.2rem', sm: '1rem' }}
        mb='2rem'
        textAlign='center'
      >
        Cohort - Season 5
      </Text>
      {!context.signerAddress && (
        <Text color='white' textAlign='center'>
          Connect your wallet to stake & commit to our cohort!
        </Text>
      )}

      {context.signerAddress && context.chainId in SUPPORTED_NETWORK_IDS && (
        <>
          {isLoading && <Spinner color='red' size='xl' />}
          {!isLoading &&
            (riteBalance > 0 ? (
              <Flex
                w='100%'
                direction='column'
                alignItems='center'
                justifyContent='space-between'
                p='15px'
              >
                <ChakraImage
                  src='/assets/token_img.jpg'
                  w='150px'
                  borderRadius='20px'
                  mb='2rem'
                  alt='Rite Token'
                />

                <Text
                  color='red'
                  fontSize={{ lg: '1.2rem', sm: '1rem' }}
                  mb='5px'
                >
                  You own a stake for {Number(riteBalance)} RITE
                </Text>
                <Text color='white' fontFamily='jetbrains' fontSize='.8rem'>
                  Deadline - {new Date(stakeDeadline * 1000).toLocaleString()}
                </Text>
                <CountdownTimer
                  targetDate={new Date(stakeDeadline * 1000).getTime()}
                />
              </Flex>
            ) : (
              <Flex
                w='100%'
                direction='column'
                alignItems='flex-start'
                p='15px'
              >
                <StyledHStack mb='1rem'>
                  <Text color='red' fontSize={{ lg: '1.2rem', sm: '.8rem' }}>
                    Required Stake
                  </Text>
                  <Text color='white' fontSize={{ lg: '1.2rem', sm: '.8rem' }}>
                    {formatedMinumumStake()}{' '}
                    {tokenTicker()}
                  </Text>
                </StyledHStack>
                <StyledHStack>
                  <Text color='red' fontFamily='jetbrains' fontSize='.8rem'>
                    Your {tokenTicker()} balance
                  </Text>
                  <Text color='white' fontSize='.8rem'>
                    {formatedRaidBalance()}{' '}
                    {tokenTicker()}
                  </Text>
                </StyledHStack>
                <StyledHStack>
                  <Text color='red' fontFamily='jetbrains' fontSize='.8rem'>
                    Your {tokenTicker()} allowance
                  </Text>
                  <Text color='white' fontSize='.8rem'>
                    {formatedAllowance()}{' '}
                    {tokenTicker()}
                  </Text>
                </StyledHStack>
                <Flex
                  flexDirection='row'
                  alignItems='center'
                  justifyContent='center'
                  mt='2em'
                >
                  <Checkbox
                    defaultChecked
                    isChecked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <Text
                    color='red'
                    fontFamily='jetbrains'
                    fontSize='.8rem'
                    ml='1em'
                  >
                    Sponsor a Cohort member
                  </Text>
                </Flex>
                <Input
                  onChange={ e => setCohortAddress(e.target.value)}
                  placeholder="Sponsor's member wallet address or ENS"
                  value={cohortAddress}
                  _placeholder={{ color: 'white', fontSize: 'sm' }}
                  display={isChecked ? 'inline' : 'none'}
                  bg='#741739'
                  color='white'
                  rounded='none'
                  border='0px'
                  opacity='none'
                  width={{ md: '50%', sm: 'full' }}
                  mt='1rem'
                  fontSize='sm'
                />
                <Flex mt='2rem' w='100%'>
                  <StyledButton
                    bg='transparent'
                    border='2px solid'
                    borderColor='red'
                    color='red'
                    mr='1rem'
                    isLoading={isAppoveTxPending}
                    loadingText='Approving...'
                    disabled={
                      formatedAllowance() >=
                      formatedMinumumStake()
                    }
                    onClick={makeAnAllowance}
                    _hover={{
                      opacity: 0.8
                    }}
                  >
                    Approve
                  </StyledButton>
                  <Tooltip
                    isDisabled={canStake}
                    label={canNotStakeTooltipLabel}
                    shouldWrapChildren
                  >
                    <StyledButton
                      bg='red'
                      color='black'
                      isLoading={isStakeTxPending}
                      loadingText='Staking...'
                      disabled={!canStake}
                      onClick={depositStake}
                      _hover={{
                        opacity: 0.8
                      }}
                    >
                      Stake
                    </StyledButton>
                  </Tooltip>
                </Flex>
              </Flex>
            ))}
        </>
      )}

      {context.signerAddress && !(context.chainId in SUPPORTED_NETWORK_IDS) && (
        <Flex direction='column' alignItems='center'>
          <Box fontSize='40px' color='red'>
            <i className='fa-solid fa-circle-xmark'></i>
          </Box>
          <Text fontFamily='spaceMono' color='white' fontSize='1.2rem'>
            Unsupported network
          </Text>
        </Flex>
      )}
    </Flex>
  );
}
