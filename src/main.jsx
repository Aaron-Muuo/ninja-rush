import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log("%c Built by Muuo Creatives | View more at muuocreatives.co.ke", "background: #222; color: #bada55; font-size: 14px;");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
