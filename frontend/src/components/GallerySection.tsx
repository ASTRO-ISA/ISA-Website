import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";

const GallerySection = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:3000/api/v1/gallery')
      .then((res) => {
        setImages(
          res.data.map((img) => ({
            _id: img._id,
            src: img.imageUrl,
            caption: img.caption || "",
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching gallery.", err);
        setLoading(false);
      });
  }, []);

  const displayedImages = [...images].reverse().slice(0, 4);

  const handleScroll = () => {
    const scrollX = scrollRef.current?.scrollLeft || 0;
    const width = scrollRef.current?.offsetWidth || 1;
    const index = Math.round(scrollX / width);
    setActiveIndex(index);
  };

  return (
    <section className="py-10 bg-space-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">ISA Club Gallery</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our community activities, workshops, and astronomical observations.
          </p>
        </div>

        {/* Horizontal scroll on mobile */}
        <div className="md:hidden overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x"
          >
            {displayedImages.map((image, i) => (
              <div
                key={i}
                onClick={() => {
                  setOpen(true);
                  setIndex(i);
                }}
                className="w-72 flex-shrink-0 snap-start group overflow-hidden rounded-lg relative animate-fade-in cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center mt-4">
            {displayedImages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'bg-white' : 'bg-gray-500/50'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Grid for desktop view */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedImages.map((image, i) => (
            <div
              key={i}
              onClick={() => {
                setOpen(true);
                setIndex(i);
              }}
              className="group overflow-hidden rounded-lg relative animate-fade-in cursor-pointer"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <img
                src={image.src}
                alt={image.caption}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-medium">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={displayedImages.map(img => ({ src: img.src, description: img.caption }))}
          plugins={[Captions]}
        />

        {/* <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors">
            <a href="https://www.instagram.com/isa.astrospace?igsh=cGgyeDB3M2d4dDJ5">View More Photos</a>
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default GallerySection;
