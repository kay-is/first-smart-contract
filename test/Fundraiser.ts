/* eslint-disable no-unused-expressions */
import { expect } from "chai"
import { ethers as ethersTypes } from "ethers"
import { ethers } from "hardhat"
// eslint-disable-next-line node/no-missing-import
import { Fundraiser } from "../typechain"

describe("Fundraiser contract", () => {
  let fundraiser: Fundraiser
  const name = "Beneficiary Name"
  const url = "beneficiaryname.org"
  const imageUrl = "https://placekitten.com/600/350"
  const description = "Beneficiary description"

  let beneficiary: ethersTypes.Signer
  let owner: ethersTypes.Signer
  let donor: ethersTypes.Signer

  beforeEach(async () => {
    ;[beneficiary, owner, donor] = await ethers.getSigners()

    const FundraiserContract = await ethers.getContractFactory("Fundraiser")
    fundraiser = await FundraiserContract.connect(owner).deploy(
      name,
      url,
      imageUrl,
      description,
      await beneficiary.getAddress()
    )
  })

  describe("initialization", () => {
    it("gets the beneficiary name", async () => {
      const actual = await fundraiser.name()
      expect(actual).to.equal(name, "names should match")
    })

    it("gets the beneficiary URL", async () => {
      const actual = await fundraiser.url()
      expect(actual).to.equal(url, "urls should match")
    })

    it("gets the beneficiary image URL", async () => {
      const actual = await fundraiser.imageUrl()
      expect(actual).to.equal(imageUrl, "image URLs should match")
    })

    it("gets the beneficiary description", async () => {
      const actual = await fundraiser.description()
      expect(actual).to.equal(description, "descriptions should match")
    })

    it("gets the beneficiary ", async () => {
      const actual = await fundraiser.beneficiary()
      expect(actual).to.equal(
        await beneficiary.getAddress(),
        "beneficiary addresses should match"
      )
    })

    it("gets the owner", async () => {
      const actual = await fundraiser.owner()
      expect(actual).to.equal(
        await owner.getAddress(),
        "owner addresses should match"
      )
    })

    it("lets the owner set a new beneficiary", async () => {
      const newBeneficiary = donor
      const newBeneficiaryAddress = await newBeneficiary.getAddress()

      await fundraiser.setBeneficiary(newBeneficiaryAddress)

      const actual = await fundraiser.beneficiary()
      expect(actual).to.equal(newBeneficiaryAddress)
    })

    it("forbids non-owners to set a new beneficiary", async () => {
      const newBeneficiary = donor
      const newBeneficiaryAddress = await newBeneficiary.getAddress()

      await expect(
        fundraiser.connect(beneficiary).setBeneficiary(newBeneficiaryAddress)
      ).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })
  describe("making donations", async () => {
    const value = ethers.utils.parseEther("0.0289")

    it("increases myDonationsCount", async () => {
      const donorConnection = fundraiser.connect(donor)

      const oldDonationCount = await donorConnection.myDonationsCount()
      await donorConnection.donate({ value })
      const newDonationCount = await donorConnection.myDonationsCount()

      expect(newDonationCount.sub(oldDonationCount)).to.equal(1)
    })

    it("includes donation in myDonations", async () => {
      const donorConnection = fundraiser.connect(donor)
      await donorConnection.donate({ value })

      const [values, dates] = await donorConnection.myDonations()

      expect(values[0]).to.equal(value, "donation values should match")
      expect(dates[0]).to.exist
    })

    it("increases the totalDonations amount", async () => {
      const oldTotalDonations = await fundraiser.totalDonations()
      await fundraiser.connect(donor).donate({ value })
      const newTotalDonations = await fundraiser.totalDonations()

      expect(newTotalDonations.sub(oldTotalDonations)).to.equal(
        value,
        "difference should match the donaion value"
      )
    })

    it("increases donationsCount", async () => {
      const oldDonationsCount = await fundraiser.donationsCount()
      await fundraiser.connect(donor).donate({ value })
      const newDonationsCount = await fundraiser.donationsCount()

      expect(newDonationsCount.sub(oldDonationsCount)).to.equal(
        1,
        "donationsCount should increment by 1"
      )
    })

    it("emits the DonationReceived event", async () => {
      const donorAddress = await donor.getAddress()

      await expect(fundraiser.connect(donor).donate({ value }))
        .to.emit(fundraiser, "DonationReceived")
        .withArgs(donorAddress, value)
    })
  })

  describe("fallback function", () => {
    const value = ethers.utils.parseEther("0.1")

    it("increases the totalDonations amount", async () => {
      const oldTotalDonations = await fundraiser.totalDonations()

      await donor.sendTransaction({ to: fundraiser.address, value })

      const newTotalDonations = await fundraiser.totalDonations()

      expect(newTotalDonations.sub(oldTotalDonations)).to.equal(
        value,
        "difference should match donation value"
      )
    })

    it("increases donationsCount", async () => {
      const oldDonationsCount = await fundraiser.donationsCount()

      await donor.sendTransaction({ to: fundraiser.address, value })

      const newDonationsCount = await fundraiser.donationsCount()

      expect(newDonationsCount.sub(oldDonationsCount)).to.equal(
        1,
        "donationsCount should increment by 1"
      )
    })
  })

  describe("withdrawing funds", () => {
    beforeEach(async () => {
      const value = ethers.utils.parseEther("0.1")
      await fundraiser.connect(donor).donate({ value })
    })

    describe("access controls", () => {
      it("throws an error when called from a non-owner account", async () => {
        await expect(fundraiser.connect(donor).withdraw()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        )
      })

      it("permits the owner to call the function", async () => {
        await expect(fundraiser.withdraw()).not.to.be.reverted
      })
    })
  })
})
