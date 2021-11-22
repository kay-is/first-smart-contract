//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Fundraiser.sol";

contract FundraiserFactory {
    uint256 private maxLimit = 20;
    Fundraiser[] private allFundraisers;

    function createFundraiser(
        string memory name,
        string memory url,
        string memory imageUrl,
        string memory description,
        address payable beneficiary
    ) public {
        Fundraiser newFundraiser = new Fundraiser(
            name,
            url,
            imageUrl,
            description,
            beneficiary
        );
        allFundraisers.push(newFundraiser);
    }

    function fundraisersCount() public view returns (uint256) {
        return allFundraisers.length;
    }

    function fundraisers(uint256 limit, uint256 offset)
        public
        view
        returns (Fundraiser[] memory selection)
    {
        require(offset <= fundraisersCount(), "offset out of bounds");

        uint256 size = fundraisersCount() - offset;
        size = size < limit ? size : limit;
        size = size < maxLimit ? size : maxLimit;

        selection = new Fundraiser[](size);

        for (uint256 i = 0; i < size; i++) {
            selection[i] = allFundraisers[offset + i];
        }

        return selection;
    }
}
