import { ethers } from 'ethers';

export const PREDICTION_MARKET_ADDRESS = '0x6f7f83Ae20341Dd0193cBb12237E3409eFD991A1';
export const PREDICTION_MARKET_ABI = [
  "function getTotalYes() external view returns (uint256)",
  "function getTotalNo() external view returns (uint256)",
  "function getTotalPool() external view returns (uint256)"
];

export const getProvider = () => {
  return new ethers.JsonRpcProvider(`https://worldchain-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);
};

export const getContract = (provider: ethers.Provider) => {
  return new ethers.Contract(
    PREDICTION_MARKET_ADDRESS,
    PREDICTION_MARKET_ABI,
    provider
  );
}; 
