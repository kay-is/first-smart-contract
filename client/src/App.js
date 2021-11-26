import { useState } from "preact/hooks"
import { connectContract, html } from "./utils"

export function App() {
  const [contract, setContract] = useState(null)
  const connectWallet = () => connectContract().then(setContract)

  const [fundraisersCount, setFundraisersCount] = useState(0)
  const getFundraisersCount = () =>
    contract.fundraisersCount().then((n) => setFundraisersCount(n.toString()))

  return html`
    <div>
      <h1>Fundraisers</h1>
      <button onClick=${connectWallet}>Connect Wallet</button>
      ${contract
        ? html`<button onClick=${getFundraisersCount}>
            Get FundraisersCount
          </button>`
        : html`<p>Please connect your wallet!</p>`}
      ${fundraisersCount
        ? html`<p>Number of fundraisers: ${fundraisersCount}</p>`
        : null}
    </div>
  `
}
