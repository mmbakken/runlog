import React from 'react'
import ReactDOM from 'react-dom'
import './styles/root.css'
import App from './components/App'
import { AuthContextProvider } from './context/AuthContext'
import { StateContextProvider } from './context/StateContext'

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
