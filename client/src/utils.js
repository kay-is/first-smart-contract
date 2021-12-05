import { ethers } from "ethers"
import htm from "htm"
import { h } from "preact"
import { useEffect, useState } from "preact/hooks"

import contractAddresses from "./contracts/deployment.json"

export const html = htm.bind(h)

const contractAbi = [
  "function createFundraiser(string memory name, string memory url, string memory imageUrl, string memory description, address payable beneficiary) public",
  "function fundraisersCount() public view returns (uint256)",
  "function fundraisers(uint256 limit, uint256 offset) public view returns (Fundraiser[] memory selection)",
]

const rpcUrl = "http://localhost:8545"
const chainId = 31337

export function useContract(initalPermission) {
  const [contract, setContract] = useState(null)
  const [permission, setPermission] = useState(initalPermission)

  useEffect(() => {
    async function effect() {
      if (permission === "read") {
        const contract = new ethers.Contract(
          contractAddresses.FundraiserFactory,
          contractAbi,
          new ethers.providers.JsonRpcProvider("http://localhost:8545", 31337)
        )
        return setContract(contract)
      }

      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        chainId
      )

      await provider.send("eth_requestAccounts", [])

      const contract = new ethers.Contract(
        contractAddresses.FundraiserFactory,
        contractAbi,
        provider.getSigner()
      )

      setContract(contract)
    }
    effect()
  }, [permission])

  return [contract, setPermission]
}
