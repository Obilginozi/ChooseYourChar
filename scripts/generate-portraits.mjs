/**
 * Full-body pixel portraits — 64×96 design grid → 192×288 → 1536×2304 PNG.
 * Detail comes from a larger logical canvas, not upscaling a tiny sprite.
 * Run: node scripts/generate-portraits.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../public/assets/characters')

const LOGICAL_W = 64
const LOGICAL_H = 96
const K = 3
const OUT_W = LOGICAL_W * K
const OUT_H = LOGICAL_H * K
const SCALE = 8

const C = {
  K: '#F5E6C8',
  S: '#D4A574',
  H: '#5C3A1E',
  E: '#2C3E50',
  W: '#FFFFFF',
  B: '#1A1A2E',
  R: '#C0392B',
  G: '#2D6A4F',
  Y: '#FFD700',
  O: '#FF8C00',
  N: '#001A4D',
  F: '#FFED00',
  P: '#9B59B6',
  V: '#4A7C9B',
  L: '#6C3483',
  T: '#1ABC9C',
  A: '#D4A574',
  M: '#7B2D26',
  I: '#ECF0F1',
  X: '#888888',
  D: '#0D0D1A',
  U: '#C9A66B',
  Q: '#F4D03F',
  J: '#2ECC71',
  Z: '#3498DB',
  k: '#8B6914',
  p: '#E8D4A8',
  w: '#F0F0F0',
  wood: '#5C3A1E',
}

function canvas() {
  return Array.from({ length: OUT_H }, () => Array(OUT_W).fill(null))
}

function set(m, x, y, color) {
  if (!color || x < 0 || x >= LOGICAL_W || y < 0 || y >= LOGICAL_H) return
  for (let dy = 0; dy < K; dy++)
    for (let dx = 0; dx < K; dx++) {
      const px = x * K + dx
      const py = y * K + dy
      if (px < OUT_W && py < OUT_H) m[py][px] = color
    }
}

function fill(m, x, y, w, h, color) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++) set(m, x + dx, y + dy, color)
}

function outline(m, x, y, w, h, edge, inner = null) {
  if (inner) fill(m, x + 1, y + 1, w - 2, h - 2, inner)
  for (let dx = 0; dx < w; dx++) {
    set(m, x + dx, y, edge)
    set(m, x + dx, y + h - 1, edge)
  }
  for (let dy = 0; dy < h; dy++) {
    set(m, x, y + dy, edge)
    set(m, x + w - 1, y + dy, edge)
  }
}

function neck(m, cx, y) {
  fill(m, cx - 4, y, 9, 4, C.K)
}

function head(m, cx, y, hair) {
  fill(m, cx - 6, y, 13, 10, C.K)
  fill(m, cx - 7, y + 2, 15, 6, C.K)
  set(m, cx - 4, y + 4, C.E)
  set(m, cx + 4, y + 4, C.E)
  fill(m, cx - 2, y + 7, 5, 2, C.S)
  fill(m, cx - 8, y - 3, 17, 5, hair)
  fill(m, cx - 6, y - 5, 13, 3, hair)
}

function legs(m, cx, y, pants, shoes = C.B) {
  fill(m, cx - 6, y, 5, 16, pants)
  fill(m, cx + 2, y, 5, 16, pants)
  fill(m, cx - 6, y + 16, 5, 5, shoes)
  fill(m, cx + 2, y + 16, 5, 5, shoes)
}

function arm(m, x, y, len, color, w = 3) {
  fill(m, x, y, w, len, color)
  fill(m, x, y + len - 2, w, 2, C.K)
}

function body(m, cx, y, w, h, color) {
  fill(m, cx - Math.floor(w / 2), y, w, h, color)
}

function stripedShirt(m, cx, y, w, h, c1, c2, stripe = 3) {
  const left = cx - Math.floor(w / 2)
  for (let row = 0; row < h; row++)
    for (let col = 0; col < w; col++)
      set(m, left + col, y + row, Math.floor(col / stripe) % 2 === 0 ? c1 : c2)
}

// ─── Props (large, outlined, iconic) ───────────────────────────────────────

/** Open book — two big white pages */
function propOpenBook(m, x, y) {
  outline(m, x, y, 9, 14, C.M, C.W)
  outline(m, x + 9, y, 9, 14, C.M, C.W)
  fill(m, x + 1, y + 1, 7, 12, C.W)
  fill(m, x + 10, y + 1, 7, 12, C.W)
  fill(m, x + 8, y, 2, 14, C.M)
  for (let i = 0; i < 5; i++) {
    fill(m, x + 2, y + 3 + i * 2, 5, 1, C.p)
    fill(m, x + 11, y + 3 + i * 2, 5, 1, C.p)
  }
  fill(m, x, y + 13, 18, 2, C.M)
}

/** Tall bookshelf with chunky coloured spines */
function propBookshelf(m, x, y) {
  outline(m, x, y, 20, 72, C.wood, '#3D2314')
  fill(m, x + 1, y + 22, 18, 2, C.wood)
  fill(m, x + 1, y + 44, 18, 2, C.wood)
  const books = [
    [2, 4, 4, 16, C.R],
    [7, 2, 4, 18, C.Z],
    [12, 4, 4, 16, C.G],
    [2, 26, 5, 16, C.P],
    [8, 24, 4, 18, C.O],
    [13, 26, 5, 16, C.T],
    [2, 48, 4, 20, C.N],
    [7, 46, 5, 22, C.Y],
    [13, 48, 5, 20, C.R],
  ]
  for (const [bx, by, bw, bh, col] of books) fill(m, x + bx, y + by, bw, bh, col)
}

function propStethoscope(m, cx, y) {
  outline(m, cx - 12, y, 6, 6, C.B, C.X)
  outline(m, cx + 7, y, 6, 6, C.B, C.X)
  fill(m, cx - 3, y + 5, 7, 3, C.R)
  fill(m, cx - 2, y + 8, 5, 14, C.R)
  fill(m, cx - 5, y + 20, 11, 3, C.R)
  outline(m, cx - 4, y + 23, 9, 8, C.B, C.X)
  fill(m, cx - 2, y + 25, 5, 4, C.R)
}

function propDrumKit(m, x, y) {
  fill(m, x + 10, y, 2, 28, C.X)
  fill(m, x + 6, y - 2, 10, 3, C.O)
  fill(m, x + 4, y - 4, 14, 2, C.Y)
  fill(m, x + 2, y + 8, 2, 22, C.X)
  outline(m, x - 2, y + 26, 18, 14, C.B, C.D)
  fill(m, x + 1, y + 28, 12, 10, C.R)
  fill(m, x + 4, y + 30, 6, 6, C.W)
  outline(m, x + 4, y + 14, 12, 10, C.B, C.O)
  fill(m, x + 6, y + 16, 8, 6, C.W)
  fill(m, x + 14, y + 10, 10, 3, C.O)
  fill(m, x + 12, y + 8, 14, 2, C.Y)
}

function propSoccerBall(m, cx, cy, r) {
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) set(m, cx + dx, cy + dy, C.W)
    }
  }
  fill(m, cx - 3, cy - r + 2, 6, 5, C.B)
  fill(m, cx - r + 2, cy - 3, 5, 6, C.B)
  fill(m, cx + r - 7, cy - 3, 5, 6, C.B)
  fill(m, cx - 6, cy + 2, 6, 5, C.B)
  fill(m, cx + 1, cy + 2, 6, 5, C.B)
  fill(m, cx - 3, cy - 5, 6, 4, C.B)
}

function propLaptop(m, x, y) {
  outline(m, x, y, 18, 12, C.B, C.D)
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 7; c++)
      set(m, x + 3 + c, y + 2 + r, r < 2 ? C.Z : C.J)
  outline(m, x - 1, y + 12, 22, 4, C.B, C.V)
  fill(m, x + 8, y + 16, 4, 3, C.X)
}

function propMonitor(m, x, y) {
  outline(m, x, y, 20, 14, C.B, C.D)
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 8; c++)
      set(m, x + 4 + c, y + 3 + r, r < 3 ? C.Z : C.J)
  fill(m, x + 8, y + 14, 4, 5, C.X)
  fill(m, x + 4, y + 19, 12, 2, C.X)
}

function propTesbih(m, x, y) {
  for (let i = 0; i < 14; i++) {
    const col = i % 4 === 0 ? C.Y : C.Q
    outline(m, x, y + i, 3, 3, C.B, col)
  }
  outline(m, x - 1, y + 14, 5, 6, C.B, C.Y)
}

function propBookStack(m, x, y) {
  outline(m, x, y + 14, 10, 4, C.B, C.R)
  outline(m, x + 1, y + 9, 9, 4, C.B, C.Z)
  outline(m, x, y + 4, 10, 4, C.B, C.G)
  outline(m, x + 1, y, 8, 4, C.B, C.M)
}

function propChalkboard(m, x, y) {
  outline(m, x, y, 20, 28, C.wood, C.G)
  fill(m, x + 3, y + 6, 14, 2, C.W)
  fill(m, x + 3, y + 12, 10, 2, C.W)
  fill(m, x + 3, y + 18, 12, 2, C.W)
  fill(m, x + 2, y + 28, 16, 3, C.wood)
}

function propDumbbell(m, x, y) {
  outline(m, x, y + 3, 5, 8, C.B, C.X)
  fill(m, x + 5, y + 5, 8, 4, C.X)
  outline(m, x + 13, y + 3, 5, 8, C.B, C.X)
}

function propBackpack(m, x, y) {
  outline(m, x, y, 14, 20, C.B, C.A)
  fill(m, x + 3, y + 3, 8, 6, C.T)
  fill(m, x + 2, y + 10, 10, 8, C.A)
  outline(m, x + 15, y + 4, 8, 7, C.B, C.D)
  fill(m, x + 17, y + 6, 4, 3, C.Z)
  fill(m, x + 16, y + 3, 6, 2, C.X)
}

function propMicrophone(m, x, y) {
  fill(m, x, y, 3, 16, C.X)
  outline(m, x - 2, y + 16, 7, 4, C.B, C.X)
  outline(m, x - 3, y - 4, 9, 6, C.B, C.D)
  fill(m, x - 1, y - 2, 5, 3, C.X)
}

function propSpotlight(m, x, y) {
  fill(m, x, y + 6, 3, 14, C.X)
  outline(m, x - 2, y + 20, 7, 4, C.B, C.X)
  fill(m, x + 6, y, 14, 10, C.Y)
  fill(m, x + 8, y + 2, 10, 6, '#FFFACD')
}

function propClipboard(m, x, y) {
  outline(m, x, y, 8, 12, C.B, C.W)
  fill(m, x + 2, y + 2, 4, 1, C.R)
  fill(m, x + 2, y + 5, 4, 1, C.R)
  fill(m, x + 2, y + 8, 4, 1, C.R)
}

function propMap(m, x, y) {
  outline(m, x, y, 10, 8, C.B, C.w)
  fill(m, x + 2, y + 2, 3, 2, C.G)
  fill(m, x + 5, y + 3, 3, 2, C.Z)
  fill(m, x + 3, y + 5, 4, 2, C.T)
}

// ─── Characters ──────────────────────────────────────────────────────────────

function drawFilozof() {
  const m = canvas()
  const cx = 20
  fill(m, cx - 8, 12, 16, 8, C.H)
  head(m, cx, 14, C.H)
  neck(m, cx, 24)
  fill(m, cx - 7, 24, 14, 6, C.H)
  body(m, cx, 30, 18, 22, C.U)
  fill(m, cx - 10, 32, 3, 18, C.U)
  fill(m, cx + 8, 33, 3, 16, C.U)
  arm(m, cx - 13, 32, 12, C.U)
  arm(m, cx + 11, 34, 10, C.U)
  propOpenBook(m, cx - 16, 38)
  legs(m, cx, 54, C.U, C.k)
  propBookshelf(m, 42, 10)
  return m
}

function drawMuhendis() {
  const m = canvas()
  const cx = 20
  fill(m, cx - 8, 6, 16, 6, C.O)
  fill(m, cx - 2, 4, 5, 3, C.O)
  head(m, cx, 16, C.H)
  neck(m, cx, 26)
  body(m, cx, 30, 18, 20, C.V)
  fill(m, cx - 6, 31, 12, 4, C.O)
  arm(m, cx - 13, 32, 11, C.V)
  arm(m, cx + 11, 30, 8, C.V)
  propLaptop(m, cx + 4, 32)
  legs(m, cx, 52, C.B)
  propMonitor(m, 42, 14)
  return m
}

function drawImam() {
  const m = canvas()
  const cx = 32
  fill(m, cx - 10, 2, 20, 16, C.W)
  fill(m, cx - 4, 0, 9, 5, C.Y)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  body(m, cx, 32, 22, 24, C.G)
  fill(m, cx - 8, 33, 16, 6, C.Y)
  arm(m, cx - 14, 34, 14, C.G)
  arm(m, cx + 12, 34, 14, C.G)
  propTesbih(m, cx + 14, 36)
  legs(m, cx, 56, C.G, C.k)
  return m
}

function drawAkademisyen() {
  const m = canvas()
  const cx = 20
  fill(m, cx - 10, 6, 20, 6, C.M)
  fill(m, cx - 3, 4, 7, 4, C.Y)
  fill(m, cx, 2, 2, 6, C.Y)
  head(m, cx, 16, C.H)
  neck(m, cx, 26)
  set(m, cx - 5, 20, C.E)
  set(m, cx - 3, 20, C.W)
  set(m, cx + 3, 20, C.E)
  set(m, cx + 5, 20, C.W)
  body(m, cx, 30, 20, 24, C.M)
  fill(m, cx - 7, 31, 14, 5, C.Y)
  arm(m, cx - 14, 32, 12, C.M)
  arm(m, cx + 12, 32, 12, C.M)
  propBookStack(m, 2, 38)
  legs(m, cx, 56, C.B)
  propChalkboard(m, 42, 12)
  return m
}

function drawMuzisyen() {
  const m = canvas()
  const cx = 18
  fill(m, cx - 9, 8, 18, 6, C.P)
  fill(m, cx - 10, 12, 3, 5, C.P)
  fill(m, cx + 7, 12, 3, 5, C.P)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  body(m, cx, 32, 16, 18, C.L)
  arm(m, cx - 12, 33, 10, C.L)
  arm(m, cx + 10, 32, 10, C.L)
  propMicrophone(m, cx - 16, 30)
  fill(m, cx - 3, 42, 7, 3, C.R)
  legs(m, cx, 52, C.B)
  propDrumKit(m, 38, 10)
  return m
}

function drawFenerbahceli() {
  const m = canvas()
  const cx = 22
  fill(m, cx - 8, 6, 16, 6, C.F)
  head(m, cx, 16, C.H)
  neck(m, cx, 26)
  stripedShirt(m, cx, 30, 18, 14, C.F, C.N, 3)
  stripedShirt(m, cx, 44, 18, 8, C.F, C.N, 3)
  fill(m, cx - 11, 30, 3, 20, C.F)
  fill(m, cx + 9, 30, 3, 20, C.N)
  arm(m, cx - 14, 32, 10, C.F)
  arm(m, cx + 12, 32, 10, C.N)
  legs(m, cx, 54, C.N)
  fill(m, cx - 5, 52, 5, 3, C.F)
  fill(m, cx + 1, 52, 5, 3, C.N)
  fill(m, 0, 88, 64, 8, C.k)
  propSoccerBall(m, 48, 82, 10)
  return m
}

function drawSporcu() {
  const m = canvas()
  const cx = 32
  fill(m, cx - 10, 8, 20, 5, C.R)
  fill(m, cx - 8, 10, 16, 3, C.Y)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  body(m, cx, 32, 18, 18, C.R)
  fill(m, cx - 6, 33, 12, 5, C.Y)
  arm(m, cx - 14, 33, 8, C.R)
  arm(m, cx + 12, 33, 8, C.R)
  propDumbbell(m, cx - 24, 28)
  propDumbbell(m, cx + 14, 28)
  legs(m, cx, 52, C.B)
  fill(m, cx - 5, 50, 10, 3, C.R)
  return m
}

function drawGezgin() {
  const m = canvas()
  const cx = 20
  fill(m, cx - 12, 6, 24, 7, C.A)
  fill(m, cx - 3, 4, 7, 3, C.A)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  body(m, cx, 32, 16, 18, C.T)
  arm(m, cx - 12, 33, 12, C.T)
  arm(m, cx + 10, 33, 10, C.T)
  propMap(m, cx - 18, 36)
  legs(m, cx, 52, C.B)
  propBackpack(m, 42, 22)
  return m
}

function drawSakamatik() {
  const m = canvas()
  const cx = 20
  fill(m, cx - 10, 18, 20, 5, C.B)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  set(m, cx - 6, 22, C.D)
  set(m, cx + 6, 22, C.D)
  fill(m, cx - 5, 25, 10, 3, C.W)
  body(m, cx, 32, 18, 18, C.Z)
  fill(m, cx - 6, 34, 12, 4, C.R)
  arm(m, cx - 12, 33, 10, C.Z)
  arm(m, cx + 10, 33, 10, C.R)
  propMicrophone(m, cx + 10, 28)
  legs(m, cx, 52, C.B)
  propSpotlight(m, 42, 8)
  return m
}

function drawUzmanDoktor() {
  const m = canvas()
  const cx = 32
  head(m, cx, 16, C.H)
  neck(m, cx, 26)
  body(m, cx, 30, 20, 24, C.I)
  fill(m, cx - 7, 31, 14, 6, C.Z)
  arm(m, cx - 14, 32, 12, C.I)
  arm(m, cx + 12, 32, 12, C.I)
  propStethoscope(m, cx, 24)
  propClipboard(m, cx + 12, 38)
  legs(m, cx, 56, C.B)
  fill(m, cx - 6, 54, 12, 4, C.I)
  return m
}

const SPRITES = {
  filozof: drawFilozof,
  muhendis: drawMuhendis,
  imam: drawImam,
  akademisyen: drawAkademisyen,
  muzisyen: drawMuzisyen,
  fenerbahceli: drawFenerbahceli,
  sporcu: drawSporcu,
  gezgin: drawGezgin,
  sakamatik: drawSakamatik,
  uzman_doktor: drawUzmanDoktor,
}

function buildSprite(draw) {
  return draw()
}

function hexToRgba(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255]
}

function writePng(matrix, filePath) {
  const h = matrix.length
  const w = matrix[0].length
  const png = new PNG({ width: w * SCALE, height: h * SCALE })

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const hex = matrix[y][x]
      if (!hex) continue
      const [r, g, b, a] = hexToRgba(hex)
      for (let sy = 0; sy < SCALE; sy++) {
        for (let sx = 0; sx < SCALE; sx++) {
          const idx = ((y * SCALE + sy) * w * SCALE + (x * SCALE + sx)) << 2
          png.data[idx] = r
          png.data[idx + 1] = g
          png.data[idx + 2] = b
          png.data[idx + 3] = a
        }
      }
    }
  }

  fs.writeFileSync(filePath, PNG.sync.write(png))
}

fs.mkdirSync(OUT_DIR, { recursive: true })

for (const [id, draw] of Object.entries(SPRITES)) {
  writePng(buildSprite(draw), path.join(OUT_DIR, `${id}.png`))
  console.log(`✓ ${id}.png (${OUT_W}×${OUT_H} → ${OUT_W * SCALE}×${OUT_H * SCALE})`)
}
