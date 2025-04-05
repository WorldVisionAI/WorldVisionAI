import { ethers } from 'ethers';

export const PREDICTION_MARKET_ADDRESS =
  process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS || '';
export const PREDICTION_MARKET_ABI = [
  'function getTotalYes() external view returns (uint256)',
  'function getTotalNo() external view returns (uint256)',
  'function getTotalPool() external view returns (uint256)',
];

export const getProvider = () => {
  return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
};

export const getContract = (provider: ethers.Provider) => {
  return new ethers.Contract(
    PREDICTION_MARKET_ADDRESS,
    PREDICTION_MARKET_ABI,
    provider,
  );
};
