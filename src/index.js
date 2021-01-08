import React from 'react'
import ReactDOM from 'react-dom'
import './styles/reset.css'
import './styles/root.css'
import App  from './components/App'
import { AuthContextProvider } from './context/AuthContext'

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
