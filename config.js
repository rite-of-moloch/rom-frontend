const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

export const SUPPORTED_NETWORK_IDS = {
  4: 'rinkeby',
  100: 'gnosis'
};

export const rpcUrls = {
  4: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
  100: 'https://rpc.gnosischain.com'
};
