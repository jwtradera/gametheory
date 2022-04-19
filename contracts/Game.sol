// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract Game is ERC20Burnable {

    /**
     * @notice Constructs the GAME ERC-20 contract.
     */
    constructor() public ERC20("GAME", "Game Theory (gametheory.tech): GAME Token") {
        _mint(msg.sender, 100000 ether);
    }
}