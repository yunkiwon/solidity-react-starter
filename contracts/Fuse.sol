//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Fuse {

  string greeting;

  struct Profile {
    string githubUsername;
    string mediumUsername;
    bool isSet;
  }

  mapping (address => Profile) public profiles;
  address[] public registeredAccounts;

  constructor(string memory _greeting) {
    console.log("Deploying a contract");
    greeting = _greeting;
  }

  function getUserGithub(address ins) view public returns (string memory) {
    return profiles[ins].githubUsername;
  }

  function setUserProfileGithub(address _address, string memory _github) public {
    require(msg.sender == _address, "ERR: Stop trying to modify someone else's profile!");
    Profile storage profile = profiles[_address];
    if(!profile.isSet){
      registeredAccounts.push(_address);
      profile.isSet = true;
    }
    profile.githubUsername = _github;
  }

  function getRegisteredAccounts() view public returns(address[] memory) {
    return registeredAccounts;
  }
}
