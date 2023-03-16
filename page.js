import { invalidate, depends } from "./lib/index";

const btn = document.getElementById("btn");
if (!btn) throw new Error("No button found");

const count_1 = document.getElementById("invalidations_1");
if (!count_1) throw new Error("No count found");

const count_2 = document.getElementById("invalidations_2");
if (!count_2) throw new Error("No count found");

const capped_count = document.getElementById("capped_count");
if (!capped_count) throw new Error("No count found");

depends("data", () => {
  count_1.textContent = String(Number(count_1.textContent) + 1);
});

depends("data", () => {
  count_2.textContent = String(Number(count_2.textContent) + 1);
});

const unsub_capped = depends("data", () => {
  const count = Number(capped_count.textContent);
  if (count >= 2) {
    unsub_capped();
    return;
  }
  capped_count.textContent = String(count + 1);
});

btn.addEventListener("click", () => {
  invalidate("data");
});
