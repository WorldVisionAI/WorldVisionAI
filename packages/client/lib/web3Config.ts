import { ethers } from 'ethers';

export const PREDICTION_MARKET_ADDRESS = '0x34C6Bd9a27C6A15A2f6a40fF6114604e7a279C3F';
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
