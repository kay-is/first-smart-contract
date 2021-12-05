import { Link, route } from "preact-router"
import { useEffect, useReducer, useState } from "preact/hooks"
import { html, useContract } from "./utils"

export const CreateFundraiser = () => {
  const fundraiserTemplate = {
    name: "Fundraiser " + Math.random(),
    description: "My fundraiser.",
    url: "https://example.com/fundraiser",
    imageUrl: "https://example.com/fundraiser/cover_image.jpg",
    beneficiary: "fabb0ac9d68b0b445fb7357272ff202c5651694a",
  }

  const [connectedAddress, setConnectedAddress] = useState("0x0")
  const [contract, setPermission] = useContract("read")

  const [newFundraiser, dispatch] = useReducer(
    (newFundraiser, action) => {
      if (action === "reset") return { ...fundraiserTemplate }

      const { name, value } = action.target
      return { ...newFundraiser, [name]: value }
    },
    { ...fundraiserTemplate }
  )

  useEffect(() => {
    contract?.signer?.getAddress().then(setConnectedAddress)
  }, [contract])

  async function create() {
    const { name, url, imageUrl, description, beneficiary } = newFundraiser

    await contract.createFundraiser(
      name,
      url,
      imageUrl,
      description,
      beneficiary
    )
  }

  let content = html` <button onClick=${() => setPermission("write")}>
    Connect Wallet
  </button>`

  if (contract?.signer)
    content = html`<form onChange=${dispatch} onSubmit=${create}>
      <label
        >Name
        <input name="name" value=${newFundraiser.name} />
      </label>
      <label
        >Description
        <input name="description" value=${newFundraiser.description} />
      </label>
      <label
        >URL
        <input name="url" value=${newFundraiser.url} />
      </label>
      <label
        >Image URL
        <input name="imageUrl" value=${newFundraiser.imageUrl} />
      </label>
      <label
        >Beneficiary
        <input name="beneficiary" value=${newFundraiser.beneficiary} />
      </label>
      <input type="submit" />
      <input type="reset" />
    </form>`

  return html`<div>
    <h1>CreateFundraiser</h1>
    <p>Connected Address: ${connectedAddress}</p>
    <nav>
      <${Link} href="/">Overview<//>
      ${" | "}
      <${Link} href="/create">Create Fundraiser<//>
    </nav>

    ${content}
  </div>`
}
