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
  Button,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function deployCohort() {
  const [daoAddress, setDaoAddress] = useState();
  const [duration, setDuration] = useState();
  const [stakingAssetAddress, setStakingAssetAddress] = useState();
  const [nameSBT, setNameSBT] = useState();
  const [treasuryAddress, setTreasuryAddress] = useState();
  const [tokenName, setTokenName] = useState();
  const [thresholdShares, setThresholdSales] = useState();
  const [minimumStaked, setMinimumStake] = useState();
  const [baseURI, setBaseURI] = useState();

  const handleDeployCohort = (e) => {
    e.preventDefault();
    console.log("deploy");
    const membershipCriteria = {
      daoAddress,
      duration,
      stakingAssetAddress,
      nameSBT,
      treasuryAddress,
      tokenName,
      thresholdShares,
      minimumStaked,
      baseURI,
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
      <FormControl onSubmit={handleDeployCohort}>
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
                onChange={(e) => setStakingAssetAddress(e.target.value)}
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
                onChange={(e) => setNameSBT(e.target.value)}
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
                onChange={(e) => setTreasuryAddress(e.target.value)}
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
                onChange={(e) => setMinimumStake(e.target.value)}
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
                onChange={(e) => setBaseURI(e.target.value)}
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
