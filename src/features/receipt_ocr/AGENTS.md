# Purpose

Own browser-resident receipt text extraction used to supplement image-based ingredient generation.

# Ownership

- `receipt_ocr.ts` owns the singleton English Tesseract worker, warm-up lifecycle, progress reporting, and text recognition.
- `loading_component.tsx` starts OCR warm-up when Intake mounts.

# Local Contracts

- Keep OCR in the browser; it produces advisory text while the captured image remains the authoritative Agent input.
- Reuse one worker promise across warm-up and recognition, and clear a failed promise so a later attempt can retry.
- Keep capture, upload, Agent invocation, and generated-draft state in the parent Intake workflow.

# Verification

- Run `npm run build`.
- In the browser, verify worker warm-up, first-image recognition, and retry behavior after a worker-load failure when this subsystem changes.

# Child DOX Index
