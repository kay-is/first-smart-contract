import { html, useContract } from "./utils"
import { Link } from "preact-router"
import { useEffect, useState } from "preact/hooks"

export const Overview = () => {
  const [contract] = useContract("read")
  const [fundraisers, setFundraisers] = useState([])

  useEffect(() => {
    contract?.fundraisers(20, 0).then(setFundraisers)
  })

  let fundraisersList = html`<h2>No Fundraisers Available</h2>`

  if (fundraisers.length > 0)
    fundraisersList = html`<ul>
      ${fundraisers.map((f) => html`<li>${f.name}</li>`)}
    </ul>`

  return html`<div>
    <h1>Overview</h1>
    <nav>
      <${Link} href="/">Overview<//>
      ${" | "}
      <${Link} href="/create">Create Fundraiser<//>
    </nav>
    ${fundraisersList}
  </div>`
}
