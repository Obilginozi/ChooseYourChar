/**
 * Procedural full-body pixel portrait generator (32×48 → 256×384 PNG).
 * Run: node scripts/generate-portraits.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../public/assets/characters')
const WIDTH = 32
const HEIGHT = 48
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
}

function canvas() {
  return Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null))
}

function set(m, x, y, color) {
  if (y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && color) m[y][x] = color
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

function head(m, cx, y, hair) {
  fill(m, cx - 3, y, 7, 6, C.K)
  fill(m, cx - 4, y + 1, 9, 4, C.K)
  set(m, cx - 2, y + 2, C.E)
  set(m, cx + 2, y + 2, C.E)
  set(m, cx - 1, y + 4, C.S)
  fill(m, cx - 4, y - 1, 9, 2, hair)
  fill(m, cx - 3, y - 2, 7, 1, hair)
}

function legs(m, cx, y, pants, shoes = C.B) {
  fill(m, cx - 3, y, 3, 7, pants)
  fill(m, cx + 1, y, 3, 7, pants)
  fill(m, cx - 3, y + 7, 3, 2, shoes)
  fill(m, cx + 1, y + 7, 3, 2, shoes)
}

function arm(m, x, y, len, color) {
  fill(m, x, y, 2, len, color)
  set(m, x, y + len - 1, C.K)
  set(m, x + 1, y + len - 1, C.K)
}

function drawFilozof() {
  const m = canvas()
  const cx = 16
  head(m, cx, 7, C.H)
  fill(m, cx - 3, 10, 7, 5, C.k)
  fill(m, cx - 2, 11, 5, 3, C.k)
  body(m, cx, 15, 12, 16, C.U)
  arm(m, cx - 8, 17, 10, C.U)
  arm(m, cx + 7, 17, 8, C.U)
  outline(m, cx - 11, 18, 5, 12, C.Q, '#E8D4A8')
  for (let i = 0; i < 7; i++) set(m, cx - 10, 20 + i, C.S)
  set(m, cx - 9, 19, C.Q)
  set(m, cx + 8, 20, C.K)
  set(m, cx + 8, 21, C.K)
  set(m, cx + 8, 22, C.K)
  legs(m, cx, 31, C.U, C.k)
  fill(m, cx - 6, 29, 12, 3, C.U)
  return m
}

function body(m, cx, y, w, h, color) {
  fill(m, cx - Math.floor(w / 2), y, w, h, color)
}

function drawMuhendis() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 5, 4, 11, 4, C.O)
  fill(m, cx - 4, 3, 9, 2, C.O)
  set(m, cx - 2, 5, C.W)
  set(m, cx + 2, 5, C.W)
  set(m, cx, 5, C.B)
  head(m, cx, 8, C.H)
  fill(m, cx - 5, 14, 11, 12, C.V)
  fill(m, cx - 4, 15, 9, 2, C.O)
  fill(m, cx - 3, 18, 7, 1, C.O)
  fill(m, cx - 2, 20, 5, 1, C.W)
  arm(m, cx - 8, 16, 9, C.V)
  arm(m, cx + 7, 14, 5, C.V)
  outline(m, cx + 4, 15, 9, 7, C.B, C.V)
  fill(m, cx + 5, 16, 7, 5, C.D)
  set(m, cx + 6, 17, C.Z)
  set(m, cx + 7, 17, C.Z)
  set(m, cx + 8, 17, C.Z)
  set(m, cx + 9, 17, C.Z)
  set(m, cx + 6, 18, C.J)
  set(m, cx + 7, 18, C.J)
  set(m, cx + 8, 18, C.J)
  set(m, cx + 5, 20, C.B)
  set(m, cx + 6, 20, C.B)
  set(m, cx + 7, 20, C.B)
  set(m, cx + 8, 20, C.B)
  set(m, cx + 9, 20, C.B)
  set(m, cx + 6, 21, C.X)
  set(m, cx + 7, 21, C.X)
  set(m, cx + 8, 21, C.X)
  legs(m, cx, 28, C.B)
  fill(m, cx - 4, 27, 9, 2, C.O)
  return m
}

function drawImam() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 6, 1, 13, 8, C.W)
  fill(m, cx - 5, 0, 11, 4, C.W)
  fill(m, cx - 3, 0, 7, 2, C.W)
  fill(m, cx - 2, 0, 5, 1, C.Y)
  fill(m, cx - 4, 7, 9, 2, C.W)
  head(m, cx, 9, C.H)
  set(m, cx - 1, 12, C.S)
  set(m, cx + 1, 12, C.S)
  fill(m, cx - 6, 14, 13, 17, C.G)
  fill(m, cx - 5, 15, 11, 3, C.Y)
  fill(m, cx - 1, 16, 3, 11, C.Y)
  arm(m, cx - 8, 17, 11, C.G)
  arm(m, cx + 7, 17, 11, C.G)
  for (let i = 0; i < 9; i++) {
    set(m, cx + 8, 17 + i, i % 2 === 0 ? C.Y : C.Q)
    set(m, cx + 9, 17 + i, C.Y)
    set(m, cx + 10, 18 + i, C.Q)
  }
  legs(m, cx, 31, C.G, C.k)
  fill(m, cx - 5, 30, 11, 2, C.G)
  return m
}

function drawAkademisyen() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 6, 4, 13, 3, C.M)
  fill(m, cx - 1, 3, 3, 3, C.Y)
  fill(m, cx - 7, 6, 15, 1, C.M)
  head(m, cx, 8, C.H)
  set(m, cx - 3, 10, C.E)
  set(m, cx - 2, 10, C.W)
  set(m, cx + 2, 10, C.E)
  set(m, cx + 3, 10, C.W)
  fill(m, cx - 6, 14, 13, 17, C.M)
  fill(m, cx - 5, 15, 11, 4, C.Y)
  arm(m, cx - 8, 16, 10, C.M)
  arm(m, cx + 7, 16, 10, C.M)
  outline(m, cx - 11, 20, 5, 9, C.M, C.A)
  fill(m, cx - 10, 21, 3, 7, C.I)
  fill(m, cx - 7, 21, 1, 7, C.R)
  outline(m, cx - 10, 22, 2, 5, C.k, C.A)
  legs(m, cx, 31, C.B)
  fill(m, cx - 5, 30, 11, 2, C.M)
  return m
}

function drawMuzisyen() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 6, 7, 13, 3, C.P)
  fill(m, cx - 7, 8, 2, 4, C.P)
  fill(m, cx + 6, 8, 2, 4, C.P)
  head(m, cx, 9, C.H)
  fill(m, cx - 4, 14, 9, 8, C.L)
  fill(m, cx - 3, 15, 7, 2, C.P)
  arm(m, cx - 7, 15, 6, C.L)
  arm(m, cx + 6, 14, 6, C.L)
  set(m, cx - 8, 16, C.K)
  set(m, cx + 8, 15, C.K)
  fill(m, cx - 10, 21, 21, 1, C.X)
  set(m, cx - 9, 20, C.Y)
  set(m, cx + 9, 20, C.Y)
  set(m, cx, 20, C.Y)
  fill(m, cx - 1, 19, 3, 2, C.R)
  outline(m, cx - 9, 23, 6, 7, C.X, C.B)
  outline(m, cx + 4, 23, 6, 7, C.X, C.B)
  fill(m, cx - 7, 22, 4, 2, C.O)
  fill(m, cx + 5, 22, 4, 2, C.O)
  fill(m, cx - 2, 22, 5, 3, C.R)
  set(m, cx - 8, 24, C.X)
  set(m, cx + 8, 24, C.X)
  set(m, cx - 3, 25, C.B)
  set(m, cx + 4, 25, C.B)
  legs(m, cx, 30, C.B)
  fill(m, cx - 3, 29, 7, 2, C.L)
  return m
}

function drawFenerbahceli() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 6, 5, 13, 4, C.F)
  fill(m, cx - 5, 4, 11, 2, C.F)
  head(m, cx, 9, C.H)
  fill(m, cx - 5, 14, 11, 5, C.F)
  fill(m, cx - 5, 19, 11, 5, C.N)
  fill(m, cx - 2, 15, 5, 3, C.N)
  set(m, cx - 1, 17, C.F)
  set(m, cx + 1, 17, C.F)
  fill(m, cx - 7, 14, 3, 14, C.F)
  fill(m, cx + 5, 14, 3, 14, C.N)
  arm(m, cx - 9, 16, 8, C.F)
  arm(m, cx + 8, 16, 8, C.N)
  fill(m, cx - 10, 17, 4, 8, C.F)
  fill(m, cx - 9, 18, 2, 6, C.N)
  legs(m, cx, 29, C.N)
  fill(m, cx - 4, 28, 4, 2, C.F)
  fill(m, cx + 1, 28, 4, 2, C.N)
  set(m, cx, 21, C.F)
  return m
}

function drawSporcu() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 5, 5, 11, 3, C.R)
  fill(m, cx - 4, 4, 9, 2, C.R)
  head(m, cx, 8, C.H)
  fill(m, cx - 5, 14, 11, 10, C.R)
  fill(m, cx - 4, 15, 9, 2, C.Y)
  fill(m, cx - 2, 18, 5, 1, C.W)
  arm(m, cx - 9, 15, 5, C.R)
  arm(m, cx + 8, 15, 5, C.R)
  fill(m, cx - 13, 13, 5, 5, C.X)
  fill(m, cx - 12, 14, 3, 3, C.B)
  fill(m, cx + 9, 13, 5, 5, C.X)
  fill(m, cx + 10, 14, 3, 3, C.B)
  set(m, cx - 13, 15, C.X)
  set(m, cx - 12, 15, C.B)
  set(m, cx - 11, 15, C.X)
  set(m, cx + 10, 15, C.X)
  set(m, cx + 11, 15, C.B)
  set(m, cx + 12, 15, C.X)
  set(m, cx - 13, 16, C.X)
  set(m, cx + 12, 16, C.X)
  legs(m, cx, 26, C.B)
  fill(m, cx - 4, 25, 9, 2, C.R)
  fill(m, cx - 3, 28, 3, 2, C.W)
  fill(m, cx + 1, 28, 3, 2, C.W)
  return m
}

function drawGezgin() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 7, 4, 15, 4, C.A)
  fill(m, cx - 3, 3, 7, 2, C.A)
  fill(m, cx - 1, 5, 3, 1, C.T)
  head(m, cx, 9, C.H)
  fill(m, cx - 4, 14, 9, 11, C.T)
  fill(m, cx + 4, 14, 5, 12, C.A)
  fill(m, cx + 5, 15, 4, 10, C.T)
  outline(m, cx + 5, 16, 4, 3, C.B, C.X)
  set(m, cx + 6, 17, C.Z)
  arm(m, cx - 7, 15, 9, C.T)
  arm(m, cx + 8, 15, 6, C.T)
  outline(m, cx - 10, 19, 5, 7, C.A, C.K)
  fill(m, cx - 9, 20, 3, 4, C.B)
  set(m, cx - 8, 21, C.Z)
  outline(m, cx - 9, 24, 3, 4, C.A, C.K)
  legs(m, cx, 26, C.B)
  fill(m, cx - 4, 25, 9, 2, C.T)
  return m
}

function drawSakamatik() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 5, 9, 11, 3, C.B)
  head(m, cx, 9, C.H)
  set(m, cx - 3, 11, C.D)
  set(m, cx + 3, 11, C.D)
  fill(m, cx - 3, 13, 6, 2, C.W)
  fill(m, cx - 5, 15, 11, 10, C.Z)
  fill(m, cx - 4, 16, 3, 8, C.J)
  fill(m, cx + 2, 16, 3, 8, C.R)
  fill(m, cx - 1, 16, 3, 8, C.P)
  arm(m, cx - 7, 16, 9, C.Z)
  arm(m, cx + 6, 16, 9, C.R)
  outline(m, cx + 7, 17, 2, 8, C.B, C.X)
  fill(m, cx - 9, 18, 5, 4, C.Y)
  set(m, cx - 8, 19, C.D)
  set(m, cx - 7, 19, C.D)
  outline(m, cx - 10, 21, 3, 3, C.W, C.Y)
  legs(m, cx, 26, C.B)
  fill(m, cx - 4, 25, 9, 2, C.J)
  return m
}

function drawUzmanDoktor() {
  const m = canvas()
  const cx = 16
  head(m, cx, 8, C.H)
  fill(m, cx - 6, 14, 13, 17, C.I)
  fill(m, cx - 1, 15, 3, 12, C.R)
  arm(m, cx - 8, 16, 10, C.I)
  arm(m, cx + 7, 16, 10, C.I)
  set(m, cx - 9, 17, C.R)
  set(m, cx - 8, 18, C.R)
  set(m, cx - 7, 19, C.R)
  set(m, cx - 6, 20, C.S)
  set(m, cx - 5, 21, C.R)
  outline(m, cx + 6, 17, 6, 9, C.I, C.W)
  for (let i = 0; i < 5; i++) set(m, cx + 7, 19 + i, C.B)
  set(m, cx + 8, 21, C.R)
  set(m, cx + 9, 22, C.B)
  legs(m, cx, 31, C.B)
  fill(m, cx - 4, 30, 9, 2, C.I)
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
  writePng(draw(), path.join(OUT_DIR, `${id}.png`))
  console.log(`✓ ${id}.png`)
}

const jsonOut = path.join(__dirname, '../src/data/characterPixels.json')
fs.writeFileSync(
  jsonOut,
  JSON.stringify(Object.fromEntries(Object.entries(SPRITES).map(([id, d]) => [id, d()]))),
)
console.log(`✓ characterPixels.json`)
