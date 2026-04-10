import { useGeolocation } from '../hooks/useGeolocation'

function formatCoord(val, pos, neg) {
  if (val == null) return '—'
  return `${Math.abs(val).toFixed(4)}° ${val >= 0 ? pos : neg}`
}

function accuracyColor(accuracy) {
  if (accuracy <= 10) return 'var(--color-success)'
  if (accuracy <= 50) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

export default function CartePage() {
  const { position, error, loading } = useGeolocation()

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">Carte</div>

      {/* Fond carte stylisé */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, #e8f4e8 0%, #c8e6c9 40%, #dcedc8 100%)',
      }}>
        {/* Grille routes */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.7) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,0.7) 2px, transparent 2px),
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 60px 60px, 20px 20px, 20px 20px',
        }} />

        {/* Pin GPS */}
        {!error && (
          <div style={{
            position: 'absolute', top: '42%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
            {/* Halo */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 64, height: 64,
              background: 'rgba(0,122,255,0.15)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }} />
            {/* Dot */}
            <div style={{
              width: 28, height: 28,
              background: loading ? '#8e8e93' : 'var(--color-primary)',
              borderRadius: '50%',
              border: '3px solid #fff',
              boxShadow: '0 2px 12px rgba(0,122,255,0.5)',
              transition: 'background 0.3s',
            }} />
          </div>
        )}

        {/* Bottom sheet */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          padding: '12px 16px 20px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}>
          {/* Handle */}
          <div style={{ width: 36, height: 4, background: '#e0e0e0', borderRadius: 2, margin: '0 auto 16px' }} />

          {error ? (
            <div style={{ textAlign: 'center', color: 'var(--color-danger)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📍</div>
              <div style={{ fontWeight: 600 }}>{error}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginTop: 6 }}>
                Autorise la localisation dans les Réglages iOS
              </div>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              Recherche du signal GPS…
            </div>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                📍 Position actuelle
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                {formatCoord(position.lat, 'N', 'S')} · {formatCoord(position.lng, 'E', 'O')}
              </div>

              {/* Barre précision */}
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>Précision GPS</span>
                <span style={{ color: accuracyColor(position.accuracy), fontWeight: 600 }}>
                  ~{Math.round(position.accuracy)} m
                </span>
              </div>
              <div style={{ height: 4, background: '#e5e5ea', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, 100 - (position.accuracy / 100) * 80)}%`,
                  background: accuracyColor(position.accuracy),
                  borderRadius: 2,
                  transition: 'width 0.5s, background 0.3s',
                }} />
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.1; }
        }
      `}</style>
    </div>
  )
}
