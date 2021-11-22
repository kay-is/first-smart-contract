/* eslint-disable no-unused-expressions */
import { expect } from "chai"
import { ethers as ethersTypes } from "ethers"
import { ethers } from "hardhat"
// eslint-disable-next-line node/no-missing-import
import { FundraiserFactory } from "../typechain"

describe("FundraiserFactory contract", () => {
  let fundraiserFactory: FundraiserFactory
  const name = "Beneficiary Name"
  const url = "beneficiaryname.org"
  const imageUrl = "https://placekitten.com/600/350"
  const description = "Beneficiary description"

  let beneficiary: ethersTypes.Signer
  let owner: ethersTypes.Signer

  async function createFundraiserFactory(fundraiserCount: number) {
    const FundraiserFactoryContract = await ethers.getContractFactory(
      "FundraiserFactory"
    )
    const factory = await FundraiserFactoryContract.connect(owner).deploy()

    await addFundraisers(factory, fundraiserCount)

    return factory
  }

  async function addFundraisers(factory: FundraiserFactory, count: number) {
    const name = "Beneficiary"
    const lowerCaseName = name.toLowerCase()

    const beneficiaryAddress = await beneficiary.getAddress()
    for (let i = 0; i < count; ++i) {
      await factory.createFundraiser(
        `${name} ${i}`,
        `${lowerCaseName}.com`,
        `${lowerCaseName}.png`,
        `Description for ${name} ${i}`,
        beneficiaryAddress
      )
    }
  }

  describe("creating a fundraiser", () => {
    beforeEach(async () => {
      ;[beneficiary, owner] = await ethers.getSigners()

      const FundraiserFactoryContract = await ethers.getContractFactory(
        "FundraiserFactory"
      )
      fundraiserFactory = await FundraiserFactoryContract.connect(
        owner
      ).deploy()
    })

    it("increments the fundraisersCount", async () => {
      const oldFundraisersCount = await fundraiserFactory.fundraisersCount()

      await fundraiserFactory.createFundraiser(
        name,
        url,
        imageUrl,
        description,
        await beneficiary.getAddress()
      )

      const newFundraisersCount = await fundraiserFactory.fundraisersCount()

      expect(newFundraisersCount.sub(oldFundraisersCount)).to.equal(
        1,
        "should increment by 1"
      )
    })
  })

  describe("when fundraisers collection is empty", () => {
    it("returns an empty collection", async () => {
      const factory = await createFundraiserFactory(0)
      const fundraisers = await factory.fundraisers(10, 0)
      expect(fundraisers.length).to.equal(0, "collection should be empty")
    })
  })

  describe("varying limits", () => {
    let factory: FundraiserFactory
    beforeEach(async () => {
      factory = await createFundraiserFactory(30)
    })

    it("returns 10 results when the limit was set to 10", async () => {
      const fundraisers = await factory.fundraisers(10, 0)
      expect(fundraisers.length).to.equal(
        10,
        "collection should have 10 entries"
      )
    })

    it("returns 20 results when the limit was set to 20", async () => {
      const fundraisers = await factory.fundraisers(20, 0)
      expect(fundraisers.length).to.equal(
        20,
        "collection should have 20 entries"
      )
    })

    it("returns 20 results when the limit was set to 30", async () => {
      const fundraisers = await factory.fundraisers(30, 0)
      expect(fundraisers.length).to.equal(
        20,
        "collection should have 20 entries"
      )
    })
  })

  describe("boundary conditions", () => {
    let factory: FundraiserFactory
    beforeEach(async () => {
      factory = await createFundraiserFactory(10)
    })

    it("raises out of bounds error", async () => {
      await expect(factory.fundraisers(1, 11)).to.be.revertedWith(
        "offset out of bounds"
      )
    })
    it("adjusts return size to prevent out of bounds error", async () => {
      const fundraisers = await factory.fundraisers(10, 5)
      expect(fundraisers.length).to.equal(5, "collection adjusted")
    })
  })
})
