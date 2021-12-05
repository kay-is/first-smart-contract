import { createHashHistory } from "history"
import { render } from "preact"
import Router from "preact-router"

import { html } from "./utils"
import { Overview } from "./Overview"
import { CreateFundraiser } from "./CreateFundraiser"

const Application = () =>
  html`
    <${Router} history=${createHashHistory()}>
      <${Overview} path="/" />
      <${CreateFundraiser} path="/create" />
    <//>
  `

render(html`<${Application} />`, document.body)
