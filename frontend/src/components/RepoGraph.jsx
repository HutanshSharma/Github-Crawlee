import { useEffect, useMemo, useRef, useState } from "react"
import { Folder, FileText, Home, ChevronLeft } from "lucide-react"

function isDir(val) {
  return typeof val === "object" && val !== null
}

function getNodeAtPath(data, path) {
  let node = data
  for (const seg of path) {
    if (!node || typeof node !== "object") return null
    node = node[seg]
  }
  return node
}

function getEntries(node) {
  if (!node || typeof node !== "object") return []
  return Object.entries(node).map(([name, val]) => ({
    name,
    type: isDir(val) ? "dir" : "file",
  }))
}

function useSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return size
}

function buildLargeData() {
  const root = {}
  for (let i = 1; i <= 60; i++) {
    const num = String(i).padStart(3, "0")
    root[`folder-${num}`] = {
      "readme.md": null,
      "index.js": null,
    }
  }
  for (let i = 1; i <= 240; i++) {
    const num = String(i).padStart(4, "0")
    root[`file-${num}.txt`] = null
  }
  return root
}

function getCardSize(count, dims) {
  const baseW = 144
  const baseH = 64

  let w = baseW
  if (count > 240) w = 96
  else if (count > 160) w = 112
  else if (count > 100) w = 128

  if (Math.min(dims.width || 0, dims.height || 0) < 560) {
    w = Math.min(w, 112)
  }

  const h = Math.max(44, Math.round((w / baseW) * baseH))
  return { w, h }
}

function rectangularScatterLayout(count, center, dims, t = 0, opts = {}) {
  const positions = []
  if (count === 0) return { positions, cardW: 0, cardH: 0 }

  const width = Math.max(1, dims.width || 0)
  const height = Math.max(1, dims.height || 0)

  const padding = opts.padding ?? 24
  const spacing = opts.spacing ?? 16
  const baseCard = opts.cardSize || { w: 144, h: 64 }

  const exWBase = Math.max(opts.excludeWidth ?? Math.floor(width * 0.45), 280)
  const exHBase = Math.max(opts.excludeHeight ?? Math.floor(height * 0.35), 220)

  const gridW = Math.max(1, width - padding * 2)
  const gridH = Math.max(1, height - padding * 2)

  function capacityFor(s) {
    const cw = baseCard.w * s + spacing
    const ch = baseCard.h * s + spacing
    if (cw <= 4 || ch <= 4) return 0
    const cols = Math.floor(gridW / cw)
    const rows = Math.floor(gridH / ch)
    if (cols <= 0 || rows <= 0) return 0
    const exCols = Math.max(0, Math.floor(exWBase / cw))
    const exRows = Math.max(0, Math.floor(exHBase / ch))
    const excluded = exCols * exRows
    return Math.max(0, cols * rows - excluded)
  }

  let scale = 1
  if (capacityFor(scale) < count) {
    let s = 1
    for (let i = 0; i < 12; i++) {
      s *= 0.9
      if (s < 0.35) {
        s = 0.35
        break
      }
      if (capacityFor(s) >= count) {
        scale = s
        break
      }
      scale = s
    }
  }

  const cardW = Math.max(24, Math.round(baseCard.w * scale))
  const cardH = Math.max(20, Math.round(baseCard.h * scale))
  const cellW = cardW + spacing
  const cellH = cardH + spacing

  const cols = Math.max(1, Math.floor(gridW / cellW))
  const rows = Math.max(1, Math.floor(gridH / cellH))

  const startX = padding + (gridW - cols * cellW) / 2 + cellW / 2
  const startY = padding + (gridH - rows * cellH) / 2 + cellH / 2

  const exW = Math.max(0, Math.min(exWBase, Math.max(0, gridW - cellW)))
  const exH = Math.max(0, Math.min(exHBase, Math.max(0, gridH - cellH)))

  let cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * cellW
      const y = startY + r * cellH
      const insideExclusion = Math.abs(x - center.x) < exW / 2 && Math.abs(y - center.y) < exH / 2
      if (insideExclusion) continue
      cells.push({ x, y })
    }
  }

  if (cells.length === 0) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * cellW
        const y = startY + r * cellH
        cells.push({ x, y })
      }
    }
  }

  if (cells.length === 0) {
    cells.push({
      x: Math.min(width - padding, Math.max(padding, center.x + Math.max(40, cellW))),
      y: Math.min(height - padding, Math.max(padding, center.y + Math.max(40, cellH))),
    })
  }

  cells = cells.filter((c) => c && Number.isFinite(c.x) && Number.isFinite(c.y))
  if (cells.length > 1) {
    cells.sort((a, b) => {
      const da = (a.x - center.x) ** 2 + (a.y - center.y) ** 2
      const db = (b.x - center.x) ** 2 + (b.y - center.y) ** 2
      return db - da
    })
  }

  for (let i = 0; i < count; i++) {
    const cell = cells[i % cells.length] || { x: center.x, y: center.y }
    const jx = 0
    const jy = 0
    positions.push({
      x: (cell.x ?? center.x) + jx,
      y: (cell.y ?? center.y) + jy,
      angle: 0,
      ring: 0,
    })
  }

  return { positions, cardW, cardH }
}

function NodeCard({ label, type, onClick, style }) {
  const isFolder = type === "dir"
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        `absolute w-50 h-16 rounded-lg shadow-sm flex items-center gap-2 px-3 transition-transform hover:-translate-y-0.5`}
      style={{ ...style, backgroundColor: isFolder ? "#2762dc" : "#151d2f", borderColor: isFolder ? '#478aec':'#323b4a', borderWidth:'2px'}}
      aria-label={isFolder ? `Open folder ${label}` : `File ${label}`}
    >
      <span
        className={`inline-flex items-center justify-center rounded-md ${isFolder ? 'bg-[#5c8ee6]':'bg-[#474d5a]'} text-muted-foreground w-8 h-8 shrink-0`}
        aria-hidden="true"
      >
        {isFolder ? <Folder size={18} /> : <FileText size={18} />}
      </span>
      <span className="text-sm text-left line-clamp-2">{label}</span>
    </button>
  )
}

export default function RadialFileMap({ data }) {
  const containerRef = useRef(null)
  const { width, height } = useSize(containerRef)

  const [path, setPath] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const sourceData = useMemo(() => data || buildLargeData(), [data])
  const node = useMemo(() => getNodeAtPath(sourceData, path), [sourceData, path])
  const entries = useMemo(() => getEntries(node), [node])
  const center = { x: Math.max(1, width / 2), y: Math.max(1, height / 2) }
  const baseCardSize = useMemo(() => getCardSize(entries.length, { width, height }), [entries.length, width, height])

  const layout = useMemo(() => {
    return rectangularScatterLayout(entries.length, center, { width, height }, 0, {
      cardSize: baseCardSize,
      spacing: 18,
      padding: 24,
      excludeWidth: Math.floor(width * 0.5),
      excludeHeight: Math.floor(height * 0.42),
    })
  }, [entries.length, width, height, baseCardSize])

  const safePositions = useMemo(() => {
    const list = new Array(entries.length)
    const src = layout ? layout.positions : []
    for (let i = 0; i < entries.length; i++) {
      const p = src[i]
      if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) {
        list[i] = p
      } else {
        list[i] = { x: center.x, y: center.y }
      }
    }
    return list
  }, [entries.length, layout, center.x, center.y])

  function handleFolderClick(name) {
    setSelectedFile(null)
    setPath((prev) => [...prev, name])
  }

  function handleFileClick(name) {
    setSelectedFile([...path, name].join("/"))
  }

  function goUp() {
    setSelectedFile(null)
    setPath((prev) => prev.slice(0, -1))
  }

  function goHome() {
    setSelectedFile(null)
    setPath([])
  }

  const currentLabel = path.length === 0 ? "root" : path[path.length - 1]

  return (
    <div className="p-4 w-full bg-[#111827] h-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex items-center gap-1 text-primary hover:underline px-6 py-3 rounded-md border-2 border-[#2e3343] hover:border-[rgb(68,111,192)] ease-in-out duration-200 mb-4"
            style={{backgroundColor : '#1d2332'}}
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
            <span>root</span>
          </button>
          {path.map((seg, idx) => (
            <button
            key={idx}
            type="button"
            onClick={() => {
                  setSelectedFile(null)
                  setPath(path.slice(0, idx + 1))
                }}
            className="inline-flex items-center gap-1 text-primary hover:underline px-6 py-3 rounded-md border-2 border-[#2e3343] hover:border-[rgb(68,111,192)] ease-in-out duration-200 mb-4"
            style={{backgroundColor : '#1d2332'}}
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
            <span>{seg}</span>
          </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {path.length > 0 && (
            <button
              type="button"
              onClick={goUp}
              className="inline-flex items-center gap-1 text-sm px-6 py-3 rounded-md border-2 border-[#2e3343] hover:border-[rgb(68,111,192)]"
              style={{backgroundColor:'#1d2332'}}
            >
              <ChevronLeft size={16} />
              Up
            </button>
          )}
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full min-h-[520px] md:min-h-[600px] rounded-md border-2 border-[#2e3343] bg-muted/30 overflow-hidden bg-[#1d2332]"
        role="region"
        aria-label="Rectangular file map"
      >
        <div
          className={[
            "absolute z-10 -translate-x-1/2 -translate-y-1/2",
            "w-50 h-50 lg:w-60 lg:h-60 rounded-full border bg-card shadow border-[#506ac4]",
            "flex flex-col items-center justify-center text-center bg-gradient-to-r from-[#344dca] via-[#4d43cc] to-[#6b37cc]",
          ].join(" ")}
          style={{
            left: center.x,
            top: center.y,
            transition: "left 280ms cubic-bezier(0.22,0.61,0.36,1), top 280ms cubic-bezier(0.22,0.61,0.36,1)",
            willChange: "left, top",
          }}
          aria-label={`Current folder ${currentLabel}`}
        >
          <div className="mb-2 bg-[#6a6bd5] inline-flex items-center justify-center w-15 lg:w-20 h-15 lg:h-20 rounded-full bg-primary/10 text-white">
            <Folder size={30} />
          </div>
          <div className="text-sm font-medium px-3 text-pretty">{currentLabel}</div>
          <div className="text-xs text-muted-foreground px-4 mt-1">
            {entries.length} item{entries.length === 1 ? "" : "s"}
          </div>
        </div>

        {entries.map((item, idx) => {
          const pos = safePositions[idx]
          const cardW = layout?.cardW || baseCardSize.w
          const cardH = layout?.cardH || baseCardSize.h
          const style = {
            left: (pos?.x ?? center.x) - cardW / 2,
            top: (pos?.y ?? center.y) - cardH / 2,
            width: cardW,
            height: cardH,
            transition:
              "left 320ms cubic-bezier(0.22,0.61,0.36,1), top 320ms cubic-bezier(0.22,0.61,0.36,1), width 200ms ease, height 200ms ease, transform 320ms cubic-bezier(0.22,0.61,0.36,1), opacity 200ms ease-out",
            willChange: "left, top, width, height, transform, opacity",
          }
          const onClick = item.type === "dir" ? () => handleFolderClick(item.name) : () => handleFileClick(item.name)
          return <NodeCard key={item.name} label={item.name} type={item.type} onClick={onClick} style={style} />
        })}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        {selectedFile ? (
          <div>
            Selected file: <span className="text-foreground">{selectedFile}</span>
          </div>
        ) : (
          <div>Tip: Click a folder to focus it, or a file to see its path.</div>
        )}
      </div>
    </div>
  )
}
