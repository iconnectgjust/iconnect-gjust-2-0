import { useEffect, useMemo, useState } from "react";
import "./Gallery.css";
import Masonry from "../Masonry";
import Lightbox from "../Lightbox";
import Seo from "../Seo";
import Homefooter from "../Homefooter";
import { fetchGalleryAlbums } from "../lib/publicData";

function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    fetchGalleryAlbums().then((a) => {
      setAlbums(a);
      setActiveAlbum(a[0]?.id ?? null);
    });
  }, []);

  const items = useMemo(() => {
    const album = albums.find((a) => a.id === activeAlbum) || albums[0];
    return (album?.images || []).map((img, i) => ({
      id: `${album.id}-${i}`,
      img: img.img,
      caption: img.caption,
      url: "#",
      height: img.height || 400,
      index: i,
    }));
  }, [albums, activeAlbum]);

  return (
    <div className="gallerypage">
      <Seo
        title="Gallery | Team iConnect — Events at GJUS&T Hisar"
        description="Photo albums from iConnect events at GJUS&T Hisar — Konark Techfest, E-Summit, workshops and more. The visual history of the team, year by year."
        path="/gallery"
      />
      <header className="gallerypage-hero">
        <h1>GALLERY</h1>
        <p>Every event, every year — the visual history of iConnect.</p>
      </header>

      {albums.length > 1 && (
        <div className="gallerypage-chips">
          {albums.map((album) => (
            <button
              key={album.id}
              className={`gallerypage-chip ${album.id === activeAlbum ? "gallerypage-chip-active" : ""}`}
              onClick={() => setActiveAlbum(album.id)}
            >
              {album.title}
            </button>
          ))}
        </div>
      )}

      <section className="gallerypage-grid">
        {items.length > 0 ? (
          <Masonry
            key={activeAlbum}
            items={items}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
            onItemClick={(item) => setLightboxIndex(item.index)}
          />
        ) : (
          <p className="gallerypage-empty">Photos are on their way — check back soon.</p>
        )}
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      <Homefooter />
    </div>
  );
}

export default Gallery;
