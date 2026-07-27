import { useState } from "react";
import Cropper from "react-easy-crop";
import { cropToBlob } from "./adminApi";

// Modal: pick zoom/position on a 1:1 crop, returns a JPEG blob via onDone(blob)
function PhotoCropper({ src, aspect = 1, onDone, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!pixels) return;
    setBusy(true);
    try {
      onDone(await cropToBlob(src, pixels));
    } catch {
      alert("Could not crop the image — try a different file.");
      setBusy(false);
    }
  };

  return (
    <div className="admin-modal">
      <div className="admin-modal-box admin-crop-box">
        <div className="admin-crop-area">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, px) => setPixels(px)}
          />
        </div>
        <input
          type="range" min="1" max="3" step="0.05" value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label="Zoom"
        />
        <div className="admin-row-end">
          <button className="admin-btn admin-btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="admin-btn" onClick={confirm} disabled={busy}>{busy ? "Cropping…" : "Use this crop"}</button>
        </div>
      </div>
    </div>
  );
}

export default PhotoCropper;
