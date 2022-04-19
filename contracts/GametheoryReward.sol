//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./IERC20.sol";

contract GametheoryReward {
    uint256 public GAME_FEE = 1e18;
    uint256 public BURN_FEE = 80;
    uint256 public REWARD_FEE = 50;
    uint256 public HIGHEST_SCORE = 0;

    address private immutable GAME_TOKEN_ADDR;
    address private immutable COINBOX_ADDRESS;

    uint256 public LAST_GAME_ID = 1;
    mapping(address => uint256) public GAME_IDS;

    event Enter(address indexed sender, uint256 timestamp);
    event Claim(address indexed rewarder, uint256 score);

    constructor(address _gameToken, address _coinboxAddress) {
        GAME_TOKEN_ADDR = _gameToken;
        COINBOX_ADDRESS = _coinboxAddress;
    }

    function enter_game() external returns (uint256) {
        // Burn tokens
        uint256 burnAmount = (GAME_FEE * BURN_FEE) / (10**2);
        IERC20(GAME_TOKEN_ADDR).burnFrom(msg.sender, burnAmount);

        // Send rest tokens to coinbox wallet
        uint256 restAmount = GAME_FEE - burnAmount;
        IERC20(GAME_TOKEN_ADDR).transferFrom(
            msg.sender,
            COINBOX_ADDRESS,
            restAmount
        );

        // Generate game id and assign it
        GAME_IDS[msg.sender] = LAST_GAME_ID++;

        emit Enter(msg.sender, LAST_GAME_ID);
        return LAST_GAME_ID;
    }

    function reward_game(uint256 _score) external {
        // Check game participate
        require(GAME_IDS[msg.sender] > 0, "You don't participate game yet.");

        // Check score
        require(_score > HIGHEST_SCORE, "Your score is not highest score.");

        // Reward tokens
        uint256 coinbox_balance = IERC20(GAME_TOKEN_ADDR).balanceOf(
            COINBOX_ADDRESS
        );
        uint256 rewardAmount = (coinbox_balance * REWARD_FEE) / (10**2);
        IERC20(GAME_TOKEN_ADDR).transferFrom(
            COINBOX_ADDRESS,
            msg.sender,
            rewardAmount
        );

        HIGHEST_SCORE = _score;

        emit Enter(msg.sender, _score);
    }
}
