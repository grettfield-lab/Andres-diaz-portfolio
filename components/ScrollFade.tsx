export default function ScrollFade() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, transparent 75%, rgba(10,10,10,0.97) 100%)',
      }}
    />
  )
}
