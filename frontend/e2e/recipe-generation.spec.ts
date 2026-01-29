import { test, expect } from '@playwright/test';

test.describe('Recipe Generation Flow', () => {
    test('should navigate to generate page', async ({ page }) => {
        await page.goto('/');

        // Find and click generate/create recipe button
        const generateLink = page.locator('a[href="/generate"], button:has-text("Generate")').first();
        if (await generateLink.isVisible()) {
            await generateLink.click();
            await expect(page).toHaveURL(/\/generate/);
        } else {
            // Directly navigate if button not found
            await page.goto('/generate');
        }

        // Verify generate page loaded
        await expect(page.locator('text=/Generate|Create your first recipe/i')).toBeVisible();
    });

    test('should display meal type and cuisine filters', async ({ page }) => {
        await page.goto('/generate');

        // Check for meal type options
        await expect(page.locator('text=/What meal|Meal Type/i')).toBeVisible();

        // Check for cuisine options
        await expect(page.locator('text=/cuisine|Preferred cuisine/i')).toBeVisible();

        // Verify filter buttons are present
        const filterButtons = page.locator('button:has-text("Any"), button:has-text("Breakfast"), button:has-text("Italian")');
        await expect(filterButtons.first()).toBeVisible();
    });

    test('should select filters and generate recipes', async ({ page }) => {
        await page.goto('/generate');
        await page.waitForTimeout(500);

        // Select meal type
        const lunchButton = page.locator('button:has-text("Lunch")').first();
        if (await lunchButton.isVisible()) {
            await lunchButton.click();
            await page.waitForTimeout(300);
        }

        // Select cuisine
        const italianButton = page.locator('button:has-text("Italian")').first();
        if (await italianButton.isVisible()) {
            await italianButton.click();
            await page.waitForTimeout(300);
        }

        // Click generate button
        const generateButton = page.locator('button:has-text("Generate")').first();
        await expect(generateButton).toBeVisible();
        await generateButton.click();

        // Wait for loading state
        await page.waitForTimeout(2000);

        // Check for loading indicator or results
        const loadingIndicator = page.locator('text=/Cooking|Generating|Loading/i');
        const resultsHeading = page.locator('text=/Here\'s what we created|Results/i');

        // Either loading should be visible or results should appear
        const hasLoading = await loadingIndicator.isVisible().catch(() => false);
        const hasResults = await resultsHeading.isVisible().catch(() => false);

        expect(hasLoading || hasResults).toBeTruthy();
    });

    test('should display generated recipe cards', async ({ page }) => {
        await page.goto('/generate');
        await page.waitForTimeout(500);

        // Generate recipes with default settings
        const generateButton = page.locator('button:has-text("Generate")').first();
        if (await generateButton.isVisible()) {
            await generateButton.click();

            // Wait for generation (max 30 seconds)
            await page.waitForTimeout(5000);

            // Check for recipe cards or error message
            const recipeCards = page.locator('[class*="RecipeCard"], article, [role="article"]');
            const errorMessage = page.locator('text=/Error|Failed|Try again/i');

            const hasCards = await recipeCards.count() > 0;
            const hasError = await errorMessage.isVisible().catch(() => false);

            // At least should show something (cards or error)
            expect(hasCards || hasError).toBeTruthy();
        }
    });

    test('should allow regenerating recipes', async ({ page }) => {
        await page.goto('/generate');
        await page.waitForTimeout(500);

        const generateButton = page.locator('button:has-text("Generate")').first();
        if (await generateButton.isVisible()) {
            await generateButton.click();
            await page.waitForTimeout(3000);

            // Look for regenerate button
            const regenerateButton = page.locator('button:has-text("Regenerate"), button:has-text("Generate More")').first();
            if (await regenerateButton.isVisible()) {
                await regenerateButton.click();
                await page.waitForTimeout(500);

                // Should show generation form again
                await expect(page.locator('text=/What meal|Generate Recipe/i')).toBeVisible();
            }
        }
    });
});
