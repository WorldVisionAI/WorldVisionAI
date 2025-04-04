import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox"; // ←これが必要！

const config: HardhatUserConfig = {
  solidity: "0.8.28",
};

export default config;
