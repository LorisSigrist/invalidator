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

test("Unsubscribing from a dependent works", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("capped_count")).toHaveText("0");
  
  await page.getByTestId("btn").click();
  await expect(page.getByTestId("capped_count")).toHaveText("1");
  await page.getByTestId("btn").click();
  await expect(page.getByTestId("capped_count")).toHaveText("2");

  //It should have unsubscribed after hitting 2
  await page.getByTestId("btn").click();
  await expect(page.getByTestId("capped_count")).toHaveText("2");
});

test("If a function is used as a dependent multiple times, it should be called multiple times", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("doubled_count")).toHaveText("0");
  await page.getByTestId("btn").click();
  await expect(page.getByTestId("doubled_count")).toHaveText("2");
});

test("If a function is used as a dependent multiple times, and unsubscribed from, it should be called the correct number of times", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("doubled_count")).toHaveText("0");
  await page.getByTestId("btn").click();
  await expect(page.getByTestId("doubled_count")).toHaveText("2");
  await page.getByTestId("btn").click();
  await expect(page.getByTestId("doubled_count")).toHaveText("4");

  //Unsubscribe from one of the dependents
  await page.getByTestId("doubled_unsub_one_btn").click();

  await page.getByTestId("btn").click(); //This should only increment the count by 1
  await expect(page.getByTestId("doubled_count")).toHaveText("5");
});