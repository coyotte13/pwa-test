import React from 'react'
import ReactDOM from 'react-dom/client'
import './onesignal' // déclenche l'init OneSignal dès le démarrage
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
