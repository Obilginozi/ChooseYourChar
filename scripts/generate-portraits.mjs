/**
 * Full-body pixel portraits — 160×240 logical → 1280×1920 PNG (K=5 from 32×48 design grid).
 * Run: node scripts/generate-portraits.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../public/assets/characters')

const K = 5
const LOGICAL_W = 32
const LOGICAL_H = 48
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
}

function canvas() {
  return Array.from({ length: OUT_H }, () => Array(OUT_W).fill(null))
}

function set(m, x, y, color) {
  if (!color || x < 0 || x >= LOGICAL_W || y < 0 || y >= LOGICAL_H) return
  for (let dy = 0; dy < K; dy++) {
    for (let dx = 0; dx < K; dx++) {
      const px = x * K + dx
      const py = y * K + dy
      if (px < OUT_W && py < OUT_H) m[py][px] = color
    }
  }
}

function fill(m, x, y, w, h, color) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++) set(m, x + dx, y + dy, color)
}

function fillPx(m, x, y, w, h, color) {
  for (let py = y; py < y + h; py++)
    for (let px = x; px < x + w; px++)
      if (px >= 0 && px < OUT_W && py >= 0 && py < OUT_H && color) m[py][px] = color
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

function body(m, cx, y, w, h, color) {
  fill(m, cx - Math.floor(w / 2), y, w, h, color)
}

function stripedShirt(m, cx, y, w, h, c1, c2, stripe = 2) {
  const left = cx - Math.floor(w / 2)
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      set(m, left + col, y + row, Math.floor(col / stripe) % 2 === 0 ? c1 : c2)
    }
  }
}

/** Open book in hands */
function drawOpenBook(m, x, y) {
  fill(m, x, y, 4, 7, C.W)
  fill(m, x + 4, y, 4, 7, C.W)
  fill(m, x + 1, y + 1, 2, 5, C.p)
  fill(m, x + 5, y + 1, 2, 5, C.p)
  fill(m, x + 3, y, 1, 7, C.M)
  fill(m, x + 4, y, 1, 7, C.M)
  for (let i = 0; i < 4; i++) {
    set(m, x + 1, y + 2 + i, C.S)
    set(m, x + 5, y + 2 + i, C.S)
  }
}

/** Bookshelf on the right */
function drawBookshelf(m, x0, y0) {
  outline(m, x0, y0, 11, 30, C.M, '#4A2C17')
  fill(m, x0 + 1, y0 + 9, 9, 1, C.M)
  fill(m, x0 + 1, y0 + 19, 9, 1, C.M)
  const books = [
    [2, 2, 2, 7, C.R],
    [4, 1, 2, 8, C.Z],
    [6, 2, 2, 7, C.G],
    [8, 1, 2, 8, C.Y],
    [2, 11, 3, 8, C.P],
    [5, 10, 2, 9, C.O],
    [7, 11, 3, 8, C.T],
    [2, 21, 2, 8, C.N],
    [4, 20, 3, 9, C.M],
    [7, 21, 3, 8, C.R],
  ]
  for (const [bx, by, bw, bh, col] of books) fill(m, x0 + bx, y0 + by, bw, bh, col)
}

/** Stethoscope around neck */
function drawStethoscope(m, cx, y) {
  fill(m, cx - 7, y, 3, 3, C.X)
  fill(m, cx + 5, y, 3, 3, C.X)
  fill(m, cx - 6, y + 1, 2, 2, C.R)
  fill(m, cx + 6, y + 1, 2, 2, C.R)
  fill(m, cx - 2, y + 2, 5, 2, C.R)
  fill(m, cx - 1, y + 4, 3, 8, C.R)
  fill(m, cx - 3, y + 11, 7, 2, C.R)
  outline(m, cx - 2, y + 13, 5, 5, C.X, C.R)
  fill(m, cx - 1, y + 15, 3, 2, C.S)
}

/** Drum kit on the right */
function drawDrumKit(m, x0, y0) {
  fill(m, x0 + 9, y0, 1, 14, C.X)
  fill(m, x0 + 7, y0 - 1, 5, 2, C.O)
  fill(m, x0 + 6, y0 - 2, 7, 1, C.Y)
  fill(m, x0 + 3, y0 + 5, 1, 12, C.X)
  fill(m, x0 + 10, y0 + 3, 1, 10, C.X)
  outline(m, x0 - 1, y0 + 14, 11, 8, C.B, C.D)
  fill(m, x0 + 1, y0 + 15, 7, 6, C.R)
  fill(m, x0 + 2, y0 + 16, 5, 4, C.W)
  outline(m, x0 + 2, y0 + 9, 7, 5, C.B, C.O)
  fill(m, x0 + 3, y0 + 10, 5, 3, C.W)
  fill(m, x0 + 8, y0 + 7, 5, 2, C.O)
  fill(m, x0 + 7, y0 + 6, 7, 1, C.Y)
  fill(m, x0 + 11, y0 + 10, 4, 4, C.B)
  fill(m, x0 + 12, y0 + 11, 2, 2, C.R)
}

/** Laptop + desk monitor */
function drawTechDesk(m, x0, y0) {
  outline(m, x0, y0, 11, 8, C.B, C.D)
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 6; c++)
      set(m, x0 + 2 + c, y0 + 2 + r, r < 2 ? C.Z : C.J)
  fill(m, x0 + 4, y0 + 8, 3, 3, C.X)
  fill(m, x0 + 2, y0 + 11, 7, 1, C.X)
  outline(m, x0 - 2, y0 + 12, 15, 2, C.B, C.V)
}

/** Prayer beads */
function drawTesbih(m, x, y, len) {
  for (let i = 0; i < len; i++) {
    set(m, x, y + i, i % 3 === 0 ? C.Y : C.Q)
    set(m, x + 1, y + i, C.Y)
  }
  fill(m, x, y + len, 2, 3, C.Y)
}

/** Stack of books */
function drawBookStack(m, x, y) {
  fill(m, x, y + 6, 6, 2, C.R)
  fill(m, x + 1, y + 4, 5, 2, C.Z)
  fill(m, x, y + 2, 6, 2, C.G)
  fill(m, x + 1, y, 5, 2, C.M)
}

/** Chalkboard */
function drawChalkboard(m, x0, y0) {
  outline(m, x0, y0, 11, 14, C.M, C.G)
  fill(m, x0 + 2, y0 + 3, 7, 1, C.W)
  fill(m, x0 + 2, y0 + 6, 5, 1, C.W)
  fill(m, x0 + 2, y0 + 9, 6, 1, C.W)
  fill(m, x0 + 1, y0 + 14, 9, 2, C.M)
}

/** Dumbbells */
function drawDumbbell(m, x, y) {
  fill(m, x, y + 2, 3, 4, C.X)
  fill(m, x + 3, y + 3, 5, 2, C.X)
  fill(m, x + 8, y + 2, 3, 4, C.X)
  fill(m, x, y + 3, 2, 2, C.B)
  fill(m, x + 9, y + 3, 2, 2, C.B)
}

/** Backpack + camera */
function drawTravelGear(m, x0, y0) {
  outline(m, x0, y0, 8, 12, C.A, '#8B6914')
  fill(m, x0 + 2, y0 + 2, 4, 3, C.T)
  fill(m, x0 + 1, y0 + 6, 6, 4, C.A)
  outline(m, x0 + 9, y0 + 4, 5, 4, C.B, C.D)
  fill(m, x0 + 10, y0 + 5, 3, 2, C.Z)
  fill(m, x0 + 9, y0 + 3, 5, 1, C.X)
}

/** Microphone + spotlight */
function drawStageProps(m, x0, y0) {
  fill(m, x0, y0, 2, 10, C.X)
  fill(m, x0 - 1, y0 + 10, 4, 3, C.X)
  fill(m, x0 - 2, y0, 5, 4, C.D)
  fill(m, x0 - 1, y0 + 1, 3, 2, C.X)
  fill(m, x0 + 5, y0 - 4, 8, 6, C.Y)
  fill(m, x0 + 6, y0 - 3, 6, 4, '#FFF8DC')
}

/** Soccer ball — pixel coords */
function drawSoccerBallPx(m, cx, cy, r) {
  fillPx(m, cx - r, cy - r, r * 2, r * 2, C.W)
  const blk = (x, y, w, h) => fillPx(m, x, y, w, h, C.B)
  blk(cx - 5, cy - r + 5, 10, 7)
  blk(cx - r + 5, cy - 5, 7, 10)
  blk(cx + r - 12, cy - 5, 7, 10)
  blk(cx - 12, cy + 3, 10, 7)
  blk(cx + 2, cy + 3, 10, 7)
  blk(cx - 5, cy - 8, 10, 6)
  fillPx(m, cx - 4, cy - 4, 8, 8, C.B)
}

function drawFilozof() {
  const m = canvas()
  const cx = 10
  fill(m, cx - 4, 5, 9, 3, C.H)
  head(m, cx, 7, C.H)
  fill(m, cx - 4, 10, 8, 4, C.H)
  body(m, cx, 15, 11, 16, C.U)
  fill(m, cx - 6, 16, 2, 12, C.U)
  fill(m, cx + 5, 17, 2, 10, C.U)
  arm(m, cx - 7, 17, 5, C.U)
  arm(m, cx + 5, 18, 4, C.U)
  drawOpenBook(m, cx - 10, 19)
  legs(m, cx, 31, C.U, C.k)
  drawBookshelf(m, 20, 4)
  return m
}

function drawMuhendis() {
  const m = canvas()
  const cx = 10
  fill(m, cx - 5, 3, 11, 4, C.O)
  fill(m, cx - 1, 2, 3, 2, C.O)
  head(m, cx, 8, C.H)
  fill(m, cx - 5, 14, 10, 12, C.V)
  fill(m, cx - 4, 15, 8, 2, C.O)
  arm(m, cx - 7, 16, 8, C.V)
  arm(m, cx + 5, 15, 5, C.V)
  outline(m, cx + 2, 16, 7, 6, C.B, C.D)
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++)
      set(m, cx + 3 + c, 17 + r, r === 0 ? C.Z : C.J)
  legs(m, cx, 28, C.B)
  drawTechDesk(m, 19, 8)
  return m
}

function drawImam() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 7, 0, 15, 10, C.W)
  fill(m, cx - 3, 0, 7, 3, C.Y)
  fill(m, cx - 1, -1, 3, 2, C.Y)
  head(m, cx, 9, C.H)
  fill(m, cx - 7, 14, 15, 17, C.G)
  fill(m, cx - 6, 15, 13, 4, C.Y)
  arm(m, cx - 9, 17, 10, C.G)
  arm(m, cx + 8, 17, 10, C.G)
  drawTesbih(m, cx + 10, 17, 11)
  legs(m, cx, 31, C.G, C.k)
  return m
}

function drawAkademisyen() {
  const m = canvas()
  const cx = 10
  fill(m, cx - 7, 3, 15, 4, C.M)
  fill(m, cx - 2, 2, 5, 3, C.Y)
  fill(m, cx, 1, 1, 4, C.Y)
  head(m, cx, 8, C.H)
  set(m, cx - 3, 10, C.E)
  set(m, cx - 2, 10, C.W)
  set(m, cx + 2, 10, C.E)
  set(m, cx + 3, 10, C.W)
  fill(m, cx - 5, 14, 11, 17, C.M)
  fill(m, cx - 4, 15, 9, 3, C.Y)
  arm(m, cx - 7, 16, 9, C.M)
  arm(m, cx + 6, 16, 9, C.M)
  drawBookStack(m, cx - 12, 20)
  legs(m, cx, 31, C.B)
  drawChalkboard(m, 20, 6)
  return m
}

function drawMuzisyen() {
  const m = canvas()
  const cx = 9
  fill(m, cx - 6, 6, 13, 4, C.P)
  fill(m, cx - 7, 8, 2, 4, C.P)
  fill(m, cx + 5, 8, 2, 4, C.P)
  head(m, cx, 9, C.H)
  fill(m, cx - 4, 14, 9, 9, C.L)
  arm(m, cx - 7, 15, 6, C.L)
  arm(m, cx + 5, 14, 6, C.L)
  fill(m, cx - 9, 14, 2, 8, C.D)
  fill(m, cx - 8, 13, 1, 2, C.X)
  set(m, cx - 8, 16, C.K)
  set(m, cx + 7, 15, C.K)
  fill(m, cx - 2, 20, 5, 2, C.R)
  legs(m, cx, 30, C.B)
  drawDrumKit(m, 17, 5)
  return m
}

function drawFenerbahceli() {
  const m = canvas()
  const cx = 13
  fill(m, cx - 5, 3, 11, 4, C.F)
  fill(m, cx - 1, 2, 3, 2, C.F)
  head(m, cx, 9, C.H)
  stripedShirt(m, cx, 14, 12, 10, C.F, C.N, 2)
  stripedShirt(m, cx, 24, 12, 5, C.F, C.N, 2)
  fill(m, cx - 8, 14, 2, 14, C.F)
  fill(m, cx + 7, 14, 2, 14, C.N)
  arm(m, cx - 10, 16, 8, C.F)
  arm(m, cx + 9, 16, 8, C.N)
  legs(m, cx, 29, C.N)
  fill(m, cx - 4, 28, 4, 2, C.F)
  fill(m, cx + 1, 28, 4, 2, C.N)
  fill(m, cx + 3, 35, 3, 2, C.F)
  return m
}

function drawSporcu() {
  const m = canvas()
  const cx = 16
  fill(m, cx - 6, 4, 13, 3, C.R)
  fill(m, cx - 5, 5, 11, 2, C.Y)
  head(m, cx, 8, C.H)
  fill(m, cx - 5, 14, 11, 11, C.R)
  fill(m, cx - 4, 15, 9, 3, C.Y)
  arm(m, cx - 9, 15, 4, C.R)
  arm(m, cx + 8, 15, 4, C.R)
  drawDumbbell(m, cx - 14, 12)
  drawDumbbell(m, cx + 10, 12)
  legs(m, cx, 27, C.B)
  fill(m, cx - 3, 27, 7, 2, C.R)
  return m
}

function drawGezgin() {
  const m = canvas()
  const cx = 11
  fill(m, cx - 8, 3, 17, 5, C.A)
  fill(m, cx - 2, 2, 5, 2, C.A)
  head(m, cx, 9, C.H)
  fill(m, cx - 4, 14, 9, 12, C.T)
  arm(m, cx - 7, 15, 9, C.T)
  arm(m, cx + 6, 15, 7, C.T)
  legs(m, cx, 27, C.B)
  fill(m, cx - 2, 27, 5, 2, C.T)
  drawTravelGear(m, 19, 10)
  fill(m, cx - 11, 22, 5, 4, C.w)
  set(m, cx - 10, 23, C.R)
  set(m, cx - 8, 23, C.R)
  return m
}

function drawSakamatik() {
  const m = canvas()
  const cx = 11
  fill(m, cx - 6, 8, 13, 4, C.B)
  head(m, cx, 9, C.H)
  set(m, cx - 3, 11, C.D)
  set(m, cx + 3, 11, C.D)
  fill(m, cx - 4, 13, 8, 2, C.W)
  fill(m, cx - 5, 15, 11, 11, C.Z)
  fill(m, cx - 4, 16, 9, 2, C.R)
  arm(m, cx - 7, 16, 8, C.Z)
  arm(m, cx + 6, 16, 8, C.R)
  fill(m, cx + 7, 14, 2, 6, C.D)
  fill(m, cx + 6, 13, 4, 2, C.X)
  legs(m, cx, 27, C.B)
  drawStageProps(m, 20, 4)
  return m
}

function drawUzmanDoktor() {
  const m = canvas()
  const cx = 16
  head(m, cx, 8, C.H)
  fill(m, cx - 6, 14, 13, 17, C.I)
  fill(m, cx - 5, 15, 11, 3, C.Z)
  arm(m, cx - 8, 16, 10, C.I)
  arm(m, cx + 7, 16, 10, C.I)
  drawStethoscope(m, cx, 12)
  outline(m, cx + 8, 20, 5, 7, C.W, C.I)
  fill(m, cx + 9, 21, 3, 1, C.R)
  fill(m, cx + 9, 23, 3, 1, C.R)
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

function postProcess(id, m) {
  switch (id) {
    case 'fenerbahceli': {
      drawSoccerBallPx(m, 118, OUT_H - 58, 30)
      fillPx(m, 4, OUT_H - 12, OUT_W - 8, 12, C.k)
      fillPx(m, 105, OUT_H - 14, 36, 8, C.S)
      break
    }
    default:
      break
  }
}

function buildSprite(draw, id) {
  const m = draw()
  postProcess(id, m)
  return m
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
  writePng(buildSprite(draw, id), path.join(OUT_DIR, `${id}.png`))
  console.log(`✓ ${id}.png (${OUT_W}×${OUT_H} → ${OUT_W * SCALE}×${OUT_H * SCALE})`)
}
