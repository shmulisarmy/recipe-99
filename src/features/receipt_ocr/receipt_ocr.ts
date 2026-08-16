import { createWorker, type Worker } from "tesseract.js";

export type ReceiptOcrLoadState = "idle" | "loading" | "ready" | "error";

let workerPromise: Promise<Worker> | undefined;

/**
 * Starts one browser-resident English OCR worker. This is deliberately separate
 * from receipt parsing so the capture flow can warm the worker before a photo.
 */
export function warmReceiptOcr(onProgress?: (status: string) => void) {
    if (!workerPromise) {
        workerPromise = createWorker("eng", 1, {
            logger: ({ status }) => onProgress?.(status),
        }).catch((error) => {
            workerPromise = undefined;
            throw error;
        });
    }
    return workerPromise;
}

export async function readReceiptOcr(image: Blob): Promise<string> {
    const worker = await warmReceiptOcr();
    const result = await worker.recognize(image);
    return result.data.text;
}
