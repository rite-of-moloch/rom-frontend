import {
  Flex,
  Image,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useContext } from "react";
import { useRouter } from "next/router";

import { AppContext } from "../context/AppContext";
import { useWallet } from "../hooks/useWallet";

import { SUPPORTED_NETWORK_IDS } from "../config";

const getAccountString = (account) => {
  const len = account.length;
  return `0x${account.substr(2, 3).toUpperCase()}...${account
    .substr(len - 3, len - 1)
    .toUpperCase()}`;
};

const StyledPrimaryButton = styled(Button)`
  min-width: 160px;
  height: 50px;
  text-transform: uppercase;
  border-radius: 2px;
  padding-left: 24px;
  padding-right: 24px;
`;

export const Header = () => {
  const context = useContext(AppContext);
  const { connectWallet, disconnect } = useWallet();
  const router = useRouter();

  return (
    <Flex
      h="100px"
      w="100%"
      alignItems="center"
      justifyContent="space-between"
      px="2rem"
    >
      <Link href="/" passHref>
        <Flex alignItems="center" cursor="pointer">
          <Image
            src="/assets/logos/swords.webp"
            alt="logo"
            w={{ lg: "50px", sm: "25px" }}
          />
          {router.pathname === "/deploy-cohort" ? (
            <Text
              color="red"
              fontFamily="uncial"
              fontSize={{ lg: "1.5rem", sm: "1rem" }}
              ml="5px"
            >
              Moloch Cohort Deployer
            </Text>
          ) : (
            <Text
              color="red"
              fontFamily="uncial"
              fontSize={{ lg: "1.5rem", sm: "1rem" }}
              ml="5px"
            >
              Rite of Moloch
            </Text>
          )}
        </Flex>
      </Link>
      {!context.signerAddress && (
        <Flex gap="4">
          <Link href={"https://riteofmoloch.gitbook.io/riteofmoloch/"}>
            <StyledPrimaryButton
              bg="red"
              fontFamily="spaceMono"
              _hover={{ backgroundColor: "purple", color: "white" }}
            >
              DOCS
            </StyledPrimaryButton>
          </Link>
          <StyledPrimaryButton
            bg="red"
            onClick={connectWallet}
            fontFamily="spaceMono"
            _hover={{ backgroundColor: "purple", color: "white" }}
          >
            CONNECT
          </StyledPrimaryButton>
        </Flex>
      )}

      {context.signerAddress && (
        <Flex
          justify="center"
          align="center"
          zIndex={5}
          gap={4}
          fontFamily="jetbrains"
        >
          <Link href={"https://riteofmoloch.gitbook.io/riteofmoloch/"}>
            <StyledPrimaryButton
              bg="red"
              fontFamily="spaceMono"
              _hover={{ backgroundColor: "purple", color: "white" }}
            >
              DOCS
            </StyledPrimaryButton>
          </Link>
          <Popover placement="bottom">
            <PopoverTrigger>
              <StyledPrimaryButton
                backgroundColor={"black"}
                color={"red"}
                _hover={{ backgroundColor: "purple", color: "white" }}
              >
                {getAccountString(context.signerAddress)}
              </StyledPrimaryButton>
            </PopoverTrigger>
            <PopoverContent bg="none" w="auto" border="none">
              <Button
                bg="red"
                onClick={() => {
                  disconnect();
                }}
                mt="5px"
                _hover={{ backgroundColor: "purple", color: "white" }}
              >
                Disconnect
              </Button>
            </PopoverContent>
          </Popover>
          <Text color="white" fontFamily="jetbrains" mr="1rem" fontSize=".8rem">
            {SUPPORTED_NETWORK_IDS[context.chainId]}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
