const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/signers");
const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const { GAME_TOKEN_ADDR, COINBOX_ADDRESS } = require('../settings.json');

let gameContract;
let contract;
let owner;
let addr1;
let addr2;
let addr3;
let addrs;

function delay(interval) {
  return it('should delay', done => {
    setTimeout(() => done(), interval)

  }).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
}

beforeEach(async function () {
  [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

  const GameContract = await ethers.getContractFactory("Game");
  gameContract = await GameContract.deploy();

  // Supply game tokens
  await gameContract.connect(owner).transfer(addr1.address, parseEther('10000'));
  await gameContract.connect(owner).transfer(addr2.address, parseEther('10000'));

  const RewardContract = await ethers.getContractFactory("GametheoryReward");
  contract = await RewardContract.deploy(gameContract.address, addr3.address);

  // Approve game tokens
  await gameContract.connect(owner).approve(contract.address, parseEther('10000'))
  await gameContract.connect(addr1).approve(contract.address, parseEther('10000'))
  await gameContract.connect(addr2).approve(contract.address, parseEther('10000'))
  await gameContract.connect(addr3).approve(contract.address, parseEther('10000'))
})

describe("Game reward contract", function () {

  it("Check deploy", async function () {
    const highestScore = await contract.HIGHEST_SCORE();
    expect(highestScore).to.equal(0);
  });

  it("Check enter and reward", async function () {

    assert.ok(await contract.connect(owner).enter_game());
    const gameId = (await contract.GAME_IDS(owner.address)).toNumber();
    expect(gameId).to.equal(1);

    assert.ok(await contract.connect(addr1).enter_game());
    assert.ok(await contract.connect(addr2).enter_game());

    assert.ok(await contract.connect(addr1).reward_game(3));

    const balance = await gameContract.balanceOf(addr1.address);
    console.log(balance);

    await expect(
      contract.connect(owner).reward_game(2)
    ).to.be.revertedWith("Your score is not highest score.");

  });
});
