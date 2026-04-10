import React from 'react'
import ReactDOM from 'react-dom/client'
import OneSignal from 'react-onesignal'
import App from './App'
import './styles/globals.css'

OneSignal.init({
  appId: '35189144-5872-41d0-91bb-f3e8197ffb7d',
  notifyButton: { enable: false },
  allowLocalhostAsSecureOrigin: true,
}).catch(console.error)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
