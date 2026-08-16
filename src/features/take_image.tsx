import { onMount, type JSX, type Setter } from "solid-js";


export function CameraView(props: {ImageSetter: Setter<Blob|undefined>, styles?: JSX.CSSProperties, Class?: string}) {
  let videoRef: HTMLVideoElement|undefined;

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
      videoRef.srcObject = stream;
      videoRef.play();
    });
  });
  return <>
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
  </>
}
