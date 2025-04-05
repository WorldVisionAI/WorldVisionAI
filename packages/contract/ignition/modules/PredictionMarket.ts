const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PredictionMarketModule = buildModule("PredictionMarketModule", (m:any) => {
  const now = Math.floor(Date.now() / 1000);
  const startTime = now + 60;      // 1分後に開始
  const deadline = now + 3600 * 24 * 7;     // 1時間後に締切

  const predictionMarket = m.contract("PredictionMarket", [startTime, deadline]);

  return { predictionMarket };
});

module.exports = PredictionMarketModule;
