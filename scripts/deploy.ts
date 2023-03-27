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

  const IBCHost = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCHost.sol:IBCHost", {
    libraries: {IBCIdentifier: ibcIdentifierDeployed.address},
  });
  const ibcHost = await IBCHost.deploy();
  const ibcHostDeployed = await ibcHost.deployed();

  const IBCClient = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCClient.sol:IBCClient")
  const ibcClient = await IBCClient.deploy();
  const ibcClientDeployed = await ibcClient.deployed();

  const IBCConnection = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCConnection.sol:IBCConnection", {libraries: {IBCClient: ibcClientDeployed.address}})
  const ibcConnection = await IBCConnection.deploy();
  const ibcConnectionDeployed = await ibcConnection.deployed();

  const IBCChannel = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCChannel.sol:IBCChannel", {
    libraries: {
      IBCClient: ibcClientDeployed.address,
      IBCConnection: ibcConnectionDeployed.address
    }
  });
  const ibcChannel = await IBCChannel.deploy();
  const ibcChannelDeployed = await ibcChannel.deployed();

  const IBCMsgs = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/IBCMsgs.sol:IBCMsgs")
  const ibcMsgs = await IBCMsgs.deploy();
  const ibcMsgsDeployed = await ibcMsgs.deployed();

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

  const MockClient = await ethers.getContractFactory("@hyperledger-labs/yui-ibc-solidity/contracts/core/MockClient.sol:MockClient");
  const mockClient = await MockClient.deploy();
  const mockClientDeployed = await mockClient.deployed();

  const MiniToken = await ethers.getContractFactory("MiniToken");
  const miniToken = await MiniToken.deploy(ibcHostDeployed.address, ibcHandlerDeployed.address);
  const miniTokenDeployed = await miniToken.deployed();

  await ibcHost.setIBCModule(ibcHandlerDeployed.address)
  await ibcHandler.bindPort(PortTransfer, miniTokenDeployed.address)
  await ibcHandler.registerClient(MockClientType, mockClientDeployed.address)

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
