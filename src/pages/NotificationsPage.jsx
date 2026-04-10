import { useState } from 'react'
import OneSignal from 'react-onesignal'

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'à l\'instant'
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  return `il y a ${Math.floor(diff / 3600)} h`
}

const ICON_COLORS = {
  notif: '#007AFF',
  geo: '#34c759',
  system: '#ff9500',
}

function NotifItem({ notif }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        width: 38, height: 38,
        borderRadius: 10,
        background: ICON_COLORS[notif.type] || '#8e8e93',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        {notif.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{notif.title}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{notif.body}</div>
        <div style={{ fontSize: 11, color: '#c7c7cc', marginTop: 4 }}>{timeAgo(notif.timestamp)}</div>
      </div>
    </div>
  )
}

export default function NotificationsPage({ notifications, addNotification }) {
  const [sending, setSending] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  )

  async function requestPermission() {
    try {
      // iOS PWA : utiliser l'API native en priorité, OneSignal prend le relais
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setPermissionGranted(true)
        // Abonner le device à OneSignal après accord
        await OneSignal.Notifications.requestPermission()
      }
    } catch (err) {
      console.error('Permission error:', err)
      addNotification({
        type: 'system',
        icon: '⚠️',
        title: 'Erreur permission',
        body: err.message || 'Impossible de demander la permission',
      })
    }
  }

  async function sendTestNotification() {
    if (sending) return
    setSending(true)
    try {
      const response = await fetch('/.netlify/functions/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test notification 🔔',
          body: 'Ta PWA fonctionne parfaitement !',
        }),
      })
      if (!response.ok) throw new Error('Erreur serveur')
      addNotification({
        type: 'notif',
        icon: '🔔',
        title: 'Test notification',
        body: 'Envoyée via OneSignal avec succès',
      })
    } catch (err) {
      addNotification({
        type: 'system',
        icon: '⚠️',
        title: 'Erreur d\'envoi',
        body: err.message,
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">Notifications</div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        {!permissionGranted && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: 'var(--radius-card)',
            padding: '14px 16px',
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              🔔 Autoriser les notifications
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
              Nécessaire pour recevoir les push notifications
            </div>
            <button className="btn-primary" onClick={requestPermission}>
              Autoriser les notifications
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Aucune notification</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Appuie sur le bouton ci-dessous pour en envoyer une</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map(n => <NotifItem key={n.id} notif={n} />)}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 16px', paddingBottom: 'calc(12px + var(--safe-bottom))' }}>
        <button
          className="btn-primary"
          onClick={sendTestNotification}
          disabled={sending}
          style={{ opacity: sending ? 0.7 : 1 }}
        >
          {sending ? 'Envoi en cours…' : 'Envoyer une notif test 🔔'}
        </button>
      </div>
    </div>
  )
}
