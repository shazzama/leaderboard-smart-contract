// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract Leaderboard is AccessControl {
    bytes32 public constant TRUSTED_UPDATER_ROLE =
        keccak256("leaderboard.updater");

    mapping(string => uint256) public leaderboard;
    string[] public uuids;

    constructor(address trustedUpdater) {
        _grantRole(TRUSTED_UPDATER_ROLE, trustedUpdater);
    }

    function updateLeaderboard(
        string memory uuid,
        uint256 score
    ) external onlyRole(TRUSTED_UPDATER_ROLE) {
        if (leaderboard[uuid] == 0) {
            leaderboard[uuid] = score;
            uuids.push(uuid);
        } else {
            leaderboard[uuid] = score;
        }
    }

    function getScore(string memory uuid) public view returns (uint256) {
        return leaderboard[uuid];
    }

    function getUuids() public view returns (string[] memory) {
        return uuids;
    }
}
