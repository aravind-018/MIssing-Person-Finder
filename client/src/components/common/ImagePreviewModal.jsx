import { useEffect } from "react";
import "./ImagePreviewModal.css";

function ImagePreviewModal({ images = [], index = 0, onClose, onIndexChange, alt = "Image preview" }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && images.length > 1) onIndexChange((index - 1 + images.length) % images.length);
      if (event.key === "ArrowRight" && images.length > 1) onIndexChange((index + 1) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, index, onClose, onIndexChange]);

  if (!images.length) return null;
  const image = images[index];
  const imageUrl = image.startsWith("http") ? image : `/uploads/${image}`;

  return <div className="image-preview-backdrop" role="dialog" aria-modal="true" aria-label={alt} onMouseDown={onClose}>
    <div className="image-preview-dialog" onMouseDown={(event) => event.stopPropagation()}>
      <button className="image-preview-close" type="button" onClick={onClose} aria-label="Close preview">×</button>
      {images.length > 1 && <button className="image-preview-nav image-preview-prev" type="button" onClick={() => onIndexChange((index - 1 + images.length) % images.length)} aria-label="Previous image">‹</button>}
      <img src={imageUrl} alt={alt} className="image-preview-image" />
      {images.length > 1 && <button className="image-preview-nav image-preview-next" type="button" onClick={() => onIndexChange((index + 1) % images.length)} aria-label="Next image">›</button>}
      {images.length > 1 && <span className="image-preview-count">{index + 1} / {images.length}</span>}
    </div>
  </div>;
}

export default ImagePreviewModal;
