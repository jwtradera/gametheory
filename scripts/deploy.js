const hre = require("hardhat");

const { COINBOX_ADDRESS, GAME_TOKEN_ADDR } = require('../settings.json');

async function main() {
  const GametheoryReward = await hre.ethers.getContractFactory("GametheoryReward");
  const contract = await GametheoryReward.deploy(GAME_TOKEN_ADDR, COINBOX_ADDRESS);

  await contract.deployed();

  console.log("GametheoryReward deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
