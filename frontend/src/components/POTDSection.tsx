import { useEffect, useState } from "react";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const POTDSection = () => {
  const [pictureOfTheDay, setPictureOfTheDay] = useState(null);
  const [featuredImageData, setFeaturedImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openFeaturedPic, setOpenFeaturedPic] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);

  const fetchPOTD = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/v1/picture/potd");
      const image = {
        copyright: res.data.copyright,
        date: res.data.date,
        src: res.data.hdurl,
        explanation: res.data.explanation,
        title: res.data.title,
      };
      setPictureOfTheDay(image);
    } catch (err) {
      console.error("Error fetching potd:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedImage = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/gallery/featured", {
        withCredentials: true,
      });
      setFeaturedImageData(res.data[0]);
    } catch (err) {
      console.error("Error fetching featured image:", err);
    }
  };

  useEffect(() => {
    fetchPOTD();
    fetchFeaturedImage();
  }, []);

  const pictureSlides = pictureOfTheDay
    ? [
        {
          src: pictureOfTheDay.src,
          alt: pictureOfTheDay.title,
          description: pictureOfTheDay.explanation,
        },
      ]
    : [];

    const featuredSlides = featuredImageData
    ? [
        {
          src: featuredImageData.imageUrl,
          alt: featuredImageData.title,
          description: featuredImageData.caption,
        },
      ]
    : [];

  return (
    <section className="mb-4 py-4 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Spotlight Gallery</h2>
        <p className="text-xl hidden md:block text-gray-400 max-w-3xl mx-auto">
          A daily glimpse into the wonders of space from official NASA selections to exceptional
          images by our own club members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* POTD Card */}
        {pictureOfTheDay && (
          <div
            className="cosmic-card overflow-hidden shadow-lg cursor-pointer"
            onClick={() => setOpenLightbox(true)}
          >
            <div className="relative aspect-[16/9] sm:aspect-video">
              <img
                src={pictureOfTheDay.src}
                alt={pictureOfTheDay.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" />
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Picture of the Day</h3>
              <p className="text-sm text-gray-300 mb-3">{pictureOfTheDay.title}</p>
              <p className="text-sm text-gray-400 mb-3 hidden sm:block">
                {(pictureOfTheDay.explanation).slice(0, 300)}...
              </p>
              <p className="text-xs text-gray-500">
                Courtesy: {pictureOfTheDay.copyright || "NASA"}
              </p>
            </div>
          </div>
        )}

        {/* Club Featured Card */}
        {featuredImageData && (
          <div className="cosmic-card overflow-hidden shadow-lg">
            <div className="relative aspect-[16/9] sm:aspect-video"
            onClick={() => setOpenFeaturedPic(true)}
            >
              <img
                src={featuredImageData.imageUrl}
                alt="Featured by Club Member"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" />
            </div>
            <div className="p-4 sm:p-6">
                  <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                    Featured Pic
                  </p>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Club Member’s Featured Picture
              </h3>
              <p className="text-sm text-gray-400 mb-3">{featuredImageData.caption}</p>
              <div className="flex items-center gap-2">
                {/* <img
                  src="images/placeholder.svg"
                  loading="lazy"
                  alt={featuredImageData.author}
                  className="w-8 h-8 rounded-full object-cover"
                /> */}
                <div>
                  <h4 className="text-sm font-semibold">Pictured by: {featuredImageData.author}</h4>
                  <p className="text-xs text-gray-400 mb-2">ISA Club</p>
                  <hr className="mb-2"/>
                  <p className="text-xs text-gray-400">* We’re looking for amazing space shots from the community!
                  Send us your best astro photos for a chance to be featured here.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox for potd */}
      {openLightbox && pictureOfTheDay && (
        <Lightbox
          open={openLightbox}
          close={() => setOpenLightbox(false)}
          slides={pictureSlides}
          plugins={[Captions, Zoom]}
          carousel={{
            finite: true, // disables infinite loop if we hae single image
          }}
          controller={{
            closeOnBackdropClick: true,
          }}
          render={{
            buttonPrev: pictureSlides.length > 1 ? undefined : () => null,
            buttonNext: pictureSlides.length > 1 ? undefined : () => null,
          }}
        />
      )}

      {/* Lightbox for featured */}
      {openFeaturedPic && pictureOfTheDay && (
        <Lightbox
          open={openFeaturedPic}
          close={() => setOpenFeaturedPic(false)}
          slides={featuredSlides}
          plugins={[Captions]}
        />
      )}
    </section>
  );
};

export default POTDSection;