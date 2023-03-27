// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {ethers} from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const bob = signers[2];
  const miniAddress = "0x2F5703804E29F4252FA9405B8D357220d11b3bd9"
  const miniToken = await ethers.getContractAt("MiniToken", miniAddress)
  const balance = await miniToken.balanceOf(bob.address)
  console.log(`Bob has now ${balance} tokens in ethereum`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
