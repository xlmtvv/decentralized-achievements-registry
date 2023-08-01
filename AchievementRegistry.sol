// AchievementRegistry.sol
// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.19;

contract AchievementRegistry {

    struct Achievement {
        string achievementType;
        string description;
        uint256 date;
        address owner;
    }

    mapping(address => Achievement[]) public achievements;

    function addAchievement(string memory _achievementType, string memory _description, uint256 _date) public {
        achievements[msg.sender].push(Achievement(_achievementType, _description, _date, msg.sender));
    }

    function getAchievementCount() public view returns (uint) {
        return achievements[msg.sender].length;
    }

    function getAchievementByIndex(uint index) public view returns (string memory, string memory, uint256, address) {
        require(index < achievements[msg.sender].length, "Invalid index");
        Achievement memory achievement = achievements[msg.sender][index];
        return (achievement.achievementType, achievement.description, achievement.date, achievement.owner);
    }
}



