export default function ScrollFade() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8,
        pointerEvents: 'none',
        background:
          'linear-gradient(to bottom, #0A0A0A 0%, transparent 13%, transparent 87%, #0A0A0A 100%)',
      }}
    />
  )
}
