// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract PredictionMarket {
    address public owner;
    uint256 public startTime;
    uint256 public deadline;
    bool public finalized;
    bool public finalResult; // true = Yes, false = No

    mapping(address => uint256) public yesBets;
    mapping(address => uint256) public noBets;

    uint256 public totalYes;
    uint256 public totalNo;

    mapping(address => bool) public claimed;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier duringBetting() {
        require(block.timestamp >= startTime && block.timestamp <= deadline, "Betting not allowed now");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp > deadline, "Too early");
        _;
    }

    constructor(uint256 _startTime, uint256 _deadline) {
        require(_startTime < _deadline, "Start must be before deadline");
        owner = msg.sender;
        startTime = _startTime;
        deadline = _deadline;
    }

    // オーナーが代理で YES にベット記録
    function betYesFor(address user, uint256 amount) external onlyOwner duringBetting {
        require(amount > 0, "Amount must be greater than 0");
        yesBets[user] += amount;
        totalYes += amount;
    }

    // オーナーが代理で NO にベット記録
    function betNoFor(address user, uint256 amount) external onlyOwner duringBetting {
        require(amount > 0, "Amount must be greater than 0");
        noBets[user] += amount;
        totalNo += amount;
    }

    // 結果の確定（オーナーのみ）
    function finalize(bool _result) external onlyOwner afterDeadline {
        require(!finalized, "Already finalized");
        finalized = true;
        finalResult = _result;
    }

    // ユーザーの報酬額を計算（記録用）
    function getReward(address user) public view returns (uint256) {
        require(finalized, "Not finalized");

        if (finalResult) {
            uint256 userBet = yesBets[user];
            if (userBet == 0) return 0;
            return (totalYes + totalNo) * userBet / totalYes;
        } else {
            uint256 userBet = noBets[user];
            if (userBet == 0) return 0;
            return (totalYes + totalNo) * userBet / totalNo;
        }
    }

    // 報酬のクレーム（送金はしない／記録のみ）
    function claim() external {
        require(finalized, "Not finalized");
        require(!claimed[msg.sender], "Already claimed");

        uint256 reward = getReward(msg.sender);
        require(reward > 0, "No reward");

        claimed[msg.sender] = true;
        // 実際の送金はここでは行わない
    }

    // 集計系ビュー関数
    function getTotalYes() external view returns (uint256) {
        return totalYes;
    }

    function getTotalNo() external view returns (uint256) {
        return totalNo;
    }

    function getTotalPool() external view returns (uint256) {
        return totalYes + totalNo;
    }
}
