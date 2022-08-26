import Link from "next/link";
import {
  Flex,
  SimpleGrid,
  Box,
  HStack,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function deployCohort() {
  const [daoAddress, setDaoAddress] = useState();
  const [duration, setDuration] = useState();
  const [stakingAsset, setStakingAsset] = useState();
  const [name, setName] = useState();
  const [treasury, setTreasury] = useState();
  const [tokenName, setTokenName] = useState();
  const [threshold, setThreshold] = useState();
  const [minimumStaked, setMinimumStaked] = useState();
  const [baseUri, setBaseUri] = useState();

  const handleDeployCohort = (e) => {
    e.preventDefault();
    console.log("deploy");
    const membershipCriteria = {
      daoAddress,
      duration,
      stakingAsset,
      name,
      treasury,
      tokenName,
      threshold,
      minimumStaked,
      baseUri,
    };
    console.log(membershipCriteria);
  };

  return (
    <Flex
      minH="350px"
      minW="80%"
      direction="column"
      alignItems="center"
      fontFamily="spaceMono"
      px="2rem"
    >
      <Text
        w={{ md: "90%", sm: "100%" }}
        bg="purple"
        p="15px"
        fontFamily="rubik"
        fontSize={{ lg: "1.2rem", sm: "1rem" }}
        my="2rem"
        textAlign="center"
      >
        Deploy Your Own Cohort
      </Text>
      <FormControl>
        <Flex alignItems="center" justifyContent="center">
          <SimpleGrid
            columns={2}
            spacingX={20}
            spacingY={6}
            width="80%"
            mb="4rem"
          >
            <Box>
              <FormLabel color="red" fontSize="md">
                The contract address used to ascertain cohort completion
              </FormLabel>
              <Input
                value={daoAddress}
                onChange={(e) => setDaoAddress(e.target.value)}
                type="text"
                isRequired={true}
                placeholder="Input daoAddress"
                _placeholder={{ color: "white", fontSize: "sm" }}
                bg="#741739"
                color="white"
                rounded="none"
                border="2px"
                p="1.5rem"
                mt="0.5rem"
                fontSize="sm"
              />
            </Box>
            <Box>
              <FormLabel color="red" fontSize="md">
                Duration before cohort can be slashed
              </FormLabel>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                type="number"
                isRequired={true}
                placeholder="Input duration in seconds"
                _placeholder={{ color: "white", fontSize: "sm" }}
                bg="#741739"
                color="white"
                rounded="none"
                border="2px"
                p="1.5rem"
                mt="0.5rem"
                fontSize="sm"
              />
            </Box>
            <Box>
              <FormLabel color="red" fontSize="md">
                Contract address for the asset which is staked into the cohort
                contract
              </FormLabel>
              <Input
                value={stakingAsset}
                onChange={(e) => setStakingAsset(e.target.value)}
                placeholder="Input stakingAsset Address"
                _placeholder={{ color: "white", fontSize: "sm" }}
                isRequired={true}
                bg="#741739"
                color="white"
                rounded="none"
                border="2px"
                p="1.5rem"
                mt="0.5rem"
                fontSize="sm"
              />
            </Box>
            <Box>
              <FormLabel color="red" fontSize="md">
                The name for the cohort's soul bound token (SBT)
              </FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Input name for SBT"
                _placeholder={{ color: "white", fontSize: "sm" }}
                isRequired={true}
                bg="#741739"
                color="white"
                rounded="none"
                border="2px"
                p="1.5rem"
                mt="0.5rem"
                fontSize="sm"
              />
            </Box>
            <Box>
              <FormLabel color="red" fontSize="md">
                The address which received tokens when initiates are slashed
              </FormLabel>
              <Input
                value={treasury}
                onChange={(e) => setTreasury(e.target.value)}
                placeholder="Input treasury Address"
                _placeholder={{ color: "white", fontSize: "sm" }}
                isRequired={true}
                bg="#741739"
                color="white"
                rounded="none"
                border="2px"
                p="1.5rem"
                mt="0.5rem"
                fontSize="sm"
              />
            </Box>
            <Box>
              <FormLabel color="red" fontSize="md">
                The ticker symbol for cohort's soul bound token
              </FormLabel>
              <Input
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Input token name"
                _placeholder={{ color: "white", fontSize: "sm" }}
                isRequired={true}
                bg="#741739"
                color="white"
                rounded="none"
                border="2px"
                p="1.5rem"
                mt="0.5rem"
                fontSize="sm"
              />
            </Box>
            <Box>
              <FormLabel color="red" fontSize="md">
                The minimum amount of criteria which constitues DAO membership
              </FormLabel>
              <Input
                value={threshold}
                onChange={(e) => setThresholdSales(e.target.value)}
                placeholder="Input threshold or shares required"
                _placeholder={{ color: "white", fontSize: "sm" }}
                isRequired={true}
                bg="#741739"
                color="white"
                rounded="none"
                border="2px"
                p="1.5rem"
                mt="0.5rem"
                fontSize="sm"
              />
            </Box>
            <Box>
              <FormLabel color="red" fontSize="md">
                The minimum amount of staking asset required to join the cohort
              </FormLabel>
              <Input
                value={minimumStaked}
                onChange={(e) => setMinimumStaked(e.target.value)}
                placeholder="Input the minimum staked asset to join"
                _placeholder={{ color: "white", fontSize: "sm" }}
                isRequired={true}
                bg="#741739"
                color="white"
                rounded="none"
                border="2px"
                p="1.5rem"
                mt="0.5rem"
                fontSize="sm"
              />
            </Box>
            <Box>
              <FormLabel color="red" fontSize="md">
                The uniform resource identifier (URI) for accessing soul bould
                token metadata
              </FormLabel>
              <Input
                value={baseUri}
                onChange={(e) => setBaseUri(e.target.value)}
                placeholder="Input the baseuri for soul bound token metadata"
                _placeholder={{ color: "white", fontSize: "sm" }}
                isRequired={true}
                bg="#741739"
                color="white"
                rounded="none"
                border="2px"
                p="1.5rem"
                mt="0.5rem"
                fontSize="sm"
              />
            </Box>
          </SimpleGrid>
        </Flex>
        <Button
          onClick={handleDeployCohort}
          display="flex"
          bg="black"
          color="red"
          border="2px"
          borderColor="red"
          width="50%"
          p="1.75rem"
          m="auto"
          mb="6rem"
          alignItems="center"
          _hover={{ cursor: "pointer" }}
        >
          DEPLOY
        </Button>
      </FormControl>
    </Flex>
  );
}
