import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import './styles/globals.css'

const savedTheme = localStorage.getItem('fotogest-theme') || 'dark'
document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
