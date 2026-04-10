import { useState } from 'react'

function detectPlatform() {
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua)
  const isIOSSafari = isIOS && !/(CriOS|FxiOS|OPiOS|mercury)/i.test(ua)
  return { isIOS, isIOSSafari }
}

function Feature({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(0,122,255,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{label}</span>
    </div>
  )
}

export default function LandingPage({ deferredPrompt }) {
  const [busy, setBusy] = useState(false)
  const { isIOS, isIOSSafari } = detectPlatform()

  async function handleAndroid() {
    if (!deferredPrompt) return
    setBusy(true)
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setBusy(false)
  }

  async function handleIOSShare() {
    setBusy(true)
    try {
      await navigator.share({
        title: 'PWA Test',
        text: 'Installe l\'app sur ton écran d\'accueil',
        url: window.location.href,
      })
    } catch {
      // annulé ou non supporté
    }
    setBusy(false)
  }

  function renderCTA() {
    if (deferredPrompt) {
      return (
        <button className="btn-primary" onClick={handleAndroid} disabled={busy}>
          {busy ? 'Installation…' : '📲 Installer l\'app'}
        </button>
      )
    }

    if (isIOSSafari) {
      return (
        <>
          <button className="btn-primary" onClick={handleIOSShare} disabled={busy}>
            {busy ? 'Ouverture…' : '⬆️ Ajouter à l\'écran d\'accueil'}
          </button>
          <p style={{
            fontSize: 12, color: 'var(--color-text-secondary)',
            textAlign: 'center', marginTop: 10, lineHeight: 1.5,
          }}>
            La feuille de partage va s'ouvrir — sélectionne{' '}
            <strong style={{ color: 'var(--color-text)' }}>"Sur l'écran d'accueil"</strong>
          </p>
        </>
      )
    }

    if (isIOS) {
      return (
        <div style={{
          background: '#fff3cd', border: '1px solid #ffc107',
          borderRadius: 'var(--radius-card)', padding: '14px 16px',
          fontSize: 13, lineHeight: 1.6, textAlign: 'center',
        }}>
          Ouvre cette page dans <strong>Safari</strong> pour pouvoir l'installer.
        </div>
      )
    }

    return (
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'center', lineHeight: 1.6 }}>
        Ouvre cette page sur iPhone ou Android pour installer l'app.
      </p>
    )
  }

  return (
    <div style={{
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      paddingTop: 'max(32px, env(safe-area-inset-top))',
      paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
      background: 'var(--color-bg)',
    }}>
      {/* Icône */}
      <div style={{
        width: 100, height: 100,
        borderRadius: 24,
        background: 'linear-gradient(135deg, #007AFF 0%, #0055d4 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 50,
        marginBottom: 24,
        boxShadow: '0 12px 40px rgba(0,122,255,0.35)',
      }}>
        🗺️
      </div>

      {/* Titre */}
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
        PWA Test
      </h1>
      <p style={{
        fontSize: 15, color: 'var(--color-text-secondary)',
        textAlign: 'center', marginBottom: 32, lineHeight: 1.5,
      }}>
        L'expérience native dans ton navigateur
      </p>

      {/* Features */}
      <div style={{
        width: '100%', maxWidth: 300,
        marginBottom: 36,
        borderTop: '1px solid var(--color-separator)',
        borderBottom: '1px solid var(--color-separator)',
        padding: '4px 0',
      }}>
        <Feature icon="🗺️" label="Carte GPS en temps réel" />
        <Feature icon="🔔" label="Notifications push" />
        <Feature icon="📱" label="Interface native iOS & Android" />
      </div>

      {/* CTA */}
      <div style={{ width: '100%', maxWidth: 320 }}>
        {renderCTA()}
      </div>
    </div>
  )
}
