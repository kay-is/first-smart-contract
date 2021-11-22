//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    struct Donation {
        uint256 value;
        uint256 date;
        //uint256 conversionFactor;
    }

    event DonationReceived(address indexed donor, uint256 value);
    event Withdraw(uint256 amount);

    mapping(address => Donation[]) private donations;

    uint256 public totalDonations;
    uint256 public donationsCount;

    string public name;
    string public url;
    string public imageUrl;
    string public description;

    address payable public beneficiary;

    constructor(
        string memory _name,
        string memory _url,
        string memory _imageUrl,
        string memory _description,
        address payable _beneficiary
    ) {
        name = _name;
        url = _url;
        imageUrl = _imageUrl;
        description = _description;
        beneficiary = _beneficiary;
    }

    receive() external payable {
        totalDonations += msg.value;
        donationsCount++;
    }

    function setBeneficiary(address payable newBeneficiary) public onlyOwner {
        beneficiary = newBeneficiary;
    }

    function myDonationsCount() public view returns (uint256) {
        return donations[msg.sender].length;
    }

    function donate() public payable {
        Donation memory donation = Donation({
            value: msg.value,
            date: block.timestamp
        });

        donations[msg.sender].push(donation);

        totalDonations += msg.value;
        donationsCount++;

        emit DonationReceived(msg.sender, msg.value);
    }

    function myDonations()
        public
        view
        returns (uint256[] memory values, uint256[] memory dates)
    {
        uint256 count = myDonationsCount();
        values = new uint256[](count);
        dates = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Donation storage donation = donations[msg.sender][i];
            values[i] = donation.value;
            dates[i] = donation.date;
        }

        return (values, dates);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        beneficiary.transfer(balance);
        emit Withdraw(balance);
    }
}
