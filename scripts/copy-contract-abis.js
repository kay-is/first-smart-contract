require("fs-extra").copySync(
  "artifacts/contracts/FundraiserFactory.sol/FundraiserFactory.json",
  "client/src/contracts/FundraiserFactory.json"
)
console.log("Copied contract ABIs to client/src/contracts")
