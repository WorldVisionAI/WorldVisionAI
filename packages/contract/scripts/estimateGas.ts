import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");

  const now = Math.floor(Date.now() / 1000);
  const startTime = now + 60;
  const deadline = now + 3600;

  const deployTx = PredictionMarket.getDeployTransaction(startTime, deadline);

  const from = await deployer.getAddress();

  const estimatedGas = await ethers.provider.estimateGas({
    ...deployTx,
    from,
  });

  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice!;

  // ✅ BigInt での計算
  const estimatedFee = estimatedGas * gasPrice;

  console.log(`📦 Estimated Gas: ${estimatedGas}`);
  console.log(`⛽ Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);
  console.log(`💰 Estimated Fee (ETH): ${ethers.formatEther(estimatedFee)} ETH`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
