
import { createEffect, createSignal, on, onMount } from "solid-js";
import { warmReceiptOcr, type ReceiptOcrLoadState } from "./receipt_ocr";
import create from "lodash/create";
const [ocrLoadState, setOcrLoadState] = createSignal<ReceiptOcrLoadState>("idle");
const [ocrLoadProgress, setOcrLoadProgress] = createSignal("Not loaded");

async function initializeReceiptOcr() {
  setOcrLoadState("loading");
  setOcrLoadProgress("Starting OCR worker…");
  try {
    await warmReceiptOcr(setOcrLoadProgress);
    setOcrLoadState("ready");
    setOcrLoadProgress("OCR is ready for a receipt photo.");
  } catch {
    setOcrLoadState("error");
    setOcrLoadProgress("OCR could not be initialized. Try again.");
  }
}


export default function LoadingReceiptOcr() {
    onMount(() => {
        initializeReceiptOcr().then(() => {
            setOcrLoadState("ready");
            setOcrLoadProgress("OCR is ready for a receipt photo.");
        })
    })
    createEffect(() => {
        console.log("ocrLoadState", ocrLoadState());
        if (ocrLoadState() === "ready") {
            setOcrLoadProgress("OCR is ready for a receipt photo.");
        }
    })
    return <></>
//   return <section aria-labelledby="receipt-ocr-heading">
//   <h2 id="receipt-ocr-heading">Receipt OCR</h2>
//   <p class="supporting-copy">
//     Prepare OCR before taking a photo so the first scan does not wait for its language model.
//   </p>
//   <button
//     class="button button-secondary"
//     type="button"
//     onClick={() => void initializeReceiptOcr()}
//     disabled={ocrLoadState() === "loading" || ocrLoadState() === "ready"}
//   >
//     {ocrLoadState() === "ready" ? "OCR ready" : "Prepare receipt OCR"}
//   </button>
//   <p class="helper-text" role="status" aria-live="polite">
//     {ocrLoadProgress()}
//   </p>
// </section>

}