import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = "0x9d8D8884581B06535dA5560EbdB40530077496DE"; // コントラクトアドレス
const ADMIN_ADDRESS = "0xCb2C2F1981a96793a513C61C7F5D5F2A1fB7300d"; // 追加したい管理者のアドレス

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  const predictionMarket = await ethers.getContractAt("PredictionMarket", CONTRACT_ADDRESS);

  const tx = await predictionMarket.addAdmin(ADMIN_ADDRESS);
  console.log("Sending addAdmin tx...");
  await tx.wait();

  console.log(`✅ addAdmin(${ADMIN_ADDRESS}) executed successfully`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 