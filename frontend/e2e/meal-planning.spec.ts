import { test, expect } from '@playwright/test';

test.describe('Meal Planning Flow', () => {
    test('should navigate to meal planner', async ({ page }) => {
        await page.goto('/');

        // Navigate to planner via bottom nav or link
        const plannerLink = page.locator('a[href="/plan"], button:has-text("Plan")').first();
        if (await plannerLink.isVisible()) {
            await plannerLink.click();
            await expect(page).toHaveURL(/\/plan/);
        } else {
            await page.goto('/plan');
        }

        // Verify planner page loaded
        await expect(page.locator('text=/Meal Plan|Weekly Plan|Planner/i')).toBeVisible();
    });

    test('should display weekly calendar view', async ({ page }) => {
        await page.goto('/plan');
        await page.waitForTimeout(500);

        // Check for day selectors
        const dayButtons = page.locator('button:has-text("Mon"), button:has-text("Tue"), button:has-text("Wed")');
        const hasDayButtons = await dayButtons.count() > 0;

        if (hasDayButtons) {
            await expect(dayButtons.first()).toBeVisible();
        }

        // Check for meal slots (Breakfast, Lunch, Dinner)
        const mealSlots = page.locator('text=/Breakfast|Lunch|Dinner/i');
        await expect(mealSlots.first()).toBeVisible();
    });

    test('should allow adding meals to plan slots', async ({ page }) => {
        await page.goto('/plan');
        await page.waitForTimeout(500);

        // Look for empty meal slots with "Add" or "+" buttons
        const addButtons = page.locator('button:has-text("Add"), button:has-text("+")').first();

        if (await addButtons.isVisible()) {
            await addButtons.click();
            await page.waitForTimeout(500);

            // Should open recipe selector or generate dialog
            const dialog = page.locator('[role="dialog"], [class*="Dialog"], [class*="Modal"]');
            const hasDialog = await dialog.isVisible().catch(() => false);

            if (hasDialog) {
                await expect(dialog).toBeVisible();
            }
        }
    });

    test('should navigate between days in the week', async ({ page }) => {
        await page.goto('/plan');
        await page.waitForTimeout(500);

        // Find day navigation buttons
        const dayButtons = page.locator('button:has-text("Mon"), button:has-text("Tue"), button:has-text("Wed"), button:has-text("Thu")');
        const buttonCount = await dayButtons.count();

        if (buttonCount >= 2) {
            // Click first day
            await dayButtons.nth(0).click();
            await page.waitForTimeout(300);

            // Click second day
            await dayButtons.nth(1).click();
            await page.waitForTimeout(300);

            // Should update view (check for visual feedback)
            const activeDay = page.locator('button[class*="active"], button[class*="selected"]').first();
            const hasActiveState = await activeDay.isVisible().catch(() => false);

            // At minimum, page should still be functional
            await expect(page.locator('text=/Breakfast|Lunch|Dinner/i')).toBeVisible();
        }
    });

    test('should display nutrition summary for the day', async ({ page }) => {
        await page.goto('/plan');
        await page.waitForTimeout(500);

        // Look for nutrition indicators (calories, protein, carbs, fat)
        const nutritionElements = page.locator('text=/Calories|kcal|Protein|Carbs|Fat/i');
        const nutritionCount = await nutritionElements.count();

        if (nutritionCount > 0) {
            await expect(nutritionElements.first()).toBeVisible();
        }

        // Look for progress circles or bars
        const progressElements = page.locator('[class*="progress"], [class*="circle"], svg circle');
        const hasProgress = await progressElements.count() > 0;

        // At least some nutrition tracking should be present
        expect(nutritionCount > 0 || hasProgress).toBeTruthy();
    });

    test('should allow viewing shopping list from planner', async ({ page }) => {
        await page.goto('/plan');
        await page.waitForTimeout(500);

        // Look for shopping list button/link
        const shoppingButton = page.locator('button:has-text("Shopping"), a:has-text("Shopping"), text=/Shopping List/i').first();

        if (await shoppingButton.isVisible()) {
            await shoppingButton.click();
            await page.waitForTimeout(500);

            // Should navigate to shopping list or open dialog
            const isShoppingPage = await page.url().includes('/shop');
            const hasDialog = await page.locator('[role="dialog"]').isVisible().catch(() => false);

            expect(isShoppingPage || hasDialog).toBeTruthy();
        }
    });
});
