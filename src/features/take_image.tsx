import { onMount, createSignal, Show, type JSX, type Setter } from "solid-js";

type CameraError = "permission-denied" | "not-available" | "unknown";

export function CameraView(props: {ImageSetter: Setter<Blob|undefined>, styles?: JSX.CSSProperties, Class?: string}) {
  let videoRef: HTMLVideoElement|undefined;
  const [cameraError, setCameraError] = createSignal<CameraError | undefined>();

  function takeImage() {
    if (!videoRef) throw new Error("video ref not set");
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef, 0, 0);

    async function getImage(){
      const image = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error("Could not capture image")),
          "image/jpeg",
        );
      });
      return image;
    }
    getImage().then(image => props.ImageSetter(image));
  }

  onMount(() => {
    if (!videoRef) throw new Error("video ref not set");
      videoRef.muted = true;
      videoRef.playsInline = true;
      const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 960 },
        height: { ideal: 1920 },
        aspectRatio: { ideal: 1 / 2 },
        facingMode: { ideal: isMobile ? "environment" : "user" },
      },
    }).then((stream) => {
      videoRef!.srcObject = stream;
      videoRef!.play();
    }).catch((err: unknown) => {
      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setCameraError("permission-denied");
      } else if (err instanceof DOMException && (err.name === "NotFoundError" || err.name === "DevicesNotFoundError")) {
        setCameraError("not-available");
      } else {
        setCameraError("unknown");
      }
    });
  });

  return (
    <Show
      when={!cameraError()}
      fallback={
        <div class="camera-error" role="alert" style={{ ...props.styles, display: "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", gap: "12px", background: "var(--chalk)", "border-radius": "1rem" }}>
          <Show when={cameraError() === "permission-denied"}>
            <p class="supporting-copy" style={{ "text-align": "center", padding: "0 1rem" }}>
              Camera access was blocked. Allow camera access in your browser settings, then reload the page.
            </p>
          </Show>
          <Show when={cameraError() === "not-available"}>
            <p class="supporting-copy" style={{ "text-align": "center", padding: "0 1rem" }}>
              No camera found. Connect a camera and reload the page.
            </p>
          </Show>
          <Show when={cameraError() === "unknown"}>
            <p class="supporting-copy" style={{ "text-align": "center", padding: "0 1rem" }}>
              The camera couldn't start. Reload the page to try again.
            </p>
          </Show>
          <button class="button button-secondary" type="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      }
    >
      <div class="camera-view">
        <video
          ref={videoRef}
          style={{ ...props.styles, display: "block" }}
          class={props.Class}
        />
        <button
          class="camera-shutter"
          type="button"
          aria-label="Take image"
          title="Take image"
          onClick={takeImage}
        />
      </div>
    </Show>
  );
}
