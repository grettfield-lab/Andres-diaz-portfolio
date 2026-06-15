const KERN_CHARS = new Set(['e', 'E', 't', 'T', 'a', 'A', 's', 'S', 'f', 'F', 'g', 'G', 'z', 'Z'])

export default function KernedText({ children }: { children: string }) {
  return (
    <>
      {Array.from(children).map((char, i) =>
        KERN_CHARS.has(char) ? (
          <span key={i} style={{ padding: '0 3px' }}>{char}</span>
        ) : (
          char
        )
      )}
    </>
  )
}
