# Browser still-image capture research

## Recommendation

For the current mobile receipt-photo prototype, use a file input configured for images with a preference for the outward-facing camera:

```html
<input type="file" accept="image/*" capture="environment">
```

This delegates preview, autofocus/exposure, shutter timing, retake, and camera permission UI to the phone's native camera flow. After the user confirms the photo, the selected value is already a browser `File`, which can be previewed or uploaded directly. The HTML Media Capture specification explicitly defines this as the simple, declarative option and reserves `getUserMedia()` for cases needing finer-grained control. [HTML Media Capture, introduction and capture control](https://www.w3.org/TR/html-media-capture/#introduction)

This is a better prototype boundary than a utility that silently opens a stream and immediately snapshots its first frame. The native camera gives the user the preview-and-shutter interaction the prototype currently lacks, while avoiding custom camera lifecycle UI.

## Important limitation

`capture="environment"` is a preference, not a guarantee. The specification allows the browser to fall back to an implementation-specific camera and says it *should* invoke a capture-oriented file picker. MDN marks `capture` as limited availability, notes that it works best on mobile, and says desktop browsers will commonly show a normal file picker. The application should therefore accept either a newly captured image or an existing image chosen by the user. [HTML Media Capture, `capture` attribute](https://www.w3.org/TR/html-media-capture/#the-capture-attribute) [MDN, `capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)

The user must initiate the file control. The capture specification expects the offer to capture media to require a specific interaction with browser-controlled UI, recommends obtaining consent, and warns that image metadata such as EXIF location can disclose more than the user expects. [HTML Media Capture, security and privacy](https://www.w3.org/TR/html-media-capture/#security-and-privacy-considerations)

## When a custom live preview is justified

Use `getUserMedia()` only if Recipe 99 needs an in-app viewfinder or custom controls such as a receipt guide, crop overlay, torch control, or repeated captures without leaving the page. That flow should:

1. Start only after a user action and request `video` with an `environment` facing-mode preference and no audio.
2. Show the returned stream in a visible, inline `<video>` preview.
3. Wait until video metadata/dimensions are available before enabling capture.
4. Wait for the user to press an explicit shutter button; do not capture immediately after `video.play()`.
5. On the shutter press, create the still as a `Blob` using `ImageCapture.takePhoto()` where supported, or draw the current video frame to a correctly sized canvas and call `canvas.toBlob()` as the broadly available fallback.
6. Stop every media track on capture, cancel, component cleanup, and error paths.

`getUserMedia()` is widely available but requires a secure context (HTTPS or localhost), always requires camera permission, and can reject when permission is denied, no matching camera exists, hardware access fails, or the requested constraints cannot be met. Top-level documents may request access; embedded documents need camera permission through Permissions Policy. Browsers must indicate camera use. [MDN, `getUserMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

`loadedmetadata` means the media dimensions are known, which prevents a zero-sized capture canvas, but it does not replace the explicit shutter: the live preview is what lets the user wait for focus and exposure and choose the correct moment. [MDN, `loadedmetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event)

`ImageCapture.takePhoto()` makes a camera exposure and resolves to a `Blob`; it can expose photo settings such as fill light, but it is not the compatibility baseline for this prototype. `canvas.toBlob()` is widely available and also returns a `Blob`, with control over image type and lossy quality. [MDN, `ImageCapture.takePhoto()`](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture/takePhoto) [MDN, `canvas.toBlob()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)

Tracks should be stopped explicitly when the camera is no longer needed. Calling `MediaStreamTrack.stop()` disassociates the track from its camera source so the source can be released once no tracks use it. [MDN, `MediaStreamTrack.stop()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop)

## Decision summary

| Need | Best fit |
| --- | --- |
| Minimal mobile receipt capture with native preview, shutter, and retake | File input with `accept="image/*" capture="environment"` |
| Desktop fallback or choosing an existing receipt image | The same file input; handle the returned `File` either way |
| Branded in-app viewfinder, crop guide, torch, or repeat capture | `getUserMedia()` preview plus explicit shutter and cleanup |
| Upload value | Native flow returns a `File`; custom flow returns a `Blob` (or wrap it in a `File` if a filename is useful) |

## Sources

- [W3C HTML Media Capture Recommendation](https://www.w3.org/TR/html-media-capture/)
- [MDN: `capture` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)
- [MDN: `<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- [MDN: `MediaDevices.getUserMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [MDN: `ImageCapture.takePhoto()`](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture/takePhoto)
- [MDN: `HTMLCanvasElement.toBlob()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
- [MDN: `loadedmetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event)
- [MDN: `MediaStreamTrack.stop()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop)
