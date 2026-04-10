import { useState, useEffect } from 'react'

function PermRow({ icon, color, label, status, statusColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 14px',
      borderBottom: '1px solid var(--color-separator)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 14 }}>{label}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: statusColor }}>
        {status}
      </span>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      padding: '16px 4px 6px',
    }}>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [geoStatus, setGeoStatus] = useState('Vérification…')
  const [notifStatus, setNotifStatus] = useState('Vérification…')
  const [swStatus, setSwStatus] = useState('Inactif')
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Géolocalisation
    if (!navigator.geolocation) {
      setGeoStatus('Non supporté')
    } else {
      navigator.permissions?.query({ name: 'geolocation' }).then(result => {
        const map = { granted: 'Autorisé', denied: 'Refusé', prompt: 'Non demandé' }
        setGeoStatus(map[result.state] || 'Inconnu')
      }).catch(() => setGeoStatus('Disponible'))
    }

    // Notifications
    if (!('Notification' in window)) {
      setNotifStatus('Non supporté')
    } else {
      const map = { granted: 'Autorisé', denied: 'Refusé', default: 'Non demandé' }
      setNotifStatus(map[Notification.permission] || 'Inconnu')
    }

    // Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        setSwStatus(reg?.active ? 'Actif ✓' : 'Inactif')
      })
    }

    // Install prompt (Android/desktop)
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)

    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setInstalled(true)
      setDeferredPrompt(null)
    }
  }

  const statusColor = (s) => {
    if (s === 'Autorisé' || s.startsWith('Actif')) return 'var(--color-success)'
    if (s === 'Refusé') return 'var(--color-danger)'
    return 'var(--color-text-secondary)'
  }

  return (
    <div className="page">
      <div className="page-header">Réglages</div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        <SectionLabel>Permissions</SectionLabel>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <PermRow icon="📍" color="var(--color-primary)" label="Localisation" status={geoStatus} statusColor={statusColor(geoStatus)} />
          <PermRow icon="🔔" color="var(--color-danger)" label="Notifications" status={notifStatus} statusColor={statusColor(notifStatus)} />
        </div>

        <SectionLabel>Application</SectionLabel>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <PermRow icon="⚡" color="#5856d6" label="Mode offline" status={swStatus} statusColor={statusColor(swStatus)} />
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#ff9500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>ℹ️</div>
              <span style={{ fontSize: 14 }}>Version</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>1.0.0</span>
          </div>
        </div>

        <SectionLabel>Installation</SectionLabel>
        {installed ? (
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-card)',
            padding: '16px', textAlign: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>App installée</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              Mode standalone actif
            </div>
          </div>
        ) : deferredPrompt ? (
          <button className="btn-primary" onClick={handleInstall}>
            📲 Installer sur l'écran d'accueil
          </button>
        ) : (
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-card)',
            padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>📲 Installer sur iPhone</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              1. Ouvre cette page dans <strong>Safari</strong><br />
              2. Appuie sur le bouton <strong>Partager</strong> ⬆️<br />
              3. Sélectionne <strong>"Sur l'écran d'accueil"</strong>
            </div>
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>
    </div>
  )
}
