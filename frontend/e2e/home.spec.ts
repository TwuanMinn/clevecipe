import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should load homepage with proper title', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Clevcipe/);
    });

    test('should display greeting and user stats', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(500);

        // Check for greeting
        const greeting = page.locator('text=/Good Morning|Good Afternoon|Good Evening|Hello/i');
        await expect(greeting.first()).toBeVisible();

        // Check for macro goals card
        const macroCard = page.locator('text=/Daily Macros|Protein|Carbs|Fat/i');
        await expect(macroCard.first()).toBeVisible();
    });

    test('should display recipe feed in 2-column grid', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000);

        // Check for recipe cards
        const recipeCards = page.locator('a[href^="/recipe/"]');
        const cardCount = await recipeCards.count();

        expect(cardCount).toBeGreaterThan(0);

        // Verify grid layout (check if cards are displayed side by side)
        if (cardCount >= 2) {
            const firstCard = recipeCards.nth(0);
            const secondCard = recipeCards.nth(1);

            const firstBox = await firstCard.boundingBox();
            const secondBox = await secondCard.boundingBox();

            // Cards should be on the same row (similar Y position)
            if (firstBox && secondBox) {
                const yDifference = Math.abs(firstBox.y - secondBox.y);
                expect(yDifference).toBeLessThan(50); // Should be roughly aligned
            }
        }
    });

    test('should display category filters', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(500);

        // Check for filter chips
        const filters = page.locator('button:has-text("For You"), button:has-text("Breakfast"), button:has-text("High Protein")');
        await expect(filters.first()).toBeVisible();
    });

    test('should navigate to recipe detail page when clicking a card', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000);

        // Click first recipe card
        const firstRecipe = page.locator('a[href^="/recipe/"]').first();
        if (await firstRecipe.isVisible()) {
            await firstRecipe.click();
            await page.waitForTimeout(500);

            // Should navigate to recipe detail page
            await expect(page).toHaveURL(/\/recipe\/.+/);
        }
    });

    test('should have functional bottom navigation', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(500);

        // Check for bottom nav items
        const navItems = page.locator('nav a, nav button').filter({
            hasText: /Home|Generate|Plan|Profile|Shop/i
        });

        const navCount = await navItems.count();
        expect(navCount).toBeGreaterThan(0);

        // Try clicking profile nav
        const profileNav = page.locator('a[href="/profile"], button:has-text("Profile")').first();
        if (await profileNav.isVisible()) {
            await profileNav.click();
            await page.waitForTimeout(500);
            await expect(page).toHaveURL(/\/profile/);
        }
    });

    test('should display search button in header', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(500);

        // Check for search link/button
        const searchButton = page.locator('a[href="/search"], button:has-text("Search")');
        await expect(searchButton.first()).toBeVisible();
    });
});
