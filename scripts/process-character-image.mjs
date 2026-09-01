/**
 * Normalize character PNGs: clean background removal, maximize frame fill, crisp alpha.
 * Usage: node scripts/process-character-image.mjs <input> <output>
 */

import path from 'node:path'
import sharp from 'sharp'

const SIZE = 256
const FILL_TARGET = 0.9
const ALPHA_CUTOFF = 16
const OPAQUE_ALPHA = 128

function isOpaque(pixels, pi, channels) {
  return pixels[pi * channels + 3] >= OPAQUE_ALPHA
}

function isEmpty(pixels, pi, channels) {
  return pixels[pi * channels + 3] < OPAQUE_ALPHA
}

const NEIGHBORS_8 = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
]

function colorDist(r, g, b, br, bg, bb) {
  return Math.hypot(r - br, g - bg, b - bb)
}

function detectBackground(pixels, width, height, channels) {
  const samples = []
  const sample = (x, y) => {
    const i = (y * width + x) * channels
    samples.push([pixels[i], pixels[i + 1], pixels[i + 2]])
  }

  for (let x = 0; x < width; x += Math.max(1, Math.floor(width / 10))) {
    sample(x, 0)
    sample(x, height - 1)
  }
  for (let y = 0; y < height; y += Math.max(1, Math.floor(height / 10))) {
    sample(0, y)
    sample(width - 1, y)
  }

  const avg = [0, 0, 0]
  for (const [r, g, b] of samples) {
    avg[0] += r
    avg[1] += g
    avg[2] += b
  }
  return avg.map((v) => v / samples.length)
}

function floodFillBackground(pixels, width, height, channels, bg, tolerance) {
  const visited = new Uint8Array(width * height)
  const queue = []

  const isBgLike = (idx) =>
    colorDist(pixels[idx], pixels[idx + 1], pixels[idx + 2], bg[0], bg[1], bg[2]) <=
    tolerance

  const push = (x, y) => {
    const pi = y * width + x
    if (visited[pi]) return
    const idx = pi * channels
    if (!isBgLike(idx)) return
    visited[pi] = 1
    queue.push(pi)
  }

  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }

  while (queue.length) {
    const pi = queue.pop()
    pixels[pi * channels + 3] = 0

    const x = pi % width
    const y = (pi / width) | 0
    if (x > 0) push(x - 1, y)
    if (x < width - 1) push(x + 1, y)
    if (y > 0) push(x, y - 1)
    if (y < height - 1) push(x, y + 1)
  }
}

function isFogPixel(r, g, b) {
  const lum = (r + g + b) / 3
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const sat = max === 0 ? 0 : (max - min) / max

  const isGrayFog = sat < 0.14 && lum > 20 && lum < 185

  const isTealFog =
    sat < 0.3 && g >= r - 10 && g >= b - 10 && lum >= 28 && lum <= 135

  const isDarkGroundMist =
    sat < 0.24 && lum >= 28 && lum <= 78 && r >= g - 15 && r >= b - 15

  return isGrayFog || isTealFog || isDarkGroundMist
}

function isDarkEdgeMist(r, g, b) {
  const lum = (r + g + b) / 3
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const sat = max === 0 ? 0 : (max - min) / max

  const isDarkMist = lum < 102 && sat < 0.34
  const isLightTanMist =
    lum >= 100 && lum <= 168 && sat < 0.27 && r >= g - 22 && r >= b - 22

  return isDarkMist || isLightTanMist
}

function peelEdgeLayers(pixels, width, height, channels, shouldPeel, maxPasses = 32) {
  for (let pass = 0; pass < maxPasses; pass++) {
    const toClear = []

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pi = y * width + x
        const idx = pi * channels
        if (pixels[idx + 3] < ALPHA_CUTOFF) continue

        let touchesTransparent = false
        for (const [dx, dy] of NEIGHBORS_8) {
          const nx = x + dx
          const ny = y + dy
          if (
            nx < 0 ||
            ny < 0 ||
            nx >= width ||
            ny >= height ||
            pixels[(ny * width + nx) * channels + 3] < ALPHA_CUTOFF
          ) {
            touchesTransparent = true
            break
          }
        }

        if (!touchesTransparent) continue

        const r = pixels[idx]
        const g = pixels[idx + 1]
        const b = pixels[idx + 2]
        if (shouldPeel(r, g, b)) {
          toClear.push(pi)
        }
      }
    }

    if (toClear.length === 0) break

    for (const pi of toClear) {
      pixels[pi * channels + 3] = 0
    }
  }
}

function neighborTouchesTransparent(pixels, width, height, channels, x, y) {
  for (const [dx, dy] of NEIGHBORS_8) {
    const nx = x + dx
    const ny = y + dy
    if (
      nx < 0 ||
      ny < 0 ||
      nx >= width ||
      ny >= height ||
      pixels[(ny * width + nx) * channels + 3] < ALPHA_CUTOFF
    ) {
      return true
    }
  }
  return false
}

function peelMistByInteriorContrast(
  pixels,
  width,
  height,
  channels,
  bg,
  maxPasses = 14,
) {
  for (let pass = 0; pass < maxPasses; pass++) {
    const toClear = []

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pi = y * width + x
        const idx = pi * channels
        if (pixels[idx + 3] < ALPHA_CUTOFF) continue
        if (!neighborTouchesTransparent(pixels, width, height, channels, x, y)) {
          continue
        }

        const r = pixels[idx]
        const g = pixels[idx + 1]
        const b = pixels[idx + 2]
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const sat = max === 0 ? 0 : (max - min) / max

        const saturatedNeighbors = []
        for (const [dx, dy] of NEIGHBORS_8) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          const ni = ny * width + nx
          if (pixels[ni * channels + 3] < ALPHA_CUTOFF) continue
          const nidx = ni * channels
          const nr = pixels[nidx]
          const ng = pixels[nidx + 1]
          const nb = pixels[nidx + 2]
          const nMax = Math.max(nr, ng, nb)
          const nMin = Math.min(nr, ng, nb)
          const nSat = nMax === 0 ? 0 : (nMax - nMin) / nMax
          if (nSat > sat + 0.05) {
            saturatedNeighbors.push([nr, ng, nb, nSat])
          }
        }

        if (saturatedNeighbors.length < 2) continue

        const avg = [0, 0, 0]
        let interiorSat = 0
        for (const [ir, ig, ib, iSat] of saturatedNeighbors) {
          avg[0] += ir
          avg[1] += ig
          avg[2] += ib
          interiorSat += iSat
        }
        avg[0] /= saturatedNeighbors.length
        avg[1] /= saturatedNeighbors.length
        avg[2] /= saturatedNeighbors.length
        interiorSat /= saturatedNeighbors.length

        const washedOut = sat + 0.12 < interiorSat && sat < 0.28

        if (washedOut) {
          toClear.push(pi)
        }
      }
    }

    if (toClear.length === 0) break

    for (const pi of toClear) {
      pixels[pi * channels + 3] = 0
    }
  }
}

function stripFoggyEdges(pixels, width, height, channels) {
  peelEdgeLayers(pixels, width, height, channels, isFogPixel, 20)
  peelEdgeLayers(pixels, width, height, channels, isDarkEdgeMist, 10)
  peelMistByInteriorContrast(pixels, width, height, channels, [0, 0, 0], 16)

  solidifyAlpha(pixels, channels)
  repairCharacterPixels(pixels, width, height, channels)
  removeOuterFringe(pixels, width, height, channels, [0, 0, 0])
}

function removeOuterFringe(pixels, width, height, channels, bg) {
  const bgLum = (bg[0] + bg[1] + bg[2]) / 3

  for (let pass = 0; pass < 5; pass++) {
    const toClear = []

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pi = y * width + x
        const idx = pi * channels
        if (pixels[idx + 3] < ALPHA_CUTOFF) continue

        let touchesTransparent = false
        for (const [dx, dy] of NEIGHBORS_8) {
          const nx = x + dx
          const ny = y + dy
          if (
            nx < 0 ||
            ny < 0 ||
            nx >= width ||
            ny >= height ||
            pixels[(ny * width + nx) * channels + 3] < ALPHA_CUTOFF
          ) {
            touchesTransparent = true
            break
          }
        }

        if (!touchesTransparent) continue

        const r = pixels[idx]
        const g = pixels[idx + 1]
        const b = pixels[idx + 2]
        const dist = colorDist(r, g, b, bg[0], bg[1], bg[2])
        const lum = (r + g + b) / 3
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const sat = max === 0 ? 0 : (max - min) / max

        const isBgLike = dist < 36
        const isLightHalo = lum > 195 && sat < 0.28 && dist < 68
        const isDarkHalo = bgLum < 70 && lum < 88 && dist < 62

        if (isBgLike || isLightHalo || isDarkHalo) {
          toClear.push(pi)
        }
      }
    }

    if (toClear.length === 0) break

    for (const pi of toClear) {
      pixels[pi * channels + 3] = 0
    }
  }
}

function solidifyAlpha(pixels, channels) {
  for (let i = 0; i < pixels.length; i += channels) {
    pixels[i + 3] = pixels[i + 3] >= ALPHA_CUTOFF ? 255 : 0
  }
}

function markExteriorTransparent(pixels, width, height, channels) {
  const exterior = new Uint8Array(width * height)
  const queue = []

  const pushExterior = (pi) => {
    if (exterior[pi]) return
    exterior[pi] = 1
    queue.push(pi)
  }

  for (let x = 0; x < width; x++) {
    const top = x
    const bottom = (height - 1) * width + x
    if (isEmpty(pixels, top, channels)) pushExterior(top)
    if (isEmpty(pixels, bottom, channels)) pushExterior(bottom)
  }
  for (let y = 0; y < height; y++) {
    const left = y * width
    const right = y * width + width - 1
    if (isEmpty(pixels, left, channels)) pushExterior(left)
    if (isEmpty(pixels, right, channels)) pushExterior(right)
  }

  while (queue.length) {
    const pi = queue.pop()
    const x = pi % width
    const y = (pi / width) | 0

    for (const [dx, dy] of NEIGHBORS_8) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
      const ni = ny * width + nx
      if (!exterior[ni] && isEmpty(pixels, ni, channels)) {
        pushExterior(ni)
      }
    }
  }

  return exterior
}

function fillInteriorHoles(pixels, width, height, channels) {
  const exterior = markExteriorTransparent(pixels, width, height, channels)

  for (let pi = 0; pi < width * height; pi++) {
    if (exterior[pi] || isOpaque(pixels, pi, channels)) continue

    let r = 0
    let g = 0
    let b = 0
    let count = 0

    const x = pi % width
    const y = (pi / width) | 0
    for (const [dx, dy] of NEIGHBORS_8) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
      const ni = ny * width + nx
      if (!isOpaque(pixels, ni, channels)) continue
      const idx = ni * channels
      r += pixels[idx]
      g += pixels[idx + 1]
      b += pixels[idx + 2]
      count++
    }

    if (count === 0) continue

    const idx = pi * channels
    pixels[idx] = Math.round(r / count)
    pixels[idx + 1] = Math.round(g / count)
    pixels[idx + 2] = Math.round(b / count)
    pixels[idx + 3] = 255
  }
}

function fillSpeckleHoles(pixels, width, height, channels) {
  for (let pass = 0; pass < 4; pass++) {
    const fills = []

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pi = y * width + x
        if (isOpaque(pixels, pi, channels)) continue

        let r = 0
        let g = 0
        let b = 0
        let count = 0

        for (const [dx, dy] of NEIGHBORS_8) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          const ni = ny * width + nx
          if (!isOpaque(pixels, ni, channels)) continue
          const idx = ni * channels
          r += pixels[idx]
          g += pixels[idx + 1]
          b += pixels[idx + 2]
          count++
        }

        if (count >= 3) {
          fills.push({
            pi,
            r: Math.round(r / count),
            g: Math.round(g / count),
            b: Math.round(b / count),
          })
        }
      }
    }

    if (fills.length === 0) break

    for (const fill of fills) {
      const idx = fill.pi * channels
      pixels[idx] = fill.r
      pixels[idx + 1] = fill.g
      pixels[idx + 2] = fill.b
      pixels[idx + 3] = 255
    }
  }
}

function repairCharacterPixels(pixels, width, height, channels) {
  fillInteriorHoles(pixels, width, height, channels)
  fillSpeckleHoles(pixels, width, height, channels)
  solidifyAlpha(pixels, channels)
  fillInteriorHoles(pixels, width, height, channels)
  fillSpeckleHoles(pixels, width, height, channels)
}

function findContentBounds(pixels, width, height, channels) {
  let top = height
  let bottom = 0
  let left = width
  let right = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * channels + 3] >= ALPHA_CUTOFF) {
        top = Math.min(top, y)
        bottom = Math.max(bottom, y)
        left = Math.min(left, x)
        right = Math.max(right, x)
      }
    }
  }

  return { top, bottom, left, right }
}

async function processImage(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const pixels = Buffer.from(data)
  const bg = detectBackground(pixels, width, height, channels)
  const bgLum = (bg[0] + bg[1] + bg[2]) / 3
  const tolerance = bgLum > 128 ? 50 : 38

  floodFillBackground(pixels, width, height, channels, bg, tolerance)
  removeOuterFringe(pixels, width, height, channels, bg)
  solidifyAlpha(pixels, channels)
  repairCharacterPixels(pixels, width, height, channels)

  const { top, bottom, left, right } = findContentBounds(
    pixels,
    width,
    height,
    channels,
  )

  const cropW = Math.max(1, right - left + 1)
  const cropH = Math.max(1, bottom - top + 1)
  const target = Math.round(SIZE * FILL_TARGET)
  const scale = Math.min(target / cropW, target / cropH)
  const outW = Math.max(1, Math.round(cropW * scale))
  const outH = Math.max(1, Math.round(cropH * scale))
  const padX = Math.floor((SIZE - outW) / 2)
  const padY = Math.floor((SIZE - outH) / 2)

  const scaled = await sharp(pixels, {
    raw: { width, height, channels },
  })
    .extract({ left, top, width: cropW, height: cropH })
    .resize(outW, outH, {
      kernel: sharp.kernel.nearest,
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const canvas = Buffer.alloc(SIZE * SIZE * 4, 0)
  for (let y = 0; y < scaled.info.height; y++) {
    for (let x = 0; x < scaled.info.width; x++) {
      const src = (y * scaled.info.width + x) * 4
      const dst = ((y + padY) * SIZE + (x + padX)) * 4
      canvas[dst] = scaled.data[src]
      canvas[dst + 1] = scaled.data[src + 1]
      canvas[dst + 2] = scaled.data[src + 2]
      canvas[dst + 3] = scaled.data[src + 3]
    }
  }

  solidifyAlpha(canvas, 4)
  stripFoggyEdges(canvas, SIZE, SIZE, 4)
  solidifyAlpha(canvas, 4)

  await sharp(canvas, {
    raw: { width: SIZE, height: SIZE, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath)

  console.log(`Wrote ${path.basename(outputPath)} (${outW}x${outH} in ${SIZE}x${SIZE})`)
}

async function repairImage(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = Buffer.from(data)
  stripFoggyEdges(pixels, info.width, info.height, info.channels)
  solidifyAlpha(pixels, info.channels)

  await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath)

  console.log(`Repaired ${path.basename(outputPath)}`)
}

const [input, output, ...rest] = process.argv.slice(2)
if (input === '--repair') {
  const files = output ? [output, ...rest] : []
  if (files.length === 0) {
    console.error('Usage: node scripts/process-character-image.mjs --repair <file.png> [...]')
    process.exit(1)
  }
  for (const file of files) {
    await repairImage(file, file)
  }
} else if (!input || !output) {
  console.error('Usage: node scripts/process-character-image.mjs <input> <output>')
  console.error('       node scripts/process-character-image.mjs --repair <file.png> [...]')
  process.exit(1)
} else {
  await processImage(input, output)
}
