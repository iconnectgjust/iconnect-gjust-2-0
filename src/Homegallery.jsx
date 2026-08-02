import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Homegallery.css";
import Masonry from './Masonry';
import Lightbox from './Lightbox';
import { fetchGalleryAlbums } from "./lib/publicData";

function Homegallery() {
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
      height: img.height || 380,
      index: i,
    }));
  }, [albums, activeAlbum]);

  return (
    <>
      <section id="gallery" className="whitegallery">
        <div className="galleryheading">GALLERY</div>

        {albums.length > 1 && (
          <div className="album-chips">
            {albums.map((album) => (
              <button
                key={album.id}
                className={`album-chip ${album.id === activeAlbum ? "album-chip-active" : ""}`}
                onClick={() => setActiveAlbum(album.id)}
              >
                {album.title}
              </button>
            ))}
          </div>
        )}

        {items.length > 0 && (
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
        )}

        <div className="gallery-more">
          <Link to="/gallery"><button><span>All Albums →</span></button></Link>
        </div>

        {lightboxIndex !== null && (
          <Lightbox
            images={items}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </section>
    </>
  );
}

export default Homegallery;
