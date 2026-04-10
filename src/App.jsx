import { useState, useEffect } from 'react'
import TabBar from './components/TabBar'
import CartePage from './pages/CartePage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import LandingPage from './pages/LandingPage'

const TABS = [
  { id: 'carte', label: 'Carte', icon: '🗺️' },
  { id: 'notifs', label: 'Notifs', icon: '🔔' },
  { id: 'reglages', label: 'Réglages', icon: '⚙️' },
]

function isRunningStandalone() {
  return (
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('carte')
  const [notifications, setNotifications] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [standalone] = useState(isRunningStandalone)

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function addNotification(notif) {
    setNotifications(prev => [
      { ...notif, id: Date.now(), timestamp: new Date() },
      ...prev,
    ])
  }

  if (!standalone) {
    return <LandingPage deferredPrompt={deferredPrompt} />
  }

  return (
    <>
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'carte' && <CartePage />}
        {activeTab === 'notifs' && (
          <NotificationsPage
            notifications={notifications}
            addNotification={addNotification}
          />
        )}
        {activeTab === 'reglages' && <SettingsPage />}
      </main>
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}
