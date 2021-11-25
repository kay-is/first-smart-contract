import { ethers } from "hardhat"

async function main() {
  const FundraiserFactoryFactory = await ethers.getContractFactory(
    "FundraiserFactory"
  )
  const fundraiserFactory = await FundraiserFactoryFactory.deploy()

  await fundraiserFactory.deployed()

  console.log("FundraiserFactory deployed to:", fundraiserFactory.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
