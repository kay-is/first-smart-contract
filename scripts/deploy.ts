import fs from "fs"
import { ethers } from "hardhat"

const CONTRACT_NAME = "FundraiserFactory"
async function main() {
  const FundraiserFactoryFactory = await ethers.getContractFactory(
    CONTRACT_NAME
  )
  const fundraiserFactory = await FundraiserFactoryFactory.deploy()

  await fundraiserFactory.deployed()

  console.log(process.cwd())

  fs.writeFileSync(
    "client/src/contracts/deployment.json",
    JSON.stringify({ [CONTRACT_NAME]: fundraiserFactory.address })
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
