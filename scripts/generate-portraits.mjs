/**
 * Pixel portraits — native 384×576 canvas (64×96 ×6), PNG 2304×3456.
 * Run: node scripts/generate-portraits.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '../public/assets/characters')

const G = 6
const OUT_W = 64 * G
const OUT_H = 96 * G
const SCALE = 6

const C = {
  K: '#F5E6C8',
  Kl: '#FFF4E0',
  Kd: '#D4B898',
  S: '#D4A574',
  H: '#6B4428',
  Hl: '#9A6838',
  Hd: '#4A2E18',
  E: '#243850',
  W: '#FFFFFF',
  B: '#4A6088',
  Bl: '#6E88AA',
  Bd: '#354E68',
  R: '#D04040',
  Rl: '#F06060',
  Rd: '#A02828',
  G: '#3A8A62',
  Gl: '#52B080',
  Gd: '#286848',
  Y: '#FFD700',
  Yl: '#FFEC60',
  Yd: '#C8A800',
  O: '#FF9A20',
  N: '#2858A0',
  Nl: '#4080D0',
  Nd: '#1A3870',
  F: '#FFED00',
  Fl: '#FFF860',
  Fd: '#D4C800',
  P: '#B070D0',
  Pl: '#D090F0',
  Pd: '#8850A8',
  V: '#5A90B0',
  Vl: '#78B0D0',
  Vd: '#406880',
  L: '#8850A8',
  Ll: '#A870C8',
  Ld: '#603880',
  T: '#30C8A8',
  Tl: '#50E8C8',
  Td: '#209878',
  A: '#D4A574',
  Al: '#F0C898',
  Ad: '#A88050',
  M: '#9A4038',
  Ml: '#C05850',
  Md: '#702820',
  I: '#F4F8FA',
  Il: '#FFFFFF',
  Id: '#D0D8E0',
  X: '#A0A8B8',
  Xl: '#C8D0E0',
  Xd: '#788090',
  D: '#2E4060',
  Dl: '#4A6090',
  Dd: '#1E2A40',
  U: '#D4B070',
  Ul: '#F0D090',
  Ud: '#A88850',
  Q: '#F4D03F',
  J: '#40D880',
  Z: '#48B0E8',
  k: '#A88030',
  kl: '#C8A050',
  kd: '#806020',
  p: '#F0E0C0',
  w: '#F8F8F8',
  wood: '#7A5030',
  woodl: '#A07048',
  woodd: '#503018',
  ink: '#1E2838',
  rim: '#90A4C0',
}

const SHADE = {
  [C.K]: { l: C.Kl, d: C.Kd },
  [C.H]: { l: C.Hl, d: C.Hd },
  [C.B]: { l: C.Bl, d: C.Bd },
  [C.N]: { l: C.Nl, d: C.Nd },
  [C.G]: { l: C.Gl, d: C.Gd },
  [C.R]: { l: C.Rl, d: C.Rd },
  [C.V]: { l: C.Vl, d: C.Vd },
  [C.U]: { l: C.Ul, d: C.Ud },
  [C.I]: { l: C.Il, d: C.Id },
  [C.L]: { l: C.Ll, d: C.Ld },
  [C.M]: { l: C.Ml, d: C.Md },
  [C.T]: { l: C.Tl, d: C.Td },
  [C.A]: { l: C.Al, d: C.Ad },
  [C.P]: { l: C.Pl, d: C.Pd },
  [C.D]: { l: C.Dl, d: C.Dd },
  [C.X]: { l: C.Xl, d: C.Xd },
  [C.k]: { l: C.kl, d: C.kd },
  [C.wood]: { l: C.woodl, d: C.woodd },
  [C.F]: { l: C.Fl, d: C.Fd },
  [C.Z]: { l: '#70C8FF', d: '#3080B8' },
  [C.O]: { l: '#FFB850', d: '#C87010' },
}

function canvas() {
  return Array.from({ length: OUT_H }, () => Array(OUT_W).fill(null))
}

function set(m, x, y, color) {
  if (!color || x < 0 || x >= OUT_W || y < 0 || y >= OUT_H) return
  m[y][x] = color
}

function fill(m, x, y, w, h, color) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++) set(m, x + dx, y + dy, color)
}

function fillB(m, x, y, w, h, color) {
  fill(m, x * G, y * G, w * G, h * G, color)
}

function shadeOf(base) {
  return SHADE[base] ?? { l: base, d: base }
}

function fillB3D(m, x, y, w, h, base) {
  const { l, d } = shadeOf(base)
  fillB(m, x, y, w, h, base)
  const t = Math.max(1, Math.floor(G / 2))
  const x0 = x * G
  const y0 = y * G
  const ww = w * G
  const hh = h * G
  fill(m, x0, y0, ww, t, l)
  fill(m, x0, y0, t, hh, l)
  fill(m, x0 + ww - t, y0, t, hh, d)
  fill(m, x0, y0 + hh - t, ww, t, d)
}

function outlineB(m, x, y, w, h, edge, inner = null) {
  const x0 = x * G
  const y0 = y * G
  const ww = w * G
  const hh = h * G
  const rim = SHADE[edge]?.l ?? edge
  if (inner) fillB3D(m, x, y, w, h, inner)
  else if (inner === null && edge) {
    /* hollow outline only */
  }
  if (inner) {
    for (let dx = 0; dx < ww; dx++) {
      set(m, x0 + dx, y0, edge)
      set(m, x0 + dx, y0 + hh - 1, rim)
    }
    for (let dy = 0; dy < hh; dy++) {
      set(m, x0, y0 + dy, rim)
      set(m, x0 + ww - 1, y0 + dy, edge)
    }
  } else {
    for (let dx = 0; dx < ww; dx++) {
      set(m, x0 + dx, y0, edge)
      set(m, x0 + dx, y0 + hh - 1, edge)
    }
    for (let dy = 0; dy < hh; dy++) {
      set(m, x0, y0 + dy, edge)
      set(m, x0 + ww - 1, y0 + dy, edge)
    }
  }
}

function applyRimLight(m) {
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]
  const bumps = []
  for (let y = 0; y < OUT_H; y++) {
    for (let x = 0; x < OUT_W; x++) {
      const c = m[y][x]
      if (!c) continue
      let touchesVoid = false
      for (const [dx, dy] of dirs) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || nx >= OUT_W || ny < 0 || ny >= OUT_H || !m[ny][nx]) {
          touchesVoid = true
          break
        }
      }
      if (touchesVoid) bumps.push([x, y, c])
    }
  }
  for (const [x, y, c] of bumps) {
    const { l } = shadeOf(c)
    if (l !== c) set(m, x, y, l)
    else set(m, x, y, C.rim)
  }
}

function finish(m) {
  applyRimLight(m)
  return m
}

function neck(m, cx, y) {
  fillB3D(m, cx - 4, y, 9, 4, C.K)
}

function head(m, cx, y, hair) {
  fillB3D(m, cx - 6, y, 13, 10, C.K)
  fillB3D(m, cx - 7, y + 2, 15, 6, C.K)
  fillB(m, cx - 2, y + 7, 5, 2, C.S)
  fillB3D(m, cx - 8, y - 3, 17, 5, hair)
  fillB3D(m, cx - 6, y - 5, 13, 3, hair)
  const px = cx * G
  const py = y * G
  fill(m, px - 14, py + 14, 7, 7, C.W)
  fill(m, px + 7, py + 14, 7, 7, C.W)
  fill(m, px - 11, py + 16, 4, 4, C.E)
  fill(m, px + 10, py + 16, 4, 4, C.E)
  set(m, px - 10, py + 17, C.ink)
  set(m, px + 11, py + 17, C.ink)
  set(m, px - 12, py + 15, C.W)
  set(m, px + 9, py + 15, C.W)
}

function legs(m, cx, y, pants, shoes = C.B) {
  fillB3D(m, cx - 6, y, 5, 16, pants)
  fillB3D(m, cx + 2, y, 5, 16, pants)
  fillB3D(m, cx - 6, y + 16, 5, 5, shoes)
  fillB3D(m, cx + 2, y + 16, 5, 5, shoes)
}

function arm(m, x, y, len, color, w = 3) {
  fillB3D(m, x, y, w, len, color)
  fillB(m, x, y + len - 2, w, 2, C.K)
}

function body(m, cx, y, w, h, color) {
  fillB3D(m, cx - Math.floor(w / 2), y, w, h, color)
}

function stripedShirt(m, cx, y, w, h, c1, c2, stripe = 3) {
  const left = (cx - Math.floor(w / 2)) * G
  const y0 = y * G
  const ww = w * G
  const hh = h * G
  const s1 = shadeOf(c1)
  const s2 = shadeOf(c2)
  for (let row = 0; row < hh; row++) {
    for (let col = 0; col < ww; col++) {
      const even = Math.floor(col / stripe) % 2 === 0
      const base = even ? c1 : c2
      const sh = even ? s1 : s2
      let colr = base
      if (col % stripe === 0) colr = sh.l
      if (col % stripe === stripe - 1) colr = sh.d
      if (row < 2) colr = sh.l
      if (row >= hh - 2) colr = sh.d
      set(m, left + col, y0 + row, colr)
    }
  }
}

// ─── Props (native 192×288 detail) ───────────────────────────────────────────

function propOpenBook(m, x, y) {
  const x0 = x * G
  const y0 = y * G
  outlineB(m, x, y, 9, 14, C.M, C.W)
  outlineB(m, x + 9, y, 9, 14, C.M, C.W)
  fill(m, x0 + G, y0 + G, 7 * G, 12 * G, C.W)
  fill(m, x0 + 10 * G, y0 + G, 7 * G, 12 * G, C.W)
  fill(m, x0 + 8 * G, y0, 2 * G, 14 * G, C.M)
  for (let i = 0; i < 12; i++) {
    fill(m, x0 + 2 * G, y0 + (3 + i) * G, 5 * G, G, C.p)
    fill(m, x0 + 11 * G, y0 + (3 + i) * G, 5 * G, G, C.p)
  }
  fill(m, x0, y0 + 13 * G, 18 * G, 2 * G, C.M)
}

function propBookshelf(m, x, y) {
  outlineB(m, x, y, 20, 72, C.woodd, C.wood)
  fillB(m, x + 1, y + 22, 18, 2, C.wood)
  fillB(m, x + 1, y + 44, 18, 2, C.wood)
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
  for (const [bx, by, bw, bh, col] of books) {
    fillB(m, x + bx, y + by, bw, bh, col)
    const bx0 = (x + bx) * G
    const by0 = (y + by) * G
    fill(m, bx0 + G, by0 + G, G, bh * G - G * 2, C.w)
  }
}

function propStethoscope(m, cx, y) {
  outlineB(m, cx - 12, y, 6, 6, C.Xd, C.X)
  outlineB(m, cx + 7, y, 6, 6, C.Xd, C.X)
  fillB(m, cx - 3, y + 5, 7, 3, C.R)
  fillB(m, cx - 2, y + 8, 5, 14, C.R)
  fillB(m, cx - 5, y + 20, 11, 3, C.R)
  outlineB(m, cx - 4, y + 23, 9, 8, C.Xd, C.X)
  fillB(m, cx - 2, y + 25, 5, 4, C.R)
  fillB(m, cx - 1, y + 27, 3, 2, C.S)
}

function propDrumKit(m, x, y) {
  fillB(m, x + 10, y, 2, 28, C.X)
  fillB(m, x + 6, y - 2, 10, 3, C.O)
  fillB(m, x + 4, y - 4, 14, 2, C.Y)
  fillB(m, x + 2, y + 8, 2, 22, C.X)
  outlineB(m, x - 2, y + 26, 18, 14, C.Bd, C.D)
  fillB(m, x + 1, y + 28, 12, 10, C.R)
  fillB(m, x + 4, y + 30, 6, 6, C.W)
  outlineB(m, x + 4, y + 14, 12, 10, C.Bd, C.O)
  fillB(m, x + 6, y + 16, 8, 6, C.W)
  fillB(m, x + 14, y + 10, 10, 3, C.O)
  fillB(m, x + 12, y + 8, 14, 2, C.Y)
  fillB(m, x + 11, y + 10, 2, 2, C.W)
  fillB(m, x + 15, y + 9, 2, 2, C.W)
}

function propSoccerBall(m, cx, cy, r) {
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) set(m, cx + dx, cy + dy, C.W)
    }
  }
  fill(m, cx - 9, cy - r + 6, 18, 15, C.ink)
  fill(m, cx - r + 6, cy - 9, 15, 18, C.ink)
  fill(m, cx + r - 21, cy - 9, 15, 18, C.ink)
  fill(m, cx - 18, cy + 6, 18, 15, C.ink)
  fill(m, cx + 3, cy + 6, 18, 15, C.ink)
  fill(m, cx - 9, cy - 15, 18, 12, C.ink)
  fill(m, cx - 6, cy - r + 8, 12, 8, C.Xd)
}

function propLaptop(m, x, y) {
  outlineB(m, x, y, 18, 12, C.B, C.D)
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 7; c++)
      fillB(m, x + 3 + c, y + 2 + r, 1, 1, r < 2 ? C.Z : C.J)
  outlineB(m, x - 1, y + 12, 22, 4, C.B, C.V)
  fillB(m, x + 8, y + 16, 4, 3, C.X)
}

function propMonitor(m, x, y) {
  outlineB(m, x, y, 20, 14, C.B, C.D)
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 8; c++)
      fillB(m, x + 4 + c, y + 3 + r, 1, 1, r < 3 ? C.Z : C.J)
  fillB(m, x + 8, y + 14, 4, 5, C.X)
  fillB(m, x + 4, y + 19, 12, 2, C.X)
  fillB(m, x + 6, y + 5, 3, 2, C.W)
}

function propTesbih(m, x, y) {
  for (let i = 0; i < 14; i++) {
    const col = i % 4 === 0 ? C.Y : C.Q
    outlineB(m, x, y + i, 3, 3, C.B, col)
  }
  outlineB(m, x - 1, y + 14, 5, 6, C.B, C.Y)
  fillB(m, x, y + 15, 3, 3, C.O)
}

function propBookStack(m, x, y) {
  outlineB(m, x, y + 14, 10, 4, C.B, C.R)
  outlineB(m, x + 1, y + 9, 9, 4, C.B, C.Z)
  outlineB(m, x, y + 4, 10, 4, C.B, C.G)
  outlineB(m, x + 1, y, 8, 4, C.B, C.M)
}

function propChalkboard(m, x, y) {
  outlineB(m, x, y, 20, 28, C.wood, C.G)
  fillB(m, x + 3, y + 6, 14, 2, C.W)
  fillB(m, x + 3, y + 12, 10, 2, C.W)
  fillB(m, x + 3, y + 18, 12, 2, C.W)
  fillB(m, x + 2, y + 28, 16, 3, C.wood)
  fillB(m, x + 5, y + 8, 2, 2, C.Y)
}

function propDumbbell(m, x, y) {
  outlineB(m, x, y + 3, 5, 8, C.B, C.X)
  fillB(m, x + 5, y + 5, 8, 4, C.X)
  outlineB(m, x + 13, y + 3, 5, 8, C.B, C.X)
  fillB(m, x + 1, y + 4, 3, 6, C.B)
  fillB(m, x + 14, y + 4, 3, 6, C.B)
}

function propBackpack(m, x, y) {
  outlineB(m, x, y, 14, 20, C.B, C.A)
  fillB(m, x + 3, y + 3, 8, 6, C.T)
  fillB(m, x + 2, y + 10, 10, 8, C.A)
  outlineB(m, x + 15, y + 4, 8, 7, C.B, C.D)
  fillB(m, x + 17, y + 6, 4, 3, C.Z)
  fillB(m, x + 16, y + 3, 6, 2, C.X)
  fillB(m, x + 4, y + 1, 6, 3, C.A)
}

function propMicrophone(m, x, y) {
  fillB(m, x, y, 3, 16, C.X)
  outlineB(m, x - 2, y + 16, 7, 4, C.B, C.X)
  outlineB(m, x - 3, y - 4, 9, 6, C.B, C.D)
  fillB(m, x - 1, y - 2, 5, 3, C.X)
  for (let i = 0; i < 4; i++) fillB(m, x - 2 + i, y - 3, 1, 1, C.W)
}

function propSpotlight(m, x, y) {
  fillB(m, x, y + 6, 3, 14, C.X)
  outlineB(m, x - 2, y + 20, 7, 4, C.B, C.X)
  fillB(m, x + 6, y, 14, 10, C.Y)
  fillB(m, x + 8, y + 2, 10, 6, '#FFFACD')
}

function propClipboard(m, x, y) {
  outlineB(m, x, y, 8, 12, C.B, C.W)
  fillB(m, x + 2, y + 2, 4, 1, C.R)
  fillB(m, x + 2, y + 5, 4, 1, C.R)
  fillB(m, x + 2, y + 8, 4, 1, C.R)
  fillB(m, x + 3, y, 2, 2, C.X)
}

function propMap(m, x, y) {
  outlineB(m, x, y, 10, 8, C.B, C.w)
  fillB(m, x + 2, y + 2, 3, 2, C.G)
  fillB(m, x + 5, y + 3, 3, 2, C.Z)
  fillB(m, x + 3, y + 5, 4, 2, C.T)
  fillB(m, x + 2, y + 1, 6, 1, C.R)
}

// ─── Characters ──────────────────────────────────────────────────────────────

function drawFilozof() {
  const m = canvas()
  const cx = 20
  fillB(m, cx - 8, 12, 16, 8, C.H)
  head(m, cx, 14, C.H)
  neck(m, cx, 24)
  fillB(m, cx - 7, 24, 14, 6, C.H)
  body(m, cx, 30, 18, 22, C.U)
  fillB(m, cx - 10, 32, 3, 18, C.U)
  fillB(m, cx + 8, 33, 3, 16, C.U)
  arm(m, cx - 13, 32, 12, C.U)
  arm(m, cx + 11, 34, 10, C.U)
  propOpenBook(m, cx - 16, 38)
  legs(m, cx, 54, C.U, C.k)
  propBookshelf(m, 42, 10)
  return finish(m)
}

function drawMuhendis() {
  const m = canvas()
  const cx = 20
  fillB(m, cx - 8, 6, 16, 6, C.O)
  fillB(m, cx - 2, 4, 5, 3, C.O)
  head(m, cx, 16, C.H)
  neck(m, cx, 26)
  body(m, cx, 30, 18, 20, C.V)
  fillB(m, cx - 6, 31, 12, 4, C.O)
  arm(m, cx - 13, 32, 11, C.V)
  arm(m, cx + 11, 30, 8, C.V)
  propLaptop(m, cx + 4, 32)
  legs(m, cx, 52, C.B)
  propMonitor(m, 42, 14)
  return finish(m)
}

function drawImam() {
  const m = canvas()
  const cx = 32
  fillB(m, cx - 10, 2, 20, 16, C.W)
  fillB(m, cx - 4, 0, 9, 5, C.Y)
  fillB(m, cx - 2, -1, 5, 2, C.Y)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  body(m, cx, 32, 22, 24, C.G)
  fillB(m, cx - 8, 33, 16, 6, C.Y)
  arm(m, cx - 14, 34, 14, C.G)
  arm(m, cx + 12, 34, 14, C.G)
  propTesbih(m, cx + 14, 36)
  legs(m, cx, 56, C.G, C.k)
  return finish(m)
}

function drawAkademisyen() {
  const m = canvas()
  const cx = 20
  fillB(m, cx - 10, 6, 20, 6, C.M)
  fillB(m, cx - 3, 4, 7, 4, C.Y)
  fillB(m, cx, 2, 2, 6, C.Y)
  head(m, cx, 16, C.H)
  neck(m, cx, 26)
  fill(m, cx * G - 5 * G, 20 * G, 2 * G, 2 * G, C.E)
  fill(m, cx * G - 3 * G, 20 * G, 2 * G, 2 * G, C.W)
  fill(m, cx * G + 3 * G, 20 * G, 2 * G, 2 * G, C.E)
  fill(m, cx * G + 5 * G, 20 * G, 2 * G, 2 * G, C.W)
  body(m, cx, 30, 20, 24, C.M)
  fillB(m, cx - 7, 31, 14, 5, C.Y)
  arm(m, cx - 14, 32, 12, C.M)
  arm(m, cx + 12, 32, 12, C.M)
  propBookStack(m, 2, 38)
  legs(m, cx, 56, C.B)
  propChalkboard(m, 42, 12)
  return finish(m)
}

function drawMuzisyen() {
  const m = canvas()
  const cx = 18
  fillB(m, cx - 9, 8, 18, 6, C.P)
  fillB(m, cx - 10, 12, 3, 5, C.P)
  fillB(m, cx + 7, 12, 3, 5, C.P)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  body(m, cx, 32, 16, 18, C.L)
  arm(m, cx - 12, 33, 10, C.L)
  arm(m, cx + 10, 32, 10, C.L)
  propMicrophone(m, cx - 16, 30)
  fillB(m, cx - 3, 42, 7, 3, C.R)
  legs(m, cx, 52, C.B)
  propDrumKit(m, 38, 10)
  return finish(m)
}

function drawFenerbahceli() {
  const m = canvas()
  const cx = 22
  fillB(m, cx - 8, 6, 16, 6, C.F)
  head(m, cx, 16, C.H)
  neck(m, cx, 26)
  stripedShirt(m, cx, 30, 18, 14, C.F, C.N, 3)
  stripedShirt(m, cx, 44, 18, 8, C.F, C.N, 3)
  fillB(m, cx - 11, 30, 3, 20, C.F)
  fillB(m, cx + 9, 30, 3, 20, C.N)
  arm(m, cx - 14, 32, 10, C.F)
  arm(m, cx + 12, 32, 10, C.N)
  legs(m, cx, 54, C.N)
  fillB(m, cx - 5, 52, 5, 3, C.F)
  fillB(m, cx + 1, 52, 5, 3, C.N)
  fill(m, 0, 88 * G, OUT_W, 8 * G, C.k)
  propSoccerBall(m, 48 * G, 82 * G, 10 * G)
  return finish(m)
}

function drawSporcu() {
  const m = canvas()
  const cx = 32
  fillB(m, cx - 10, 8, 20, 5, C.R)
  fillB(m, cx - 8, 10, 16, 3, C.Y)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  body(m, cx, 32, 18, 18, C.R)
  fillB(m, cx - 6, 33, 12, 5, C.Y)
  arm(m, cx - 14, 33, 8, C.R)
  arm(m, cx + 12, 33, 8, C.R)
  propDumbbell(m, cx - 24, 28)
  propDumbbell(m, cx + 14, 28)
  legs(m, cx, 52, C.B)
  fillB(m, cx - 5, 50, 10, 3, C.R)
  return finish(m)
}

function drawGezgin() {
  const m = canvas()
  const cx = 20
  fillB(m, cx - 12, 6, 24, 7, C.A)
  fillB(m, cx - 3, 4, 7, 3, C.A)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  body(m, cx, 32, 16, 18, C.T)
  arm(m, cx - 12, 33, 12, C.T)
  arm(m, cx + 10, 33, 10, C.T)
  propMap(m, cx - 18, 36)
  legs(m, cx, 52, C.B)
  propBackpack(m, 42, 22)
  return finish(m)
}

function drawSakamatik() {
  const m = canvas()
  const cx = 20
  fillB(m, cx - 10, 18, 20, 5, C.B)
  head(m, cx, 18, C.H)
  neck(m, cx, 28)
  fill(m, cx * G - 6 * G, 22 * G, 3 * G, 3 * G, C.D)
  fill(m, cx * G + 3 * G, 22 * G, 3 * G, 3 * G, C.D)
  fillB(m, cx - 5, 25, 10, 3, C.W)
  body(m, cx, 32, 18, 18, C.Z)
  fillB(m, cx - 6, 34, 12, 4, C.R)
  arm(m, cx - 12, 33, 10, C.Z)
  arm(m, cx + 10, 33, 10, C.R)
  propMicrophone(m, cx + 10, 28)
  legs(m, cx, 52, C.B)
  propSpotlight(m, 42, 8)
  return finish(m)
}

function drawUzmanDoktor() {
  const m = canvas()
  const cx = 32
  head(m, cx, 16, C.H)
  neck(m, cx, 26)
  body(m, cx, 30, 20, 24, C.I)
  fillB(m, cx - 7, 31, 14, 6, C.Z)
  arm(m, cx - 14, 32, 12, C.I)
  arm(m, cx + 12, 32, 12, C.I)
  propStethoscope(m, cx, 24)
  propClipboard(m, cx + 12, 38)
  legs(m, cx, 56, C.B)
  fillB(m, cx - 6, 54, 12, 4, C.I)
  return finish(m)
}

const SPRITES = {
  // All characters use custom PNG assets in public/assets/characters/
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

if (Object.keys(SPRITES).length === 0) {
  console.log('No procedural sprites configured — all characters use custom PNGs in public/assets/characters/')
} else {
  for (const [id, draw] of Object.entries(SPRITES)) {
    writePng(draw(), path.join(OUT_DIR, `${id}.png`))
    console.log(`✓ ${id}.png (${OUT_W}×${OUT_H} → ${OUT_W * SCALE}×${OUT_H * SCALE})`)
  }
}
