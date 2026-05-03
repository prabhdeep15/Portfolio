import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/** Set favicon URL for dev + static hosts (`base` may be `./` on GitHub Pages). */
function syncPublicFavicon() {
  const rawBase = import.meta.env.BASE_URL
  const href =
    rawBase === "./"
      ? "./favicon.svg?v=1"
      : `${rawBase.endsWith("/") ? rawBase : `${rawBase}/`}favicon.svg?v=1`

  let icon = document.querySelector('link[rel="icon"][type="image/svg+xml"]')
  if (!icon) {
    icon = document.createElement("link")
    icon.rel = "icon"
    icon.type = "image/svg+xml"
    icon.setAttribute("sizes", "any")
    document.head.prepend(icon)
  }
  icon.href = href

  let apple = document.querySelector('link[rel="apple-touch-icon"]')
  if (!apple) {
    apple = document.createElement("link")
    apple.rel = "apple-touch-icon"
    document.head.appendChild(apple)
  }
  apple.href = href
}

syncPublicFavicon()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
