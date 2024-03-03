import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthContextProvider } from 'app/context/AuthContext'
import { StateContextProvider } from 'app/context/StateContext'
import App from 'app/App.tsx'
import 'styles/root.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
