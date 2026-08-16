import { expect, test } from "@playwright/test";

test("sign-in presents the product and stays free of browser errors", async ({ page }) => {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    // Google rejects the isolated Playwright origin before its button renders.
    // The application owns and presents that recoverable provider state; keep
    // unrelated browser errors as test failures.
    if (
      text === "Failed to load resource: the server responded with a status of 403 ()" ||
      text.includes("[GSI_LOGGER]: The given origin is not allowed")
    ) return;
    errors.push(text);
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/sign-in");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Plan meals from what’s already in your kitchen.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Sign in to your kitchen plan" }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
  expect(errors).toEqual([]);
});
