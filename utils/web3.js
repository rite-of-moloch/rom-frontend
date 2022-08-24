import { Contract, utils } from 'ethers';

import { CONTRACT_ADDRESSES } from '../utils/constants';

export const approveRaid = async (
  ethersProvider,
  contractAddress,
  addressTo,
  amount
) => {
  const abiInterface = new utils.Interface([
    'function approve(address spender, uint256 amount) public virtual override returns (bool)'
  ]);
  const contract = new Contract(
    contractAddress,
    abiInterface,
    ethersProvider.getSigner()
  );
  return contract.approve(addressTo, amount);
};

export const joinInitiation = async (
  ethersProvider,
  contractAddress,
  userAddress
) => {
  const abiInterface = new utils.Interface([
    'function joinInitiation(address user) public callerIsUser'
  ]);
  const contract = new Contract(
    contractAddress,
    abiInterface,
    ethersProvider.getSigner()
  );
  return contract.joinInitiation(userAddress);
};

export const getTokenBalance = async (
  ethersProvider,
  userAddress,
  tokenContractAddress
) => {
  const abiInterface = new utils.Interface([
    'function balanceOf(address owner) public view virtual override returns (uint256)'
  ]);
  const contract = new Contract(
    tokenContractAddress,
    abiInterface,
    ethersProvider
  );
  return contract.balanceOf(userAddress);
};

export const getMinimumStake = async (ethersProvider, contractAddress) => {
  const abiInterface = new utils.Interface([
    'function minimumStake() public view returns (uint256)'
  ]);
  const contract = new Contract(contractAddress, abiInterface, ethersProvider);
  return contract.minimumStake();
};

export const getStakeDeadline = async (
  ethersProvider,
  contractAddress,
  userAddress
) => {
  const abiInterface = new utils.Interface([
    'function getDeadline(address user) public view returns (uint256)'
  ]);
  const contract = new Contract(contractAddress, abiInterface, ethersProvider);
  return contract.getDeadline(userAddress);
};

export const getAllowance = async (
  ethersProvider,
  tokenContractAddress,
  ownerAddress,
  spenderAddress
) => {
  const abiInterface = new utils.Interface([
    'function allowance(address owner, address spender) public view virtual override returns (uint256)'
  ]);
  const contract = new Contract(
    tokenContractAddress,
    abiInterface,
    ethersProvider
  );
  return contract.allowance(ownerAddress, spenderAddress);
};
