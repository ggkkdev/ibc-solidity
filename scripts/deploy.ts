// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {ethers} from "hardhat";

const MockClientType = "mock-client"
const PortTransfer = "transfer"

async function main() {

  const IBCIdentifier = await ethers.getContractFactory(
    "@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCIdentifier.sol:IBCIdentifier"
  );
  const ibcIdentifier = await IBCIdentifier.deploy();
  const ibcIdentifierDeployed = await ibcIdentifier.deployed();

  console.log("ibcIdentifier "+ibcIdentifierDeployed.address)
  const IBCHost = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCHost.sol:IBCHost", {
    libraries: {IBCIdentifier: ibcIdentifierDeployed.address},
  });
  const ibcHost = await IBCHost.deploy();
  const ibcHostDeployed = await ibcHost.deployed();
  console.log("ibcHost "+ibcHostDeployed.address)

  const IBCClient = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCClient.sol:IBCClient")
  const ibcClient = await IBCClient.deploy();
  const ibcClientDeployed = await ibcClient.deployed();
  console.log("2")

  const IBCConnection = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCConnection.sol:IBCConnection", {libraries: {IBCClient: ibcClientDeployed.address}})
  const ibcConnection = await IBCConnection.deploy();
  const ibcConnectionDeployed = await ibcConnection.deployed();
  console.log("3")

  const IBCChannel = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCChannel.sol:IBCChannel", {
    libraries: {
      IBCClient: ibcClientDeployed.address,
      IBCConnection: ibcConnectionDeployed.address
    }
  });
  const ibcChannel = await IBCChannel.deploy();
  const ibcChannelDeployed = await ibcChannel.deployed();
  console.log("4")

  const IBCMsgs = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCMsgs.sol:IBCMsgs")
  const ibcMsgs = await IBCMsgs.deploy();
  const ibcMsgsDeployed = await ibcMsgs.deployed();
  console.log("5")

  const IBCHandler = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCHandler.sol:IBCHandler",
    {
      libraries: {
        IBCChannel: ibcChannelDeployed.address,
        IBCClient: ibcClientDeployed.address,
        IBCConnection: ibcConnectionDeployed.address,
        IBCIdentifier: ibcIdentifierDeployed.address,
      }
    });
  const ibcHandler = await IBCHandler.deploy(ibcHostDeployed.address);
  const ibcHandlerDeployed = await ibcHandler.deployed();
  console.log("6")

  const MockClient = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/MockClient.sol:MockClient");
  const mockClient = await MockClient.deploy();
  const mockClientDeployed = await mockClient.deployed();
  console.log("7")

  const MiniToken = await ethers.getContractFactory("MiniToken");
  const miniToken = await MiniToken.deploy(ibcHostDeployed.address, ibcHandlerDeployed.address);
  const miniTokenDeployed = await miniToken.deployed();
  console.log("8")

  await ibcHost.setIBCModule(ibcHandlerDeployed.address)
  await ibcHandler.bindPort(PortTransfer, miniTokenDeployed.address)
  await ibcHandler.registerClient(MockClientType, mockClientDeployed.address)
  console.log("9")

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
