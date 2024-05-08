// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract Leaderboard is AccessControl {
    mapping(string => uint256) public leaderboard;

    function updateLeaderboard(string memory uuid, uint256 score) public {
        leaderboard[uuid] = score;
    }

    function getScore(string memory uuid) public view returns (uint256) {
        return leaderboard[uuid];
    }
}
