const tabbarStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: 'calc(var(--tabbar-height) + var(--safe-bottom))',
  paddingBottom: 'var(--safe-bottom)',
  background: 'rgba(255, 255, 255, 0.92)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: '1px solid var(--color-separator)',
  flexShrink: 0,
}

const tabStyle = (active) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  padding: '6px 16px',
  fontSize: '10px',
  fontWeight: active ? '600' : '400',
  color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
})

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <nav style={tabbarStyle}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          style={tabStyle(activeTab === tab.id)}
          onClick={() => onTabChange(tab.id)}
        >
          <span style={{ fontSize: '22px', lineHeight: 1 }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
