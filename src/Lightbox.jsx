import { useEffect, useCallback } from "react";
import "./Lightbox.css";

// Full-screen image viewer: arrows / Esc / backdrop click to close.
function Lightbox({ images, index, onClose, onNavigate }) {
  const prev = useCallback(() => onNavigate((index - 1 + images.length) % images.length), [index, images.length, onNavigate]);
  const next = useCallback(() => onNavigate((index + 1) % images.length), [index, images.length, onNavigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  if (index === null || !images[index]) return null;
  const current = images[index];

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-label="Image viewer">
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <i className="bx bx-x"></i>
      </button>
      <button className="lightbox-arrow lightbox-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image">
        <i className="bx bx-chevron-left"></i>
      </button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={current.img} alt={current.caption || "Gallery image"} />
        {current.caption && <figcaption>{current.caption}</figcaption>}
        <span className="lightbox-count">{index + 1} / {images.length}</span>
      </figure>
      <button className="lightbox-arrow lightbox-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image">
        <i className="bx bx-chevron-right"></i>
      </button>
    </div>
  );
}

export default Lightbox;
