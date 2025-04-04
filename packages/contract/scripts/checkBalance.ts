import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // 🔐 チェックしたい秘密鍵（0xから始まる）
  const privateKey = process.env.PRIVATE_KEY; // ←ここに秘密鍵を入れる

  // 🌐 プロバイダーを使ってウォレット作成
const wallet = new ethers.Wallet(privateKey, ethers.provider);

  const address = await wallet.getAddress();
  const balance = await ethers.provider.getBalance(address);

  console.log(`🔍 Address: ${address}`);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
