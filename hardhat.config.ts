import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const mnemonic =
  "light rack gadget caution hedgehog aerobic moon solution reward butter height rent";
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    besu: {
      url: process.env.BESU_URL || "",
      accounts: {
        mnemonic: mnemonic,
      },
    },
    local: {
      url: "http://127.0.0.1:8545/",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
    besu_quorum: {
      url: "http://127.0.0.1:8545/",
      gas: 1000000,
      accounts: {
        mnemonic: mnemonic,
      },
    },
    ibc0: {
      url: "http://127.0.0.1:8645/",
      gas: 1000000000,
      allowUnlimitedContractSize: true,
      accounts: {
        mnemonic: mnemonic,
        initialIndex: 0,
        count: 20,
      },
    },
    ibc1: {
      url: "http://127.0.0.1:8745/",
      allowUnlimitedContractSize: true,
      gas: 10000000,
      accounts: {
        mnemonic: mnemonic,
        initialIndex: 0,
        count: 20,
      },
    },
    goerli: {
      url: "https://goerli.infura.io/v3/07b7cb0381184896bd21b62150ae6d7c",
      accounts: {
        mnemonic,
        initialIndex: 0,
        count: 20,
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
