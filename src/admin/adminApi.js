import { supabase } from "../supabaseClient";

// Upload a Blob/File to the media bucket, returns its public URL
export async function uploadMedia(folder, blob, ext = "jpg") {
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, blob, {
    cacheControl: "31536000",
    contentType: blob.type || "image/jpeg",
  });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

// Crop an image element region to a JPEG blob (used by the cropper)
export function cropToBlob(imageSrc, cropPixels, maxSize = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.min(1, maxSize / cropPixels.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(cropPixels.width * scale);
      canvas.height = Math.round(cropPixels.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height,
        0, 0, canvas.width, canvas.height
      );
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("crop failed"))), "image/jpeg", 0.88);
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

// Swap the sort values of two adjacent rows (↑/↓ reordering)
export async function swapSort(table, a, b) {
  const { error: e1 } = await supabase.from(table).update({ sort: b.sort }).eq("id", a.id);
  const { error: e2 } = await supabase.from(table).update({ sort: a.sort }).eq("id", b.id);
  if (e1 || e2) throw e1 || e2;
}
