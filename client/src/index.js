import { render } from "preact"
import { html } from "./utils"
import { App } from "./App"

render(html`<${App} />`, document.body)
