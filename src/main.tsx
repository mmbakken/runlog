import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthContextProvider } from 'app/context/AuthContext'
import { StateContextProvider } from 'app/context/StateContext'
import App from 'app/App.tsx'
import 'styles/root.css'

import { store } from 'app/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <StateContextProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </StateContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)
