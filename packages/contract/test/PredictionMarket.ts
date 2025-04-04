import { expect } from "chai";
import { ethers } from "hardhat";
import { time, mine, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("PredictionMarket", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const PredictionMarket = await ethers.getContractFactory("PredictionMarket");

    const now = await time.latest();
    const startTime = now + 10;
    const deadline = now + 3600;

    const contract = await PredictionMarket.deploy(startTime, deadline);

    return { contract, owner, user1, user2, startTime, deadline };
  }

  it("Should deploy with correct parameters", async function () {
    const { contract, startTime, deadline } = await loadFixture(deployFixture);
    expect(await contract.startTime()).to.equal(startTime);
    expect(await contract.deadline()).to.equal(deadline);
  });

  it("Should allow only owner to betYesFor and betNoFor", async function () {
    const { contract, owner, user1, startTime } = await loadFixture(deployFixture);
    await time.setNextBlockTimestamp(startTime + 1);
    await mine();

    await expect(contract.connect(owner).betYesFor(user1.address, 100)).to.not.be.reverted;
    await expect(contract.connect(owner).betNoFor(user1.address, 200)).to.not.be.reverted;
    await expect(contract.connect(user1).betYesFor(user1.address, 100)).to.be.revertedWith("Not owner");
  });

  it("Should not allow betting outside of betting period", async function () {
    const { contract, owner, user1, deadline } = await loadFixture(deployFixture);

    // Too early
    await expect(contract.connect(owner).betYesFor(user1.address, 100)).to.be.revertedWith("Betting not allowed now");

    // After deadline
    await time.setNextBlockTimestamp(deadline + 10);
    await mine();

    await expect(contract.connect(owner).betYesFor(user1.address, 100)).to.be.revertedWith("Betting not allowed now");
  });

  it("Should finalize only after deadline and only once", async function () {
    const { contract, owner, deadline } = await loadFixture(deployFixture);

    await expect(contract.finalize(true)).to.be.revertedWith("Too early");

    await time.setNextBlockTimestamp(deadline + 1);
    await mine();

    await expect(contract.connect(owner).finalize(true)).to.not.be.reverted;
    await expect(contract.connect(owner).finalize(false)).to.be.revertedWith("Already finalized");
  });

  it("Should calculate correct rewards for YES winner", async function () {
    const { contract, owner, user1, user2, startTime, deadline } = await loadFixture(deployFixture);

    await time.setNextBlockTimestamp(startTime + 1);
    await mine();

    await contract.connect(owner).betYesFor(user1.address, 300);
    await contract.connect(owner).betNoFor(user2.address, 700);

    await time.setNextBlockTimestamp(deadline + 1);
    await mine();

    await contract.finalize(true); // YES wins

    const reward1 = await contract.getReward(user1.address);
    expect(reward1).to.equal(1000);

    const reward2 = await contract.getReward(user2.address);
    expect(reward2).to.equal(0);
  });

  it("Should calculate correct rewards for NO winner", async function () {
    const { contract, owner, user1, user2, startTime, deadline } = await loadFixture(deployFixture);

    await time.setNextBlockTimestamp(startTime + 1);
    await mine();

    await contract.connect(owner).betYesFor(user1.address, 300);
    await contract.connect(owner).betNoFor(user2.address, 700);

    await time.setNextBlockTimestamp(deadline + 1);
    await mine();

    await contract.finalize(false); // NO wins

    const reward1 = await contract.getReward(user1.address);
    expect(reward1).to.equal(0);

    const reward2 = await contract.getReward(user2.address);
    expect(reward2).to.equal(1000);
  });

  it("Should allow claim only once per user", async function () {
    const { contract, owner, user1, startTime, deadline } = await loadFixture(deployFixture);

    await time.setNextBlockTimestamp(startTime + 1);
    await mine();

    await contract.connect(owner).betYesFor(user1.address, 100);
    await contract.connect(owner).betNoFor(owner.address, 100);

    await time.setNextBlockTimestamp(deadline + 1);
    await mine();

    await contract.finalize(true);

    await contract.connect(user1).claim();
    await expect(contract.connect(user1).claim()).to.be.revertedWith("Already claimed");
  });
});
