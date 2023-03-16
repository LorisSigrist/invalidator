import { test, expect } from '@playwright/test';

test("Invalidation works with one button and one dependent", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("invalidations_1")).toHaveText("0");
  await page.getByTestId("btn").click();
  await expect(page.getByTestId("invalidations_1")).toHaveText("1");
});

test("Invalidation works with one button and two dependents", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("invalidations_1")).toHaveText("0");
  await expect(page.getByTestId("invalidations_2")).toHaveText("0");
  await page.getByTestId("btn").click();
  await expect(page.getByTestId("invalidations_1")).toHaveText("1");
  await expect(page.getByTestId("invalidations_2")).toHaveText("1");
});