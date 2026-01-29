import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
    test('should complete onboarding wizard successfully', async ({ page }) => {
        await page.goto('/onboarding');

        // Check if onboarding page loads
        await expect(page.locator('h1')).toContainText(/Welcome|Let's get started/i);

        // Step 1: Dietary Preferences
        await expect(page.locator('text=Dietary')).toBeVisible();

        // Select dietary preference (if buttons/options are present)
        const anyDietButton = page.locator('button:has-text("Any")').first();
        if (await anyDietButton.isVisible()) {
            await anyDietButton.click();
        }

        // Click Next or Continue
        const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
        if (await nextButton.isVisible()) {
            await nextButton.click();
        }

        // Step 2: Health Goals
        await page.waitForTimeout(500);
        const goalButton = page.locator('button:has-text("Maintain"), button:has-text("Weight")').first();
        if (await goalButton.isVisible()) {
            await goalButton.click();
        }

        if (await nextButton.isVisible()) {
            await nextButton.click();
        }

        // Step 3: Taste Preferences
        await page.waitForTimeout(500);
        const tasteButton = page.locator('button').filter({ hasText: /Balanced|Mild/i }).first();
        if (await tasteButton.isVisible()) {
            await tasteButton.click();
        }

        // Complete onboarding
        const finishButton = page.locator('button:has-text("Finish"), button:has-text("Complete"), button:has-text("Get Started")').first();
        if (await finishButton.isVisible()) {
            await finishButton.click();
            await page.waitForTimeout(1000);
        }

        // Should redirect to dashboard/home
        await expect(page).toHaveURL(/\/$/);
    });

    test('should allow navigation between onboarding steps', async ({ page }) => {
        await page.goto('/onboarding');

        // Check for back button after moving forward
        const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
        if (await nextButton.isVisible()) {
            await nextButton.click();
            await page.waitForTimeout(500);

            const backButton = page.locator('button:has-text("Back"), [aria-label="Back"]').first();
            if (await backButton.isVisible()) {
                await backButton.click();
                await page.waitForTimeout(500);

                // Should be back at first step
                await expect(page.locator('text=Dietary')).toBeVisible();
            }
        }
    });
});
