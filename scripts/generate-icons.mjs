import { writeFileSync, mkdirSync } from 'fs'
import { createCanvas } from 'canvas'

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Fond bleu iOS
  ctx.fillStyle = '#007AFF'
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, size * 0.22)
  ctx.fill()

  // Pin GPS blanc
  const cx = size / 2
  const cy = size * 0.42
  const r = size * 0.22

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI)
  ctx.lineTo(cx + r * 0.7, cy + r * 1.2)
  ctx.lineTo(cx, cy + r * 2.2)
  ctx.lineTo(cx - r * 0.7, cy + r * 1.2)
  ctx.closePath()
  ctx.fill()

  // Trou dans le pin
  ctx.fillStyle = '#007AFF'
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.4, 0, 2 * Math.PI)
  ctx.fill()

  writeFileSync(`public/icons/${filename}`, canvas.toBuffer('image/png'))
  console.log(`✓ Generated ${filename} (${size}x${size})`)
}

mkdirSync('public/icons', { recursive: true })
generateIcon(192, 'icon-192.png')
generateIcon(512, 'icon-512.png')
generateIcon(180, 'apple-touch-icon.png')
