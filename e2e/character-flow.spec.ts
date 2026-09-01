import { expect, test } from '@playwright/test'

test('character select → confirm → detail flow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('INSERT COIN')).toBeVisible()
  await page.getByRole('button', { name: 'Start game' }).click()

  await expect(page.getByText('SELECT CHARACTER')).toBeVisible()
  await expect(page.getByRole('button', { name: 'CONFIRM' })).toBeVisible()

  await page.getByRole('button', { name: 'CONFIRM' }).click()

  await expect(page.getByText('BACK TO SELECT')).toBeVisible({ timeout: 3000 })
  await expect(page.getByText(/Joke 1 of/)).toBeVisible()
})

test('VS screen opens from select', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Start game' }).click()
  await page.getByRole('button', { name: 'VS' }).click()
  await expect(page.getByText('VERSUS')).toBeVisible()
  await expect(page.getByText('PLAYER 1')).toBeVisible()
  await page.getByRole('button', { name: 'FIGHT!' }).click()
  await expect(page.getByText('ROUND 1')).toBeVisible()
})

test('credits screen shows analytics section', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'CREDITS & STATS' }).click()
  await expect(page.getByText('LOCAL STATS')).toBeVisible()
})
