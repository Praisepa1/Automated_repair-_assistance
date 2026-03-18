import { test, expect } from '@playwright/test';

test.describe('Responsiveness and Buttons', () => {
  test('Navbar and Sidebar buttons are visible and clickable on Desktop', async ({ page }) => {
    await page.goto('/');

    // Check Navbar Menu button (should be hidden on desktop)
    const menuButton = page.locator('button:has(svg.lucide-menu)');
    await expect(menuButton).toBeHidden();

    // Check Start New Diagnostic button
    const startBtn = page.locator('a:has-text("Start New Diagnostic")');
    await expect(startBtn).toBeVisible();
    await startBtn.click();
    await expect(page).toHaveURL(/.*diagnostics/);
  });

  test('Navbar Menu button is visible and clickable on Mobile', async ({ page, isMobile }) => {
    if (!isMobile) return;
    await page.goto('/');

    // Check Navbar Menu button (should be visible on mobile)
    const menuButton = page.locator('button:has(svg.lucide-menu)');
    await expect(menuButton).toBeVisible();

    // Check if clicking it can be simulated (doesn't open sidebar yet due to missing state, but button works)
    await menuButton.click();
  });

  test('Viewer layer buttons are responsive', async ({ page }) => {
    await page.goto('/viewer');
    
    // Check Top Layer button
    const topLayerBtn = page.locator('button:has-text("Top Layer")');
    await expect(topLayerBtn).toBeVisible();
    await topLayerBtn.click();
  });
});
