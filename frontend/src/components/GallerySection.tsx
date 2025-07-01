import axios from 'axios';
import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
// const images = [
//   {
//     src: "/images/262db6f8-4cbd-4487-98e3-a795fa8f33ae.png",
//     alt: "ISA Club Activities",
//     caption: "Club Members During Workshop"
//   },
//   {
//     src: "/images/51dc2c27-82d2-40f1-a203-b0c090ea514d.png",
//     alt: "ISA Presentations",
//     caption: "Space Science Presentation"
//   },
//   {
//     src: "/images/582ac169-4b33-4482-a21a-eb007829c86b.png",
//     alt: "ISA Group Photo",
//     caption: "ISA Club Group Photo"
//   },
//   {
//     src: "/images/0dc13df5-c34b-4f8c-bcb1-725295edb6eb.png",
//     alt: "ISA Workshop",
//     caption: "Student Workshop Session"
//   }
// ];

const GallerySection = () => {

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const res = axios
    .get('http://localhost:3000/api/v1/gallery')
    .then((res) => {
      const images = {
        src: res.data.imageUrl,
        caption: res.data.caption
      }
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
    })
  }, [])

  return (
    <section className="py-10 bg-space-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">ISA Club Gallery</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our community activities, workshops, and astronomical observations.
          </p>
        </div>

        {/* gallery with react lightbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.slice(0, 4).map((image, i) => (
          <div key={i} onClick={() => { setOpen(true); setIndex(i); }} className="group overflow-hidden rounded-lg relative animate-fade-in cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
            <img src={image.src} alt={image.alt} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white font-medium">{image.caption}</p>
            </div>
          </div>
        ))}
      </div>
      <Lightbox open={open} close={() => setOpen(false)} index={index} slides={images.map(img => ({ src: img.src }))} />

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
