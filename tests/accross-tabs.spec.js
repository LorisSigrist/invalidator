import { test, expect } from "@playwright/test";

test("Invalidation gets propagated across tabs", async ({ context }) => {
  //Load page 1 and click button
  const page1 = await context.newPage();
  await page1.goto("/");

  await page1.getByTestId("btn").click();
  await expect(page1.getByTestId("invalidations_1")).toHaveText("1");

  //Load page 2
  const page2 = await context.newPage();
  await page2.goto("/");
  await expect(page2.getByTestId("invalidations_1")).toHaveText("0");

  //Click button on page 2
  await page2.getByTestId("btn").click();
  await expect(page2.getByTestId("invalidations_1")).toHaveText("1");

  //The button click on page 2 should have caused the dependents on page 1 to be invalidated
  await expect(page1.getByTestId("invalidations_1")).toHaveText("2");
});


test("Invalidation gets propagated across multiple tabs", async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();

    await page1.goto("/");
    await page2.goto("/");
    await page3.goto("/");

    await page1.getByTestId("btn").click();
    await expect(page1.getByTestId("invalidations_1")).toHaveText("1");
    await expect(page2.getByTestId("invalidations_1")).toHaveText("1");
    await expect(page3.getByTestId("invalidations_1")).toHaveText("1");

    await page2.getByTestId("btn").click();

    await expect(page1.getByTestId("invalidations_1")).toHaveText("2");
    await expect(page2.getByTestId("invalidations_1")).toHaveText("2");
    await expect(page3.getByTestId("invalidations_1")).toHaveText("2");

    await page3.getByTestId("btn").click();

    await expect(page1.getByTestId("invalidations_1")).toHaveText("3");
    await expect(page2.getByTestId("invalidations_1")).toHaveText("3");
    await expect(page3.getByTestId("invalidations_1")).toHaveText("3");
});

test("Invalidation gets propagated across multiple tabs with multiple dependents", async ({ context }) => {

    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();

    await page1.goto("/");
    await page2.goto("/");
    await page3.goto("/");

    await page1.getByTestId("btn").click();
    await expect(page1.getByTestId("invalidations_1")).toHaveText("1");
    await expect(page1.getByTestId("invalidations_2")).toHaveText("1");
    await expect(page2.getByTestId("invalidations_1")).toHaveText("1");
    await expect(page2.getByTestId("invalidations_2")).toHaveText("1");
    await expect(page3.getByTestId("invalidations_1")).toHaveText("1");
    await expect(page3.getByTestId("invalidations_2")).toHaveText("1");

    await page2.getByTestId("btn").click();
    await expect(page1.getByTestId("invalidations_1")).toHaveText("2");
    await expect(page1.getByTestId("invalidations_2")).toHaveText("2");
    await expect(page2.getByTestId("invalidations_1")).toHaveText("2");
    await expect(page2.getByTestId("invalidations_2")).toHaveText("2");
    await expect(page3.getByTestId("invalidations_1")).toHaveText("2");
    await expect(page3.getByTestId("invalidations_2")).toHaveText("2");
});