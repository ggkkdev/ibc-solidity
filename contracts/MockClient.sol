// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@hyperledger-labs/yui-ibc-solidity/contracts/core/MockClient.sol" as MockClient2;

contract MockClient is MockClient2.MockClient {

    constructor()  public MockClient2.MockClient() {
    }
}
