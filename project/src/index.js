import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import 'primeflex/primeflex.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <Router>
            <App />
        </Router>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
)

reportWebVitals()
