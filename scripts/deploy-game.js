const hre = require("hardhat");

async function main() {
  const Game = await hre.ethers.getContractFactory("Game");
  const contract = await Game.deploy();

  await contract.deployed();

  console.log("Game deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
