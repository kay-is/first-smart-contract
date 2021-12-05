import { useEffect, useReducer, useState } from "preact/hooks"
import { html, useContract } from "./utils"

export function App() {
  const [newFundraiser, updateNewFundraiser] = useReducer(
    (prevState, action) => {
      if (action === "reset") return {}

      const { name, value } = action.target
      return { ...prevState, [name]: value }
    },
    {
      name: "Test Fundraiser",
      description: "This is a test fundraiser.",
      url: "https://example.com",
      imageUrl: "https://example.com/image.png",
      beneficiary: "70997970c51812dc3a010c7d01b50e0d17dc79c8",
    }
  )
  const [fundraisers, setFundraisers] = useState([])
  const [contract, setPermission] = useContract("read")

  async function loadFundraisers() {
    const fundraisers = await contract?.fundraisers(20, 0)
    setFundraisers(fundraisers ?? [])
  }

  useEffect(() => {
    loadFundraisers()
  }, [contract])

  async function addFundraiser(event) {
    event.preventDefault()

    const { name, description, url, imageUrl, beneficiary } = newFundraiser
    await contract.createFundraiser(
      name,
      description,
      url,
      imageUrl,
      beneficiary
    )

    updateNewFundraiser("reset")
    loadFundraisers()
  }

  return html`
    <div>
      <h1>Fundraisers</h1>

      <h2>Connected Accounts: ${contract?.signer}</h2>

      ${!contract?.signer
        ? html`<button onClick=${() => setPermission("write")}>
            Connect Wallet
          </button>`
        : html`<form onChange=${updateNewFundraiser} onSubmit=${addFundraiser}>
            <h2>Create New Fundraiser</h2>
            <input
              name="name"
              placeholder="Name"
              value=${newFundraiser.name ?? ""}
            />
            <input
              name="description"
              placeholder="Description"
              value=${newFundraiser.description ?? ""}
            />
            <input
              name="url"
              placeholder="URL"
              value=${newFundraiser.url ?? ""}
            />
            <input
              name="imageUrl"
              placeholder="Image URL"
              value=${newFundraiser.imageUrl ?? ""}
            />
            <input
              name="beneficiary"
              placeholder="Beneficiary Address"
              value=${newFundraiser.beneficiary ?? ""}
            />
            <input type="submit" />
          </form>`}

      <div>
        ${fundraisers.map(
          (fundraiser) => html`
            <div>
              <a href=${fundraiser.url}>
                <h2>${fundraiser.name}</h2>
              </a>
              <h3>Beneficiary: ${fundraiser.beneficiary}</h3>
              <img src=${fundraiser.imageUrl} />
              <p>${fundraiser.description}</p>
            </div>
          `
        )}
      </div>
    </div>
  `
}
