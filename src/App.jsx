import { useState } from 'react'
import TabBar from './components/TabBar'
import CartePage from './pages/CartePage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'

const TABS = [
  { id: 'carte', label: 'Carte', icon: '🗺️' },
  { id: 'notifs', label: 'Notifs', icon: '🔔' },
  { id: 'reglages', label: 'Réglages', icon: '⚙️' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('carte')
  const [notifications, setNotifications] = useState([])

  function addNotification(notif) {
    setNotifications(prev => [
      { ...notif, id: Date.now(), timestamp: new Date() },
      ...prev,
    ])
  }

  return (
    <>
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
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
