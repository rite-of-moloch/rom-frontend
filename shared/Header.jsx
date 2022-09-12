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
            w={{ base: 8, lg: 12 }}
          />
          {router.pathname === "/deploy-cohort" ? (
            <Text
              color="red"
              fontFamily="uncial"
              fontSize={{ base: 16, lg: 24 }}
              ml="5px"
            >
              Moloch Cohort Deployer
            </Text>
          ) : (
            <Text
              color="red"
              fontFamily="uncial"
              fontSize={{ base: 16, lg: 24 }}
              ml="5px"
            >
              Rite of Moloch
            </Text>
          )}
        </Flex>
      </Link>

      {!context.signerAddress && (
        <Button
          bg="red"
          borderRadius={2}
          color="black"
          onClick={connectWallet}
          fontFamily="spaceMono"
          px={{ base: 4, md: 10 }}
        >
          CONNECT
        </Button>
      )}

      {context.signerAddress && (
        <Flex
          justify="center"
          align="center"
          zIndex={5}
          fontFamily="jetbrains"
          gap={2}
          direction="column-reverse"
          flexDir={{ md: "row" }}
        >
          <Text color="white" fontFamily="jetbrains" mr="1rem" fontSize=".8rem">
            {SUPPORTED_NETWORK_IDS[context.chainId]}
          </Text>
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                h="auto"
                bg="blackDark"
                fontWeight="normal"
                _hover={{ opacity: "0.8" }}
                p={{ base: 0, md: 3 }}
              >
                <Text px={2} display={{ md: "flex" }} color="red">
                  {getAccountString(context.signerAddress)}
                </Text>
              </Button>
            </PopoverTrigger>
            <PopoverContent bg="none" w="auto" border="none">
              <Button
                bg="red"
                onClick={() => {
                  disconnect();
                }}
                mt="5px"
              >
                Disconnect
              </Button>
            </PopoverContent>
          </Popover>
        </Flex>
      )}
    </Flex>
  );
};
