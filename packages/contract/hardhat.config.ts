import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import process from "process";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    "worldchain-mainnet": {
      url: `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 480,
      accounts: privateKey ? [privateKey] : [],
    },
    "worldchain-sepolia": {
      url: `https://worldchain-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 4801,
      accounts: privateKey ? [privateKey] : [],
    },
    "polygon": {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 137,
      accounts: privateKey ? [privateKey] : [],
    },
    "polygon-mumbai": {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 80001,
      accounts: privateKey ? [privateKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      "worldchain-sepolia": process.env.WORLDCHAIN_API_KEY || "",
    },
    customChains: [
      {
        network: "worldchain-sepolia",
        chainId: 4801,
        urls: {
          apiURL: "https://api-sepolia.worldscan.org/api", // ここを実際のAPI URLに変更
          browserURL: "https://sepolia.worldscan.org/",     // 実際のブラウザURLに変更
        },
      },
    ],
  },
};

export default config;
