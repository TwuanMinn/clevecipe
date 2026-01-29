import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should load homepage', async ({ page }) => {
        await page.goto('/');

        // TODO: Add your test assertions
        await expect(page).toHaveTitle(/Clevcipe/);
    });

    test('should navigate to shop', async ({ page }) => {
        await page.goto('/');

        // TODO: Add navigation test
        // await page.click('text=Shop');
        // await expect(page).toHaveURL('/shop');
    });
});
