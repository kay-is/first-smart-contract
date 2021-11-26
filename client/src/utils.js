import { ethers } from "ethers"
import htm from "htm"
import { h } from "preact"

import contractAddresses from "./contracts/deployment.json"

export const html = htm.bind(h)

export async function connectContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any")

  await provider.send("eth_requestAccounts", [])

  const signer = provider.getSigner()

  const contractAbi = [
    "function createFundraiser(string memory name, string memory url, string memory imageUrl, string memory description, address payable beneficiary) public",
    "function fundraisersCount() public view returns (uint256)",
    "function fundraisers(uint256 limit, uint256 offset) public view returns (Fundraiser[] memory selection)",
  ]

  return new ethers.Contract(
    contractAddresses.FundraiserFactory,
    contractAbi,
    signer
  )
}
