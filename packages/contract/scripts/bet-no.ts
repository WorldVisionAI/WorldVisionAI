import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = "0x6f7f83Ae20341Dd0193cBb12237E3409eFD991A1"; // ここに実際のアドレスを入れてね
const USER_ADDRESS = "0xcAbF9D78B0ECf1DaB39e3Aaff219e15A0E81b2d3"; // 対象のユーザーアドレス
const AMOUNT = 6; // ベットする額（例: 100）

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  const predictionMarket = await ethers.getContractAt("PredictionMarket", CONTRACT_ADDRESS);

  const tx = await predictionMarket.betNoFor(USER_ADDRESS, AMOUNT);
  console.log("Sending betYesFor tx...");
  await tx.wait();

  console.log(`✅ betYesFor(${USER_ADDRESS}, ${AMOUNT}) executed successfully`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
